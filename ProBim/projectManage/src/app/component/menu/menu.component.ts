import {Component, OnInit} from '@angular/core';
import {MenuService} from './service/menu.service';
import {CommonService} from '../../common/service/common/common.service';

@Component({
  moduleId: module.id,
  selector: 'bim-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  public isMobileDevice: boolean;

  constructor(public menuService: MenuService,
              private commonService: CommonService) {
    this.isMobileDevice = this.commonService.browserCheck();
  }

  ngOnInit() {
  }


}
