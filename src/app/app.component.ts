import { Component} from '@angular/core';
import { ClientsService } from './clients.service';
import { Observable } from 'rxjs';
import { Astronaut, FilterState, Filter, Option } from './types';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  showFiller = false;
  astronauts: Observable<Astronaut[]>;
  filterState: FilterState;
  filters: Observable<Filter[]>;

  constructor(clientService: ClientsService, private dialog: MatDialog) {
    this.astronauts = clientService.astronauts;
    this.filterState = clientService.filterState;
    this.filters = clientService.filters;
  }

  changeFilter(category: string, option: Option) {
    this.filterState[category] = option;
  }

}
