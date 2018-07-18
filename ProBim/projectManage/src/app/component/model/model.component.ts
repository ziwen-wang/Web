import {ChangeDetectorRef, Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {ModelService} from '../../common/service/model/model.service';
import {SpaceService} from '../../common/service/space/space.service';
import {ViewpointService} from '../../common/service/viewpoint/viewpoint.service';
import {SheetService} from '../../common/service/sheet/sheet.service';
import {ElementService} from '../../common/service/element/element.service';
import {SystemService} from '../../common/service/system/system.service';
import {SummaryService} from '../../common/service/summary/summary.service';
import {ParamService} from '../../common/service/param/param.service';
import {DomHandler} from 'primeng/primeng';
import {MenuService} from '../menu/service/menu.service';
import {CommonService} from '../../common/service/common/common.service';
import {HeaderService} from '../header/service/header.service';
import {version} from 'punycode';

@Component({
  selector: 'bim-model',
  templateUrl: './model.component.html',
  styleUrls: ['./model.component.scss'],
  providers: [DomHandler]
})
export class ModelComponent implements OnInit {

  public modelSummary: any[];

  public modelData: any[];

  public modelInfo: any[];

  public modelBasicInformation: any[];

  public isMobileDevice: boolean;

  @ViewChild('summaryData') summaryData: ElementRef;

  constructor(private modelService: ModelService,
              private spaceService: SpaceService,
              private viewpointService: ViewpointService,
              private sheetService: SheetService,
              private paramService: ParamService,
              private elementService: ElementService,
              private systemService: SystemService,
              private summaryService: SummaryService,
              private menuService: MenuService,
              private changeDetector: ChangeDetectorRef,
              private commonService: CommonService,
              private headerService: HeaderService) {
    this.modelSummary = [];
    this.modelSummary.push({color: '#9a8a2c', name: '视图', count: 0, className: 'summary-level'});
    this.modelSummary.push({color: '#697a4f', name: '构件数', count: 0, className: 'summary-element'});
    this.modelSummary.push({color: '#4f5c7a', name: '空间', count: 0, className: 'summary-space'});
    this.modelSummary.push({color: '#4f687a', name: '系统', count: 0, className: 'summary-system'});
    this.modelSummary.push({color: '#4f7a76', name: '视点', count: 0, className: 'summary-viewpoint'});
    this.modelSummary.push({color: '#4f7a66', name: '批注', count: 0, className: 'summary-annotation'});
    this.modelSummary.push({color: '#635b79', name: '2D', count: 0, className: 'summary-2d'});
    this.modelSummary.push({color: '#9a8a2c', name: '楼层', count: 0, className: 'summary-level'});

    this.modelData = [];
    this.modelData.push({color: '#5b6273', name: '文档', count: 0, className: 'summary-document'});
    this.modelData.push({color: '#5b6273', name: '现场数据', count: 0, className: 'summary-spot'});
    this.modelData.push({color: '#5b6273', name: '问题', count: 0, className: 'summary-task'});
    this.isMobileDevice = this.commonService.browserCheck();
  }

  ngOnInit() {
    this.init();
  }

  public changeMenu(event) {
    // event.originalEvent.stopPropagation();
    switch (event.name) {
      case '视图':
        this.menuService.elementClick(event.originalEvent);
        break;
      case '构件数':
        this.menuService.elementClick(event.originalEvent);
        break;
      case '空间':
        this.menuService.spaceClick(event.originalEvent);
        break;
      case '系统':
        this.menuService.systemClick(event.originalEvent);
        break;
      case '视点':
        this.menuService.viewpointClick(event.originalEvent);
        break;
      case '批注':
        this.menuService.annotationClick(event.originalEvent);
        break;
      case '2D':
        this.menuService.sheetClick(event.originalEvent);
        break;
      case '文档':
        this.menuService.documentClick(event.originalEvent);
        break;
      case '问题':
        this.menuService.issueClick(event.originalEvent);
        break;
      case '现场数据':
        this.menuService.shotClick(event.originalEvent);
        break;
    }
  }

  public openVersionModel(event, version) {
    this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}` +
      `&model=${this.paramService.param.modelID}&ver=${version}`;
    this.menuService.modelClick(event);
  }

  private init() {

    this.modelBasicInformation = [];
    this.modelInfo = [];
    this.modelService.getBaseModelInfo().then(modelInfo => {
      if (this.modelService.isMerge) {
        for (let modelId of this.modelService.modelIds) {
          this.modelService.getLevel(modelId);
        }
      }
      this.headerService.modelName = modelInfo.Name;
      this.getViewCount(modelInfo);
      this.modelService.getModelInfo().then(count => {
        this.crateModelSummary();
        this.getLevelCount();
        this.getElementCount();
        this.getSpaceCount();
        this.getViewpoint();
        this.getSheetCount();
        this.getSystemCount();
        this.getDocument();
        this.getRelationScene();
        this.getIssue();
      });
    });
  }

  private getViewCount(modelInfo) {
    this.modelSummary[0].count = modelInfo.Views.length;
  }

  /**
   * 得到楼层信息
   */
  private getLevelCount() {
    if (this.modelService.isMerge === false) {
      this.modelService.getLevelCount().then(count => {
        this.modelSummary[7].count = (count < 0 ? 0 : count);
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.modelService.getLevelCount(key).then(count => {
          console.log(count);
          modelCount++;
          this.modelSummary[7].count += (count < 0 ? 0 : count);
          if (modelCount === this.modelService.modelIds.length) {
            this.changeDetector.detectChanges();
          }
        });
      });
    }
  }

  /**
   * 得到基础信息
   */
  private crateModelSummary() {
    let date = new Date(this.modelService.modelBaseInfo.CreateTime);
    let dateString = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
    this.modelBasicInformation.push({key: '创建人', value: this.modelService.modelBaseInfo.Creator});
    this.modelBasicInformation.push({key: '创建时间', value: dateString});
    this.modelBasicInformation.push({key: '合并模型', value: this.modelService.isMerge ? '是' : '否'});
    let version = '1.0';
    let lastVersion = 0;
    this.modelService.getVersion().subscribe(res => {
      for (let versionInfo of res) {
        lastVersion = parseInt(versionInfo.VersionNO, 10) + 1;
        version = `${parseInt(versionInfo.VersionNO, 10)}.0`;
        this.modelInfo.push({
          version: `V ${version}`,
          realVersion: versionInfo.VersionNO,
          date: dateString,
          isActive: this.paramService.param.versionNO === versionInfo.VersionNO + ''
        });
      }
      if (this.paramService.param.versionNO !== '') {
        version = `${this.paramService.param.versionNO}.0`;
      }
      this.modelInfo.splice(0, 0, {
        version: `V ${lastVersion === 0 ? 1 : lastVersion}` + `.0`,
        realVersion: this.paramService.param.versionNO,
        date: dateString,
        isActive: this.paramService.param.versionNO === ''
      });
      this.changeDetector.detectChanges();
    });

  }

  /**
   * 得到构件数目
   */
  private getElementCount() {
    if (this.modelService.isMerge === false) {
      this.elementService.getAllElementCount().then(count => {
        this.modelSummary[1].count = count;
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelSummary[1].count = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.elementService.getAllElementCount(key).then(count => {
          modelCount++;
          this.modelSummary[1].count += count;
          if (modelCount === this.modelService.modelIds.length) {
            this.changeDetector.detectChanges();
          }
        });
      });
    }
  }

  /**
   * 得到空间数量
   */
  private getSpaceCount() {
    if (this.modelService.isMerge === false) {
      this.spaceService.getAllSpaceCount().then(count => {
        this.modelSummary[2].count = count;
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.spaceService.getAllSpaceCount(key).then(count => {
          modelCount++;
          this.modelSummary[2].count += count;
          if (modelCount === this.modelService.modelIds.length) {
            this.changeDetector.detectChanges();
          }
        });
      });
    }
  }

  /**
   * 得到视点
   */
  private getViewpoint() {
    if (this.modelService.isMerge === false) {
      this.viewpointService.getAllViewpoint().then(viewpoints => {
        let viewpointCount = 0;
        let annotationCount = 0;
        for (let viewpoint of viewpoints) {
          if (viewpoint.Type === 0) {
            viewpointCount++;
          } else if (viewpoint.Type === 1) {
            annotationCount++;
          }
        }
        this.modelSummary[4].count = viewpointCount;
        this.modelSummary[5].count = annotationCount;
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.viewpointService.getAllViewpoint(key).then(viewpoints => {
          modelCount++;
          let viewpointCount = 0;
          let annotationCount = 0;
          for (let viewpoint of viewpoints) {
            if (viewpoint.Type === 0) {
              viewpointCount++;
            } else if (viewpoint.Type === 1) {
              annotationCount++;
            }
          }
          this.modelSummary[4].count += viewpointCount;
          this.modelSummary[5].count += annotationCount;
          if (modelCount === this.modelService.modelId2ModelInfo.size) {
            this.changeDetector.detectChanges();
          }
        });
      });
    }

  }

  /**
   * 得打sheet
   */
  private getSheetCount() {
    if (this.modelService.isMerge === false) {
      this.sheetService.getSheets().then(sheet => {
        this.modelSummary[6].count = sheet.sheets.length;
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.sheetService.getSheets(key).then(sheet => {
          modelCount++;
          this.modelSummary[6].count += sheet.sheets.length;
          if (modelCount === this.modelService.modelId2ModelInfo.size) {
            this.changeDetector.detectChanges();
          }
        });
      });
    }
  }

  /**
   * 得到系统
   */
  private getSystemCount() {
    if (this.modelService.isMerge === false) {
      this.systemService.getSystemList().then(system => {
        this.modelSummary[3].count = system.length;
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.systemService.getSystemList(key).then(system => {
          modelCount++;
          this.modelSummary[3].count += system.length;
          if (modelCount === this.modelService.modelId2ModelInfo.size) {
            this.changeDetector.detectChanges();
          }
        });
      });
    }

  }

  /**
   * 得到文档
   */
  private getDocument() {
    if (this.modelService.isMerge === false) {
      this.summaryService.getDocument().then(res => {
        this.modelData[0].count = res;
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.summaryService.getDocument(key).then(res => {
          modelCount++;
          this.modelData[0].count += parseInt(res.toString(), 10);
          if (modelCount === this.modelService.modelId2ModelInfo.size) {
            this.changeDetector.detectChanges();
          }
        });
      });
    }

  }

  /**
   * 得到问题
   */
  private getRelationScene() {
    if (this.modelService.isMerge === false) {
      this.summaryService.getRelationScene().then(res => {
        this.modelData[1].count = res.total;
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.summaryService.getRelationScene(key).then(res => {
          modelCount++;
          this.modelData[1].count += res.total;
          if (modelCount === this.modelService.modelId2ModelInfo.size) {
            this.changeDetector.detectChanges();
          }
        });
      });
    }

  }

  private getIssue() {
    if (this.modelService.isMerge === false) {
      this.summaryService.getIssue().then(res => {
        this.modelData[2].count = res.total;
        this.changeDetector.detectChanges();
      });
    } else {
      let modelCount = 0;
      this.modelService.modelId2ModelInfo.forEach((modelInfo, key) => {
        this.summaryService.getIssue(key).then(res => {
          this.modelData[2].count = res.total;
          modelCount++;
          if (modelCount === this.modelService.modelId2ModelInfo.size) {
            this.changeDetector.detectChanges();
          }
        });
      });

    }
  }

}

