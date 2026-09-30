import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FilterState, Filter, Option, Astronaut } from './types';

import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  astronauts: Observable<Astronaut[]>;
  filterState: FilterState = {};
  filters: Observable<Filter[]>;

  constructor(http: HttpClient) {
    this.astronauts = http
      .get<Astronaut[]>('assets/astronauts.json')
      .pipe(shareReplay({bufferSize: 1, refCount: true}));
    this.filters = this.astronauts.pipe(
      map((astronauts) => this.createFilters(astronauts))
    );
  }

  private createFilters(astronauts: Astronaut[]) {
    return [
      {
        category: 'spaceWalks',
        displayName: 'Space walks',
        options: this.extractFilterOptions('spaceWalks', astronauts),
      },
      {
        category: 'undergraduateMajor',
        displayName: 'Undergraduate major',
        options: this.extractFilterOptions('undergraduateMajor', astronauts),
      },
    ];
  }

  private extractFilterOptions(
    category: string,
    astronauts: Astronaut[]
  ): Option[] {
    this.filterState[category] = '';
    return [...new Set(astronauts.map(astronaut => String(astronaut[category])))].sort();
  }
}
