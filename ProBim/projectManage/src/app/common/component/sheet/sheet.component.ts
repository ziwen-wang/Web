import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'template-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss']
})
export class SheetTemplateComponent implements OnInit {

  @Input() picture: string;

  @Input() sheetId: string;

  @Input() modelId: string;

  @Input() name: string;

  @Output() changeClick: EventEmitter<any> = new EventEmitter<any>();

  public top: string;

  public width: string;

  public height: string;

  public left: string;

  constructor() {
  }

  ngOnInit() {
    let imageBase64 = new Image();
    imageBase64.src = this.picture;
    imageBase64.onload = () => {
      let width: number = imageBase64.width;
      let height: number = imageBase64.height;
      if ((height / width) > (100 / 160)) {
        this.height = '100%';
        this.left = (160 - (100 * width) / height) / 2 + 'px';
      } else {
        this.width = '100%';
        height = 160 * height / width;
        this.top = (100 - height) / 2 + 'px';
      }
    };
  }

  public click(event) {
    event.preventDefault();
    this.changeClick.emit({originalEvent: event, modelId: this.modelId, sheetId: this.sheetId});
    return false;
  }

}
