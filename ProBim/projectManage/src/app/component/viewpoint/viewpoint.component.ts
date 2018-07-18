import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ViewpointService} from '../../common/service/viewpoint/viewpoint.service';
import {ModelService} from '../../common/service/model/model.service';
import {DomHandler} from 'primeng/primeng';
import {ParamService} from '../../common/service/param/param.service';
import {MenuService} from '../menu/service/menu.service';
import {CommonService} from '../../common/service/common/common.service';

@Component({
  selector: 'bim-viewpoint',
  templateUrl: './viewpoint.component.html',
  styleUrls: ['./viewpoint.component.scss'],
  providers: [DomHandler]
})
export class ViewpointComponent implements OnInit {

  public viewpoint: any[];

  public sanpShot: string = '';

  @ViewChild('img') imgElementRef: ElementRef;

  @ViewChild('contextMenu') contextMenu: any;

  public menu: any[];

  public isMobileDevice: boolean = false;

  constructor(private viewpointService: ViewpointService,
              private domHandler: DomHandler,
              private paramService: ParamService,
              private menuService: MenuService,
              private commonService: CommonService,
              private modelService: ModelService) {
    this.viewpoint = [];
    this.menu = [];
    this.isMobileDevice = commonService.browserCheck();
  }

  ngOnInit() {
    let count = 0;
    this.viewpoint = [];
    for (let modelId of this.modelService.modelIds) {
      this.viewpointService.getAllViewpoint(modelId).then(viewpoints => {
        for (let viewpoint of viewpoints) {
          if (viewpoint.Type === 0) {
            this.viewpoint.push(viewpoint);
          }
        }
        count++;
      });
    }
  }

  public selectedViewpoint(event) {
    event.originalEvent.stopPropagation();
    this.viewpointService.getViewpointSnapshot(event.viewpoint.ID).subscribe(res => {
      this.sanpShot = res.substr(1, res.length - 2);

    });
  }

  public moreClick(data) {
    // if (this.isMobileDevice === false) {
    this.menu = [
      {
        label: '打开视点',
        modelId: data.viewpoint.ModelID,
        id: data.viewpoint.ID,
        viewId: data.viewpoint.ViewID,
        command: (event) => {
          if (this.menuService.modelIsSelected) {
            if ((window as any).BIMe.modelData.BIMeModelData.currentViewId() === event.item.viewId) {
              (window as any).BIMe.view.BIMeViewpoint.changeViewpoint(event.item.id);
            } else {
              this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}` +
                `&model=${event.item.modelId}&viewID=${event.item.viewId}&viewpointId=${event.item.id}`;
            }
          } else {
            this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}` +
              `&model=${event.item.modelId}&viewID=${event.item.viewId}&viewpointId=${event.item.id}`;
          }
          this.menuService.modelClick(event.originalEvent);
        }
      },
      {
        label: '发起问题',
        id: data.viewpoint.ID,
        modelId: data.viewpoint.ModelID,
        command: (event) => {
          this.viewpointService.getViewpointSnapshot(event.item.id).subscribe(res => {
            let snapShot = res.substr(1, res.length - 2);
            if (this.commonService.browserCheck()) {
              if ((window as any).webkit !== undefined) {
                (window as any).webkit.messageHandlers.presentQuestion.postMessage(JSON.stringify({
                  projectId: this.paramService.param.projectID,
                  modelId: event.item.modelId,
                  viewpointId: event.item.id,
                  snapShot: snapShot
                }));
                (window as any).webkit.messageHandlers.presentQuestion.postMessage('add navigationBar');
              } else if ((top as any).webkit !== undefined) {
                (top as any).webkit.messageHandlers.AddNavigationBar.presentQuestion(JSON.stringify({
                  projectId: this.paramService.param.projectID,
                  modelId: event.item.modelId,
                  viewpointId: event.item.id,
                  snapShot: snapShot
                }));
              }
            } else {
              if ((window as any).showIssue !== undefined) {
                (window as any).showIssue(this.paramService.param.projectID, event.item.modelId, event.item.id, snapShot);
              } else if ((top as any).showIssue !== undefined) {
                (top as any).showIssue(this.paramService.param.projectID, event.item.modelId, event.item.id, snapShot);
              }
            }

          });
        }
      }
    ];
    // } else {
    //   this.menu = [
    //     {
    //       label: '打开视点',
    //       modelId: data.viewpoint.ModelID,
    //       id: data.viewpoint.ID,
    //       viewId: data.viewpoint.ViewID,
    //       command: (event) => {
    //         if (this.menuService.modelIsSelected) {
    //           if ((window as any).BIMe.modelData.BIMeModelData.currentViewId() === event.item.viewId) {
    //             (window as any).BIMe.view.BIMeViewpoint.changeViewpoint(event.item.id);
    //           } else {
    //             this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}` +
    //               `&model=${event.item.modelId}&viewID=${event.item.viewId}&viewpointId=${event.item.id}`;
    //           }
    //         } else {
    //           this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}` +
    //             `&model=${event.item.modelId}&viewID=${event.item.viewId}&viewpointId=${event.item.id}`;
    //         }
    //         this.menuService.modelClick(event.originalEvent);
    //       }
    //     }
    //   ];
    // }
    this.contextMenu.show(data.originalEvent);
  }

}
