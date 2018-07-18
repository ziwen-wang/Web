import {ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {ViewService} from '../../common/service/view/view.service';
import {ElementService} from '../../common/service/element/element.service';
import {ModelService} from '../../common/service/model/model.service';
import {CommonService} from '../../common/service/common/common.service';
import {MenuService} from '../menu/service/menu.service';
import {ParamService} from '../../common/service/param/param.service';

@Component({
  moduleId: module.id,
  selector: 'bim-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.scss']
})
export class MemberComponent implements OnInit {

  public elements: any[];

  public selectedView: any;

  public elementProperty: any[];

  public views: any[];

  public modelId: string;

  public isMobileDevice: boolean = false;

  public isDisplayElement: boolean = true;

  public isDisplayView: boolean = true;

  public isDisplayProperty: boolean = true;

  public menu: any[];

  public isDisplayMore: boolean = false;

  @ViewChild('contextMenu') contextMenu: any;

  constructor(private viewService: ViewService,
              private modelService: ModelService,
              private changeDetectorRef: ChangeDetectorRef,
              private commonService: CommonService,
              private menuService: MenuService,
              private paramService: ParamService,
              private elementService: ElementService) {
    this.elements = [];
    this.elementProperty = [];
    this.views = [];
    this.isMobileDevice = this.commonService.browserCheck();
    this.isDisplayElement = !this.isMobileDevice;
    this.isDisplayProperty = !this.isMobileDevice;
  }

  ngOnInit() {
    this.views = [];
    if (this.modelService.isMerge === false) {
      this.viewService.getView().then(views => {
        for (let view of views) {
          if (view.IsFromModel) {
            view.Name = view.Name.split('_')[0];
            this.views.push(view);
          }
        }
      });
    } else {
      let count = 0;
      for (let modelId of this.modelService.modelIds) {
        this.viewService.getView(modelId).then(views => {
          let tempViews = [];
          tempViews.push(...this.views);
          this.views = [];
          this.views.push(...tempViews);
          count++;
          for (let view of views) {
            if (view.IsFromModel) {
              view.Name = view.Name.split('_')[0];
              this.views.push(view);
            }
          }
          if (count === this.modelService.modelIds.length) {
            this.changeDetectorRef.detectChanges();
          }
        });
      }
    }

  }

  public changeView(event) {
    event.originalEvent.stopPropagation();
    // console.log(this.modelService.modelId2Version);
    this.viewService.getElementByViewId(event.data.ModelID, event.data.ID).subscribe(res => {
      this.elements = [];
      this.modelId = event.data.ModelID;
      this.elements = res as any;
      this.changeDetectorRef.detectChanges();
      if (this.isMobileDevice) {
        this.isDisplayView = false;
        this.isDisplayElement = true;
        this.isDisplayProperty = false;
      }
    });
  }

  public changeProperty(event) {
    event.originalEvent.stopPropagation();
    this.elementService.getElementProperty(event.data.id, event.data.modelId).subscribe(res => {
      this.elementProperty = res as any;
    });
  }

  public back(event) {
    this.isDisplayView = true;
    this.isDisplayElement = false;
  }

  public moreClick(event, view) {
    event.stopPropagation();
    this.menu = [{
      label: '加载',
      id: view.ID,
      modelId: view.ModelID,
      command: (menuEvent) => {
        if (this.menuService.modelIsSelected) {
          if ((window as any).BIMe.modelData.BIMeModelData.currentViewId() !== menuEvent.item.viewId) {
            this.menuService.src = null;
            this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}` +
              `&model=${menuEvent.item.modelId}&viewID=${menuEvent.item.id}`;
          }
        } else {
          this.menuService.src = null;
          this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}` +
            `&model=${menuEvent.item.modelId}&viewID=${menuEvent.item.id}`;
        }
        this.menuService.modelClick(event);
      }
    }];
    this.contextMenu.show(event);
  }

  public mouseOut() {
    console.log('aaaaa');
  }

  public mouseOver() {
    console.log('mouseIn');
  }
}
