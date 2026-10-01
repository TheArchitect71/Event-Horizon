import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ClientsService } from '../clients.service';

@Component({ standalone: false, changeDetection: ChangeDetectionStrategy.Eager, selector: 'app-overview', template: `
  <div class="page-heading"><div><h1>Your people, connected.</h1><p>A shared place for profiles, expertise, and the details that matter.</p></div><a class="button primary" routerLink="/people/new" *ngIf="!store.loading && !store.error">Add person</a></div>
  <p *ngIf="store.loading" role="status">Loading directory…</p><div *ngIf="store.error" class="error" role="alert">{{ store.error }} <button (click)="store.load()">Try again</button></div>
  <ng-container *ngIf="!store.loading && !store.error">
    <div class="stats"><div><strong>{{ store.people.length }}</strong><span>People in the directory</span></div><div><strong>{{ organizations }}</strong><span>Organizations</span></div><div><strong>{{ expertise }}</strong><span>Areas of expertise</span></div></div>
    <section class="panel"><div class="section-heading"><h2>Directory preview</h2><a routerLink="/people">View all people</a></div>
      <p *ngIf="!store.people.length">Your directory is empty. Add the first person to get started.</p>
      <a class="person-row" *ngFor="let person of store.people.slice(-5).reverse()" [routerLink]="['/people', person.id]"><span class="avatar">{{ person.name.slice(0,1) }}</span><span><strong>{{ person.name }}</strong><small>{{ person.role }} · {{ person.organization || 'No organization' }}</small></span><span class="status">{{ person.status }}</span></a>
    </section>
    <section class="intro"><h2>One workspace, two beginnings.</h2><p>Event Horizon’s browsing and Epsilon’s profile editor now share one directory. Explore the sample astronaut profiles or add people from any field.</p><a routerLink="/about">How this workspace works</a></section>
  </ng-container>` })
export class OverviewComponent {
  constructor(public store: ClientsService) {}
  get organizations() { return new Set(this.store.people.map(p => p.organization).filter(Boolean)).size; }
  get expertise() { return new Set(this.store.people.map(p => p.expertise).filter(Boolean)).size; }
}

@Component({ standalone: false, changeDetection: ChangeDetectionStrategy.Eager, selector: 'app-directory', templateUrl: './directory.html' })
export class DirectoryComponent implements OnDestroy {
  query = ''; status = ''; organization = ''; sort = 'name'; view = 'cards'; message = '';
  private subscription: Subscription;
  constructor(public store: ClientsService, private route: ActivatedRoute, private router: Router) {
    this.subscription = route.queryParamMap.subscribe(params => {
      this.query = params.get('q') || ''; this.status = params.get('status') || ''; this.organization = params.get('organization') || '';
      this.sort = params.get('sort') === 'role' ? 'role' : 'name'; this.view = params.get('view') === 'table' ? 'table' : 'cards';
    });
    this.message = router.getCurrentNavigation()?.extras.state?.['message'] || '';
  }
  ngOnDestroy() { this.subscription.unsubscribe(); }
  get statuses() { return [...new Set(this.store.people.map(p => p.status))].sort(); }
  get organizations() { return [...new Set(this.store.people.map(p => p.organization).filter(Boolean))].sort(); }
  get filtered() {
    const query = this.query.trim().toLowerCase();
    return this.store.people.filter(p => (!query || [p.name, p.role, p.organization, p.expertise].join(' ').toLowerCase().includes(query))
      && (!this.status || p.status === this.status) && (!this.organization || p.organization === this.organization))
      .sort((a, b) => a[this.sort].localeCompare(b[this.sort]) || a.name.localeCompare(b.name));
  }
  apply() { this.router.navigate([], { relativeTo: this.route, queryParams: { q: this.query || null, status: this.status || null, organization: this.organization || null, sort: this.sort, view: this.view }, replaceUrl: true }); }
  clear() { this.query = this.status = this.organization = ''; this.apply(); }
}

@Component({ standalone: false, changeDetection: ChangeDetectionStrategy.Eager, selector: 'app-person-detail', templateUrl: './detail.html' })
export class PersonDetailComponent implements OnDestroy {
  id = ''; confirming = false; error = ''; message = ''; private subscription: Subscription;
  constructor(public store: ClientsService, route: ActivatedRoute, private router: Router) {
    this.subscription = route.paramMap.subscribe(params => { this.id = params.get('id') || ''; this.confirming = false; this.error = ''; });
    this.message = router.getCurrentNavigation()?.extras.state?.['message'] || '';
  }
  ngOnDestroy() { this.subscription.unsubscribe(); }
  get person() { return this.store.find(this.id); }
  remove() {
    try { const name = this.person?.name; this.store.delete(this.id); this.router.navigate(['/people'], { state: { message: name + ' was deleted.' } }); }
    catch (e) { this.error = (e as Error).message; }
  }
}

@Component({ standalone: false, changeDetection: ChangeDetectionStrategy.Eager, selector: 'app-person-form', templateUrl: './form.html' })
export class PersonFormComponent implements OnDestroy {
  id = ''; error = ''; submitted = false; private subscriptions = new Subscription(); private initializedId: string | null = null;
  form;
  constructor(public store: ClientsService, fb: FormBuilder, route: ActivatedRoute, private router: Router) {
    this.form = fb.nonNullable.group({ name: ['', [Validators.required, Validators.maxLength(120), Validators.pattern(/\S/)]], role: ['', [Validators.required, Validators.maxLength(120), Validators.pattern(/\S/)]], organization: ['', Validators.maxLength(160)], status: ['Active', [Validators.required, Validators.maxLength(80), Validators.pattern(/\S/)]], expertise: ['', Validators.maxLength(200)], notes: ['', Validators.maxLength(4000)] });
    this.subscriptions.add(route.paramMap.subscribe(params => { this.id = params.get('id') || ''; this.initializedId = null; this.populate(); }));
    this.subscriptions.add(store.people$.subscribe(() => this.populate()));
  }
  populate() { const person = this.store.find(this.id); if (person && this.initializedId !== this.id) { this.form.patchValue(person); this.initializedId = this.id; } }
  get missing() { return this.id && !this.store.loading && !this.store.find(this.id); }
  get cancelLink() { return this.id ? ['/people', this.id] : ['/people']; }
  ngOnDestroy() { this.subscriptions.unsubscribe(); }
  invalid(field: string) { const control = this.form.get(field); return control.invalid && (control.touched || this.submitted); }
  save() {
    this.submitted = true; this.error = ''; this.form.markAllAsTouched();
    if (this.form.invalid) return;
    try {
      const person = this.id ? this.store.update(this.id, this.form.getRawValue()) : this.store.create(this.form.getRawValue());
      this.router.navigate(['/people', person.id], { state: { message: this.id ? 'Changes saved.' : 'Person added to the directory.' } });
    } catch (e) { this.error = (e as Error).message; }
  }
}

@Component({ standalone: false, changeDetection: ChangeDetectionStrategy.Eager, selector: 'app-about', template: `
  <h1>About this workspace</h1><p class="lead">A people directory built from Event Horizon and Epsilon Reticuli B.</p>
  <section class="panel"><h2>Browse, create, update, delete</h2><p>The two original demos now share navigation, a data store, and record forms. People can belong to any organization or profession. The initial 50 astronaut records demonstrate the directory and retain their original mission and education details.</p><p>The bundled records are historical sample data, not a current NASA roster.</p></section>
  <section class="panel"><h2>Saved in this browser</h2><p>Every successful change is stored locally on this device and survives a reload. There is no account, server, or cross-device sync. Clearing this site’s browser storage removes your changes and restores the samples on the next visit.</p><button type="button" (click)="export()" [disabled]="store.loading || !!store.error">Export directory as JSON</button><p role="status" *ngIf="message">{{ message }}</p></section>
  <a routerLink="/people">Go to the directory</a>` })
export class AboutComponent {
  message = '';
  constructor(public store: ClientsService) {}
  export() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(this.store.people, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'event-horizon-people.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); this.message = 'Directory export downloaded.';
  }
}
@Component({ standalone: false, changeDetection: ChangeDetectionStrategy.Eager, selector: 'app-not-found', template: `<h1>Page not found</h1><p>This address does not match a page in your workspace.</p><a routerLink="/people">Return to people</a>` })
export class NotFoundComponent {}
