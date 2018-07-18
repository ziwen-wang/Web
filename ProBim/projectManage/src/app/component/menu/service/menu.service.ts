import {Injectable, ChangeDetectorRef} from '@angular/core';

@Injectable()
export class MenuService {

  public appChangeDetector: ChangeDetectorRef;

  public detailIsSelected: boolean = false;
  public elementIsSelected: boolean = false;
  public systemIsSelected: boolean = false;
  public spaceIsSelected: boolean = false;
  public viewpointIsSelected: boolean = false;
  public annotationIsSelected: boolean = false;
  public sheetIsSelected: boolean = false;
  public animationIsSelected: boolean = false;
  public documentIsSelected: boolean = false;
  public shotIsSelected: boolean = false;
  public issueIsSelected: boolean = false;
  public modelIsSelected: boolean = false;

  public modelIsDisplay: boolean = false;

  public modelButtonName: string = '打开模型';

  public src: string = '';

  public is4D = false;

  constructor() {
  }

  public detailClick(event?) {
    if (event !== undefined) {
      event.stopPropagation();
    }
    this.removeAllSelected();
    this.detailIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public elementClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.elementIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public systemClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.systemIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public spaceClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.spaceIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public viewpointClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.viewpointIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public annotationClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.annotationIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public sheetClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.sheetIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public animationClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.animationIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public documentClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.documentIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public shotClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.shotIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public issueClick(event) {
    event.stopPropagation();
    this.removeAllSelected();
    this.issueIsSelected = true;
    this.appChangeDetector.detectChanges();
  }

  public modelClick(event?: any, is4D: boolean = false) {
    if (event !== undefined) {
      event.stopPropagation();
    }
    this.is4D = is4D;
    this.removeAllSelected();
    if (this.is4D) {
      this.animationIsSelected = true;
    }
    this.modelIsDisplay = true;
    this.modelIsSelected = true;
    this.modelButtonName = '模型';
    this.appChangeDetector.detectChanges();
  }

  private removeAllSelected() {
    this.detailIsSelected = false;
    this.elementIsSelected = false;
    this.systemIsSelected = false;
    this.spaceIsSelected = false;
    this.viewpointIsSelected = false;
    this.annotationIsSelected = false;
    this.sheetIsSelected = false;
    this.animationIsSelected = false;
    this.documentIsSelected = false;
    this.shotIsSelected = false;
    this.issueIsSelected = false;
    this.modelIsDisplay = false;
    // this.menuService.modelIsSelected = false;
    this.modelButtonName = '显示模型';
  }

}
