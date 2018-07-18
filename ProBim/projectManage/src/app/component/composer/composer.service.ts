import {ElementRef, Injectable} from '@angular/core';
import {MenuService} from '../menu/service/menu.service';

@Injectable()
export class ComposerService {
  public composerElementRef: ElementRef;

  public is4D = false;

  constructor(public menuService: MenuService) {
  }

  public showComposer(height: number, width: number, isShow: boolean) {
    if (this.composerElementRef === undefined) {
      this.menuService.modelClick(undefined, true);
    } else {
      this.composerElementRef.nativeElement.style.width = width + 'px';
      this.composerElementRef.nativeElement.style.height = height + 'px';
      this.menuService.modelIsDisplay = isShow;
      this.menuService.appChangeDetector.detectChanges();
    }

  }

}
