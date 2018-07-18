import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ParamService} from '../../common/service/param/param.service';

@Component({
  moduleId: module.id,
  selector: 'bim-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {

  public src: string;

  @ViewChild('iframe') iframe: ElementRef;

  constructor(private paramService: ParamService) {
  }

  ngOnInit() {
    this.src = `${(window as any).bim_config.issuePath}?BIMComposerID=${this.paramService.param.projectID}&ModelID=${this.paramService.param.modelID}`;
    this.iframe.nativeElement.src = this.src;
  }

}
