import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ParamService} from '../../common/service/param/param.service';

@Component({
  moduleId: module.id,
  selector: 'bim-site',
  templateUrl: './site.component.html',
  styleUrls: ['./site.component.scss']
})
export class SiteComponent implements OnInit {

  public src: string;

  @ViewChild('iframe') iframe: ElementRef;

  constructor(private paramService: ParamService) {
  }

  ngOnInit() {
    this.src = `${(window as any).bim_config.sitePath}?BIMComposerID=${this.paramService.param.projectID}&ModelID=${this.paramService.param.modelID}`;
    this.iframe.nativeElement.src = this.src;
  }

}
