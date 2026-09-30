import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting,HttpTestingController } from '@angular/common/http/testing';
import { Astronaut } from './types';
import { ClientsService } from './clients.service';
describe('ClientsService',()=>{beforeEach(()=>{TestBed.configureTestingModule({providers:[provideHttpClient(),provideHttpClientTesting()]});});afterEach(()=>TestBed.inject(HttpTestingController).verify());
it('loads bundled data once and generates sorted unique filters',()=>{const s=TestBed.inject(ClientsService);let result;let filters;s.astronauts.subscribe(v=>result=v);s.filters.subscribe(v=>filters=v);const data=[{name:'A',spaceWalks:2,undergraduateMajor:'Physics'},{name:'B',spaceWalks:2,undergraduateMajor:'Math'}] as Astronaut[];TestBed.inject(HttpTestingController).expectOne('assets/astronauts.json').flush(data);expect(result).toEqual(data);expect(filters[0].options).toEqual(['2']);expect(filters[1].options).toEqual(['Math','Physics']);s.astronauts.subscribe(v=>expect(v).toEqual(data));expect(s.filterState).toEqual({spaceWalks:'',undergraduateMajor:''});});});
