import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'app-service-option',
  templateUrl: './service-option.component.html',
  styleUrls: ['./service-option.component.css']
})
export class ServiceOptionComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
