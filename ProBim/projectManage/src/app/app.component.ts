import {Component, ChangeDetectorRef, OnInit} from '@angular/core';
import {MenuService} from './component/menu/service/menu.service';
import {ParamService} from './common/service/param/param.service';
import {CommonService} from './common/service/common/common.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  public src: string;

  public isMobileDevice: boolean;

  constructor(public menuService: MenuService,
              public paramService: ParamService,
              private changeDetector: ChangeDetectorRef,
              private commonservice: CommonService) {
    this.menuService.appChangeDetector = this.changeDetector;
    this.isMobileDevice = this.commonservice.browserCheck();
  }

  ngOnInit() {
    let sessionId = this.paramService.getQueryString('SessionID');
    if (sessionId === null) {
      this.paramService.initParam();

      if (this.paramService.param.viewpointID === '') {
        this.menuService.detailIsSelected = true;
        this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}&model=${this.paramService.param.modelID}`;
      } else {
        this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}&model=`
          + `${this.paramService.param.modelID}&viewpointId=${this.paramService.param.viewpointID}`;
        this.menuService.modelClick();
      }
    } else {
      this.paramService.getParamBySessionId(sessionId).subscribe(param => {
        this.paramService.initParam(param);
        if (this.paramService.param.viewpointID === '') {
          this.menuService.detailClick();
          this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}&model=${this.paramService.param.modelID}`;
        } else {
          this.menuService.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}`
            + `&model=${this.paramService.param.modelID}&viewpointId=${this.paramService.param.viewpointID}`;
          this.menuService.modelClick();
        }

      });
    }
  }

}
