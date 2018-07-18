import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'template-viewpoint',
  templateUrl: './viewpoint.component.html',
  styleUrls: ['./viewpoint.component.scss']
})
export class ViewpointTemplateComponent implements OnInit {

  @Input() viewpoint: any;

  @Output() selectedViewpoint: EventEmitter<any> = new EventEmitter<any>();

  @Output() moreEvent: EventEmitter<any> = new EventEmitter<any>();

  public noHaveDescription = '<无描述>';

  public top: string;

  constructor() {
  }

  ngOnInit() {
    if (typeof(this.viewpoint.Tag) === 'string') {
      this.viewpoint.Tag = JSON.parse(this.viewpoint.Tag);
    }
    let imageBase64 = new Image();
    imageBase64.src = this.viewpoint.Snapshot;
    imageBase64.onload = () => {
      let width: number = imageBase64.width;
      let height: number = imageBase64.height;
      height = 160 * height / width;
      this.top = (100 - height) / 2 + 'px';
    };
  }

  public click(event) {
    let data = {
      originalEvent: event,
      viewpoint: this.viewpoint
    };
    this.selectedViewpoint.emit(data);
  }

  public moreClick(event) {
    event.stopPropagation();
    this.moreEvent.emit({originalEvent: event, viewpoint: this.viewpoint});
  }

}
