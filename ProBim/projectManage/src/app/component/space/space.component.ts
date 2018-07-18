import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {SpaceService} from '../../common/service/space/space.service';
import {ElementService} from '../../common/service/element/element.service';
import {ModelService} from '../../common/service/model/model.service';
import {CommonService} from '../../common/service/common/common.service';

@Component({
  selector: 'bim-space',
  templateUrl: './space.component.html',
  styleUrls: ['./space.component.scss']
})
export class SpaceComponent implements OnInit {

  public spaceLevel: any[];

  public spaces: any[];

  public spaceElement: any[];

  public elementProperty: any[];

  public modelId: string;

  public height: string;

  public isMobileDevice: boolean = false;

  public isDisplayLevel: boolean = true;

  public isDisplaySpace: boolean = true;

  public isDisplayElement: boolean = true;

  public isDisplayProperty: boolean = true;

  constructor(public spaceService: SpaceService,
              private modelService: ModelService,
              private commonService: CommonService,
              private elementService: ElementService, private changeDetector: ChangeDetectorRef) {
    this.spaces = [];
    this.elementProperty = [];
    this.spaceElement = [];
    this.height = window.innerHeight - 100 + 'px';
    this.isMobileDevice = this.commonService.browserCheck();
    this.isDisplaySpace = !this.isMobileDevice;
    this.isDisplayElement = !this.isMobileDevice;
    this.isDisplayProperty = !this.isMobileDevice;

  }

  ngOnInit() {
    let spaceLevel = [];
    this.spaceLevel = [];
    let count = 0;
    for (let modelId of this.modelService.modelIds) {
      this.spaceService.getSpaceTree(modelId).then(res => {
        count++;
        if (res !== '') {
          if (res.file !== undefined) {
            for (let file of res.file) {
              // for (let level of file.children) {
              file.modelId = modelId;
              spaceLevel.push(file);
              // }
            }
          } else {
            for (let level of res.children) {
              level.modelId = modelId;
              spaceLevel.push(level);
            }
          }
        }
        if (count === this.modelService.modelIds.length) {
          if (spaceLevel.length !== 0) {
            this.spaceLevel = spaceLevel;
            // this.changeDetector.detectChanges();
          }
        }
      });
    }

  }

  public changeSpaceLevel(event) {
    event.originalEvent.stopPropagation();
    let spaces = [];
    for (let space of event.data.children) {
      space.modelId = event.data.modelId;
      spaces.push(space);
    }
    this.spaces = spaces;
    if (this.isMobileDevice) {
      this.isDisplayLevel = false;
      this.isDisplaySpace = true;
      this.isDisplayElement = false;
      this.isDisplayProperty = false;
    }
  }

  public changeSpace(event) {
    event.originalEvent.stopPropagation();
    this.spaceService.getSpaceElement(event.data.modelId, event.data.id).subscribe(res => {
      this.modelId = event.data.modelId;
      this.spaceElement = (res as any).Elements;
      if (this.isMobileDevice) {
        this.isDisplayLevel = false;
        this.isDisplaySpace = false;
        this.isDisplayElement = true;
        this.isDisplayProperty = false;
      }
    });
    this.spaceService.getSpaceProperty(event.data.modelId, event.data.id).subscribe(res => {
      this.elementProperty = res as any;
    });
  }

  public changeElementProperty(event) {
    event.originalEvent.stopPropagation();
    this.elementService.getElementProperty(event.data.id, event.data.modelId).subscribe(res => {
      this.elementProperty = res as any;
      // if (this.isMobileDevice) {
      //   this.isDisplayLevel = false;
      //   this.isDisplaySpace = false;
      //   this.isDisplayElement = false;
      //   this.isDisplayProperty = true;
      // }
    });
  }

  public backLevel() {
    this.isDisplayLevel = true;
    this.isDisplaySpace = false;
    this.isDisplayElement = false;
  }

  public backSpace() {
    this.isDisplayLevel = false;
    this.isDisplaySpace = true;
    this.isDisplayElement = false;
  }

}
