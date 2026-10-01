import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ClientsService, STORAGE_KEY } from './clients.service';
import { PersonInput } from './types';
const input: PersonInput = { name: ' Ada Lovelace ', role: ' Researcher ', organization: 'Analytical Lab', status: 'Active', expertise: 'Mathematics', notes: 'First note' };
describe('persistent people directory', () => {
  let http: HttpTestingController;
  beforeEach(() => { localStorage.removeItem(STORAGE_KEY); TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] }); http = TestBed.inject(HttpTestingController); });
  afterEach(() => { http.verify(); localStorage.removeItem(STORAGE_KEY); });
  function loaded() { const store = TestBed.inject(ClientsService); http.expectOne('assets/astronauts.json').flush([{ name: 'Sample Person', status: 'Retired', undergraduateMajor: 'Physics', spaceFlights: 2 }]); return store; }
  it('maps original data to stable profiles with mission background', () => { const store = loaded(); expect(store.people[0].id).toBe('sample-1'); expect(store.people[0].expertise).toBe('Physics'); expect(store.people[0].spaceFlights).toBe(2); });
  it('creates, updates, and deletes with persistence after every mutation', () => { const store = loaded(); const person = store.create(input); expect(person.name).toBe('Ada Lovelace'); expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).length).toBe(2); store.update(person.id, { ...input, notes: 'Updated' }); expect(store.find(person.id).notes).toBe('Updated'); store.delete(person.id); expect(store.find(person.id)).toBeUndefined(); expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).length).toBe(1); });
  it('reloads saved data without requesting samples', () => { const first = loaded(); const p = first.create(input); const second = new ClientsService(TestBed.inject(HttpClient)); expect(second.find(p.id).name).toBe('Ada Lovelace'); expect(second.loading).toBeFalse(); });
  it('preserves an intentionally empty directory after reload', () => { localStorage.setItem(STORAGE_KEY, '[]'); const store = TestBed.inject(ClientsService); expect(store.people).toEqual([]); expect(store.loading).toBeFalse(); });
  it('preserves original background when editing a seeded profile', () => { const store = loaded(); store.update('sample-1', input); expect(store.find('sample-1').spaceFlights).toBe(2); });
  it('leaves in-memory data unchanged when storage fails', () => { const store = loaded(); spyOn(Storage.prototype, 'setItem').and.throwError('QuotaExceededError'); expect(() => store.create(input)).toThrowError(/could not be saved/); expect(store.people.length).toBe(1); });
  it('protects corrupt saved data from being overwritten', () => { localStorage.setItem(STORAGE_KEY, '{broken'); const store = TestBed.inject(ClientsService); expect(store.error).toContain('could not be read'); expect(() => store.create(input)).toThrowError(/load successfully/); expect(localStorage.getItem(STORAGE_KEY)).toBe('{broken'); });
  it('rejects malformed saved records and duplicate ids', () => { localStorage.setItem(STORAGE_KEY, JSON.stringify([{ ...input, id: 'a' }, { ...input, id: 'a' }])); expect(TestBed.inject(ClientsService).error).toContain('could not be read'); });
  it('rejects blank required fields and missing record mutations', () => { const store = loaded(); expect(() => store.create({ ...input, name: '  ' })).toThrowError(/required/); expect(() => store.update('missing', input)).toThrowError(/no longer exists/); expect(() => store.delete('missing')).toThrowError(/no longer exists/); });
  it('supports retry after a failed sample request', () => { const store = TestBed.inject(ClientsService); http.expectOne('assets/astronauts.json').flush('error', { status: 500, statusText: 'Error' }); expect(store.error).toContain('could not load'); store.load(); http.expectOne('assets/astronauts.json').flush([]); expect(store.error).toBe(''); expect(store.loading).toBeFalse(); });
});
