import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'template-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  @Input() backgroundColor: string;

  @Input() name: string;

  @Input() summaryCount: number;

  @Input() imageClass: string;

  @Output() clickEvent: EventEmitter<any> = new EventEmitter<any>();

  constructor() {
  }

  ngOnInit() {
  }

  public click(event) {
    this.clickEvent.emit({originalEvent: event, name: this.name});
  }

}
