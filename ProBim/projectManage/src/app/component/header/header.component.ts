import {Component, OnInit} from '@angular/core';
import {HeaderService} from './service/header.service';

@Component({
  moduleId: module.id,
  selector: 'bim-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public name: string;

  constructor(public headerService: HeaderService) {
  }

  ngOnInit() {
    // this.modelService.getBaseModelInfo().then(model => {
    //   this.name = model.Name;
    // });
  }

  public close(event) {
    event.stopPropagation();
    if ((window as any).Itemclose) {
      (window as any).Itemclose();
    }
  }

  public share(event) {
    event.stopPropagation();
    const url = ``;
  }
}
