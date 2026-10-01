import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Person, PersonInput } from './types';

export const STORAGE_KEY = 'event-horizon.people.v1';
@Injectable({ providedIn: 'root' })
export class ClientsService {
  private state = new BehaviorSubject<Person[]>([]);
  people$ = this.state.asObservable();
  loading = true;
  error = '';
  constructor(private http: HttpClient) { this.load(); }
  get people() { return this.state.value; }
  load() {
    this.loading = true;
    this.error = '';
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved !== null) {
        const parsed = JSON.parse(saved);
        if (!Array.isArray(parsed) || !parsed.every(p => this.valid(p)) || new Set(parsed.map(p => p.id)).size !== parsed.length) {
          throw new Error('Invalid saved directory');
        }
        this.state.next(parsed);
        this.loading = false;
        return;
      }
    } catch {
      this.error = 'Saved data could not be read. Export or recover your browser data before clearing this site’s storage.';
      this.loading = false;
      return;
    }
    this.http.get<any[]>('assets/astronauts.json').subscribe({
      next: rows => {
        this.state.next(rows.map((a, index) => ({
          id: 'sample-' + (index + 1), name: a.name, role: 'Astronaut', organization: 'NASA sample directory',
          status: a.status || 'Unknown', expertise: a.undergraduateMajor || '', notes: '',
          spaceWalks: a.spaceWalks, spaceFlights: a.spaceFlights, missions: a.missions, almaMater: a.almaMater
        })));
        this.loading = false;
      },
      error: () => { this.error = 'The sample directory could not load. Try again.'; this.loading = false; }
    });
  }
  find(id: string) { return this.people.find(p => p.id === id); }
  create(input: PersonInput) {
    const person = this.clean({ ...input, id: crypto.randomUUID() });
    this.commit([...this.people, person]);
    return person;
  }
  update(id: string, input: PersonInput) {
    const existing = this.find(id);
    if (!existing) throw new Error('This person no longer exists.');
    const person = this.clean({ ...existing, ...input, id });
    this.commit(this.people.map(p => p.id === id ? person : p));
    return person;
  }
  delete(id: string) {
    if (!this.find(id)) throw new Error('This person no longer exists.');
    this.commit(this.people.filter(p => p.id !== id));
  }
  private valid(p: any): p is Person {
    return p && ['id', 'name', 'role', 'organization', 'status', 'expertise', 'notes'].every(k => typeof p[k] === 'string')
      && p.id.length > 0 && p.name.trim().length > 0 && p.role.trim().length > 0 && p.status.trim().length > 0;
  }
  private clean(p: Person): Person {
    const result = { ...p };
    for (const k of ['name', 'role', 'organization', 'status', 'expertise', 'notes']) result[k] = result[k].trim();
    if (!this.valid(result)) throw new Error('Name, role, and status are required.');
    return result;
  }
  private commit(people: Person[]) {
    if (this.loading || this.error) throw new Error('Wait for the directory to load successfully before changing records.');
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(people)); }
    catch { throw new Error('Changes could not be saved. Browser storage may be full or unavailable.'); }
    this.state.next(people);
  }
}
