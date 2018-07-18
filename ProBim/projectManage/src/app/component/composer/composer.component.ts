import {Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
import {ParamService} from '../../common/service/param/param.service';
import {ComposerService} from './composer.service';

@Component({
  selector: 'bim-composer',
  templateUrl: './composer.component.html',
  styleUrls: ['./composer.component.scss']
})
export class ComposerComponent implements OnInit, OnChanges {

  @Input() src: string;

  @Input() isDisplay: boolean;

  @ViewChild('iframe') iframe: ElementRef;

  public height: string = '0px';

  public width: string = '0px';

  private oldSrc = '';

  constructor(public paramService: ParamService,
              private composerService: ComposerService) {
    if (this.composerService.menuService.is4D) {
      this.height = document.body.clientHeight - 44 + 'px';
      this.width = 600 + 'px';
    } else {
      this.height = document.body.clientHeight - 44 + 'px';
      this.width = document.body.clientWidth - 120 + 'px';
    }

    this.src = '';

  }

  ngOnInit() {
    let src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}&model=${this.paramService.param.modelID}`;
    if (this.src.indexOf(src) < 0) {
      this.src = (window as any).bim_config.BIMComposerPath + `/BIMComposer/index.html?projectId=${this.paramService.param.projectID}&model=${this.paramService.param.modelID}`;
    }
    this.iframe.nativeElement.src = this.src;
    this.oldSrc = this.src;
    this.isDisplay = true;
    this.composerService.composerElementRef = this.iframe;
  }

  ngOnChanges() {
    if (this.composerService.menuService.is4D === false) {
      this.height = document.body.clientHeight - 44 + 'px';
      this.width = document.body.clientWidth - 120 + 'px';
    }
    if (this.src === this.oldSrc) {
      return;
    }
    this.iframe.nativeElement.src = this.src;
    this.isDisplay = true;
    this.oldSrc = this.src;
  }

  @HostListener('window:resize', ['$event'])
  public resize(event) {
    if (this.composerService.is4D === true) {
      return;
    }
    this.height = document.body.clientHeight - 44 + 'px';
    this.width = document.body.clientWidth - 120 + 'px';
  }

}
