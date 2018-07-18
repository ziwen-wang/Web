import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ParamService} from '../param/param.service';
import {promise} from 'selenium-webdriver';

@Injectable()
export class ElementService {

  public elementCount: number = 0;

  constructor(private http: Http, private paramService: ParamService) {
  }

  public getElementProperty<T>(elementId: string, modelId: string): Observable<T> {
    let url = (window as  any).bim_config.server + `/Model/GetElementProperty?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${this.paramService.param.versionNO}&ElementID=${elementId}`;
    return this.http.get(url).map(res => res.json());
  }

  public getAllElementCount(modelId?: string, version?: string): Promise<number> {
    return new Promise<number>(resolve => {
      // if (this.elementCount !== 0) {
      //   resolve(this.elementCount);
      // } else {
        if (modelId === undefined) {
          modelId = this.paramService.param.modelID;
        }
        if (version === undefined) {
          version = this.paramService.param.versionNO;
        }
        const url = (window as  any).bim_config.server + `/Model/GetAllElementCount?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${version}`;
        this.http.get(url).subscribe(res => {
          this.elementCount = parseInt(res.text(), 10);
          resolve(this.elementCount);
        });
      // }
    });
  }

}
