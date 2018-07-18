import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ParamService} from '../../common/service/param/param.service';

@Component({
  moduleId: module.id,
  selector: 'bim-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  @ViewChild('iframe') iframe: ElementRef;

  private src: string;

  constructor(private paramService: ParamService) {
  }

  ngOnInit() {
    this.src = `${(window as any).bim_config.documentPath}?BIMComposerID=${this.paramService.param.projectID}&ModelID=${this.paramService.param.modelID}`;
    this.iframe.nativeElement.src = this.src;
  }

}
