import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {SystemService} from '../../common/service/system/system.service';
import {ElementService} from '../../common/service/element/element.service';
import {ParamService} from '../../common/service/param/param.service';
import {ModelService} from '../../common/service/model/model.service';
import {CommonService} from '../../common/service/common/common.service';

@Component({
  selector: 'bim-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  public system: any[];

  public element: any[];

  public elementProperty: any[];

  public systemInfo: any = null;
  public systemElementId2Info: any = null;
  public modelId: string;

  public isMobileDevice: boolean = false;

  public isDisplaySystem: boolean = true;

  public isDisplayTopology: boolean = true;

  public isDisplayProperty: boolean = true;

  constructor(private systemService: SystemService,
              private elementService: ElementService,
              private changeDetector: ChangeDetectorRef,
              private modelService: ModelService,
              private commonService: CommonService,
              private paramService: ParamService) {
    this.system = [];
    this.element = [];
    this.elementProperty = [];
    this.isMobileDevice = this.commonService.browserCheck();
    this.isDisplayTopology = !this.isMobileDevice;
    this.isDisplayProperty = !this.isMobileDevice;
  }

  ngOnInit() {
    this.system = [];
    for (let modelId of this.modelService.modelIds) {
      this.systemService.getSystemList(modelId).then(res => {
        let systemType: Set<string> = new Set<string>();
        for (let resource of res as any) {
          let system = {
            name: resource.SystemTypeName,
            id: resource.SystemType,
            modelId: modelId
          };
          systemType.add(resource.SystemType);
          this.system.push(system);
        }
      });
    }

  }

  public changeSystem(event) {
    this.systemInfo = null;
    this.changeDetector.detectChanges();
    this.systemService.getSystemElement(event.data.modelId, event.data.id).subscribe(res => {
      this.systemInfo = (res as any).ChildSystem;
      this.modelId = this.paramService.param.modelID;
      this.systemElementId2Info = new Map<string, any>();
      for (let element of (res as any).Elements) {
        this.systemElementId2Info.set(element.ElementID, element);
      }
      if (this.isMobileDevice) {
        this.isDisplaySystem = false;
        this.isDisplayTopology = true;
        this.isDisplayProperty = false;
      }
      this.changeDetector.detectChanges();
    });
  }

  public changeElementProperty(elementId) {
    this.elementService.getElementProperty(elementId.split('^')[1], elementId.split('^')[0]).subscribe(res => {
      this.elementProperty = res as any;
      // if (this.isMobileDevice) {
      //   this.isDisplaySystem = false;
      //   this.isDisplayTopology = false;
      //   this.isDisplayProperty = true;
      // }
    });
  }

  public backTopologyList() {
    this.isDisplaySystem = true;
    this.isDisplayTopology = false;
  }

}
