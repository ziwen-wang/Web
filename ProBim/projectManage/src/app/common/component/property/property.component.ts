import {Component, EventEmitter, Input, OnChanges, OnInit, Output} from '@angular/core';
import {CommonService} from '../../service/common/common.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'template-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit, OnChanges {

  @Input() elementProperty: any[];

  @Output() changeSelected: EventEmitter<any> = new EventEmitter<any>();

  public propertyData: any[];

  public height: string;
  private isMobileDevice: boolean;

  constructor(private commonService: CommonService) {
    this.elementProperty = [];
    this.propertyData = [];
    this.isMobileDevice = this.commonService.browserCheck();
    if (this.isMobileDevice) {
      this.height = window.innerHeight - 60 + 'px';
    } else {
      this.height = window.innerHeight - 100 + 'px';
    }

  }

  ngOnInit() {
    // console.log(this.elementProperty);
  }

  ngOnChanges() {
    if (this.elementProperty) {
      if (this.elementProperty.length > 0) {
        this.sort();
      }
    }
  }

  public sort() {
    let mapProperty = new Map();
    let propertyData = [];
    for (let object of this.elementProperty) {
      if (mapProperty.has(object.Group)) {
        let value = mapProperty.get(object.Group);
        value.push(object);
      } else {
        let values = [];
        values.push(object);
        mapProperty.set(object.Group, values);
      }
    }
    propertyData.push({Name: '自定义属性', Value: '', isGroup: true});
    propertyData.push(...mapProperty.get('自定义属性'));
    mapProperty.forEach((value, key, map) => {
      if (key !== '自定义属性') {
        propertyData.push({Name: key, Value: '', isGroup: true});
        propertyData.push(...value);
      }
    });
    this.propertyData = propertyData;
  }

}
