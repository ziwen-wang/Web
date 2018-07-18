import {Component, OnInit, ViewChild} from '@angular/core';
import {ViewpointService} from '../../common/service/viewpoint/viewpoint.service';
import {ModelService} from '../../common/service/model/model.service';
import {MenuService} from '../menu/service/menu.service';
import {ParamService} from '../../common/service/param/param.service';
import {CommonService} from '../../common/service/common/common.service';
import {el} from '@angular/platform-browser/testing/src/browser_util';

@Component({
  selector: 'bim-annotation',
  templateUrl: './annotation.component.html',
  styleUrls: ['./annotation.component.scss']
})
export class AnnotationComponent implements OnInit {

  public annotation: any[];

  public sanpShot: string = '';

  public menu: any[];

  @ViewChild('contextMenu') contextMenu: any;

  public isMobileDevice: boolean = false;

  constructor(private viewpointService: ViewpointService,
              private menuService: MenuService,
              private paramService: ParamService,
              private commonService: CommonService,
              private modelService: ModelService) {
    this.isMobileDevice = this.commonService.browserCheck();
  }

  ngOnInit() {
    this.annotation = [];
    for (let modelId of this.modelService.modelIds) {
      this.viewpointService.getAllViewpoint(modelId).then(viewpoints => {
        for (let viewpoint of viewpoints) {
          if (viewpoint.Type === 1) {
            this.annotation.push(viewpoint);
          }
        }
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
        label: '打开批注',
        modelId: data.viewpoint.ModelID,
        id: data.viewpoint.ID,
        viewId: data.viewpoint.ViewID,
        command: (event) => {
          if (this.menuService.modelIsSelected) {
            if ((window as any).BIMe.modelData.BIMeModelData.currentViewId() === event.item.viewId) {
              (window as any).BIMe.view.BIMeAnnotation.showAnnotation(event.item.id);
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
            if (this.isMobileDevice) {
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
            } else {
              if ((window as any).showIssue !== undefined) {
                (window as any).showIssue(this.paramService.param.projectID, event.item.modelId, event.item.id, snapShot);
              } else if ((window.parent as any).showIssue !== undefined) {
                (window.parent as any).showIssue(this.paramService.param.projectID, event.item.modelId, event.item.id, snapShot);
              }
            }
          });
        }
      }
    ];
    // } else {
    //   this.menu = [
    //     {
    //       label: '打开批注',
    //       modelId: data.viewpoint.ModelID,
    //       id: data.viewpoint.ID,
    //       viewId: data.viewpoint.ViewID,
    //       command: (event) => {
    //         console.log(event);
    //         if (this.menuService.modelIsSelected) {
    //           if ((window as any).BIMe.modelData.BIMeModelData.currentViewId() === event.item.viewId) {
    //             (window as any).BIMe.view.BIMeAnnotation.showAnnotation(event.item.id);
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
