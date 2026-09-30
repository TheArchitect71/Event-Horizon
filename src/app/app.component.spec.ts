import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import { ClientsService } from './clients.service';
describe('astronaut grid',()=>{beforeEach(async()=>{await TestBed.configureTestingModule({imports:[AppModule],providers:[{provide:ClientsService,useValue:{astronauts:of([{name:'Sample Astronaut',spaceWalks:2,undergraduateMajor:'Physics'}]),filters:of([]),filterState:{}}}]}).compileComponents();});
it('renders existing identity and astronaut fields',()=>{const f=TestBed.createComponent(AppComponent);f.detectChanges();expect(f.nativeElement.textContent).toContain('Event Horizon');expect(f.nativeElement.textContent).toContain('Sample Astronaut');expect(f.nativeElement.textContent).toContain('Physics');expect(f.nativeElement.querySelectorAll('mat-card').length).toBe(1);});
it('preserves filter state updates',()=>{const f=TestBed.createComponent(AppComponent);f.componentInstance.changeFilter('spaceWalks',2);expect(f.componentInstance.filterState['spaceWalks']).toBe(2);});});
