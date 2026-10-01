import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ClientsService, STORAGE_KEY } from './clients.service';
import { DirectoryComponent, PersonFormComponent, PersonDetailComponent } from './directory/pages';
describe('combined workspace navigation and CRUD', () => {
  let store: ClientsService;
  beforeEach(async () => {
    localStorage.removeItem(STORAGE_KEY);
    await TestBed.configureTestingModule({ imports: [AppModule], providers: [provideHttpClient(), provideHttpClientTesting()] }).compileComponents();
    store = TestBed.inject(ClientsService);
    TestBed.inject(HttpTestingController).expectOne('assets/astronauts.json').flush([
      { name: 'Ada Sample', status: 'Active', undergraduateMajor: 'Physics' },
      { name: 'Ben Sample', status: 'Retired', undergraduateMajor: 'Geology' }
    ]);
  });
  afterEach(() => { TestBed.inject(HttpTestingController).verify(); localStorage.removeItem(STORAGE_KEY); });
  it('renders one cohesive navigation shell', () => { const fixture = TestBed.createComponent(AppComponent); fixture.detectChanges(); expect(fixture.nativeElement.textContent).toContain('People workspace'); expect(fixture.nativeElement.querySelectorAll('nav a').length).toBe(3); });
  it('loads the default overview and updates totals from real records', async () => { const harness = await RouterTestingHarness.create('/'); expect(harness.routeNativeElement.textContent).toContain('Your people, connected.'); expect(TestBed.inject(Router).url).toBe('/overview'); });
  it('restores search, filters, and table view from the URL', async () => { const harness = await RouterTestingHarness.create(); const page = await harness.navigateByUrl('/people?q=ada&status=Active&view=table', DirectoryComponent); expect(page.filtered.length).toBe(1); expect(harness.routeNativeElement.querySelectorAll('tbody tr').length).toBe(1); page.clear(); await harness.fixture.whenStable(); harness.detectChanges(); expect(page.filtered.length).toBe(2); });
  it('rejects whitespace-only fields without adding a profile', async () => { const harness = await RouterTestingHarness.create(); const page = await harness.navigateByUrl('/people/new', PersonFormComponent); page.form.patchValue({ name: '   ', role: 'Engineer' }); page.save(); harness.detectChanges(); expect(page.form.invalid).toBeTrue(); expect(store.people.length).toBe(2); expect(harness.routeNativeElement.textContent).toContain('Review the highlighted fields'); });
  it('creates via form, routes to detail, then edits and persists', async () => { const harness = await RouterTestingHarness.create(); const page = await harness.navigateByUrl('/people/new', PersonFormComponent); page.form.patchValue({ name: 'Casey', role: 'Designer', organization: 'Studio', expertise: 'UX' }); page.save(); await harness.fixture.whenStable(); const person = store.people.find(p => p.name === 'Casey'); expect(TestBed.inject(Router).url).toBe('/people/' + person.id); const edit = await harness.navigateByUrl('/people/' + person.id + '/edit', PersonFormComponent); expect(edit.form.controls.name.value).toBe('Casey'); edit.form.patchValue({ notes: 'Updated through editor' }); edit.save(); await harness.fixture.whenStable(); expect(store.find(person.id).notes).toBe('Updated through editor'); expect(JSON.parse(localStorage.getItem(STORAGE_KEY)).length).toBe(3); });
  it('requires confirmation before deletion and supports cancellation', async () => { const harness = await RouterTestingHarness.create(); const page = await harness.navigateByUrl('/people/sample-1', PersonDetailComponent); const buttons = Array.from(harness.routeNativeElement.querySelectorAll('button')); buttons.find(b => b.textContent.includes('Delete person')).click(); harness.detectChanges(); expect(page.confirming).toBeTrue(); expect(store.people.length).toBe(2); harness.routeNativeElement.querySelectorAll('button').forEach(b => { if (b.textContent.trim() === 'Cancel') b.click(); }); harness.detectChanges(); expect(page.confirming).toBeFalse(); page.confirming = true; harness.detectChanges(); harness.routeNativeElement.querySelectorAll('button').forEach(b => { if (b.textContent.includes('Confirm delete')) b.click(); }); await harness.fixture.whenStable(); expect(store.people.length).toBe(1); expect(TestBed.inject(Router).url).toBe('/people'); });
  it('handles missing profile and edit URLs gracefully', async () => { const harness = await RouterTestingHarness.create(); await harness.navigateByUrl('/people/missing'); expect(harness.routeNativeElement.textContent).toContain('Person not found'); await harness.navigateByUrl('/people/missing/edit'); expect(harness.routeNativeElement.querySelector('form')).toBeNull(); });
  it('handles an unknown route', async () => { const harness = await RouterTestingHarness.create('/does-not-exist'); expect(harness.routeNativeElement.textContent).toContain('Page not found'); });
});
