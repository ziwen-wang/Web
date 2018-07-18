import {Injectable} from '@angular/core';
import {ModelService} from '../model/model.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {Http} from '@angular/http';
import {ParamService} from '../param/param.service';

@Injectable()
export class ViewService {

  public modelId2Views: Map<string, any[]>;

  constructor(private modelService: ModelService,
              private http: Http,
              private paramService: ParamService) {
    this.modelId2Views = new Map<string, any[]>();
  }

  public getView(modelId?: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (modelId === undefined) {
        modelId = this.paramService.param.modelID;
      }
      if (this.modelId2Views.has(modelId)) {
        resolve(this.modelId2Views.get(modelId));
      } else {
        const url = (window as any).bim_config.server + `/prj/GetAllViews?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}`;
        this.http.get(url).subscribe(res => {
          res = res.json();
          this.modelId2Views.set(modelId, res as any);
          resolve(res);
        });
      }
    });
  }

  public getElementByViewId<T>(modelId, viewId): Observable<T> {
    const url =  (window as any).bim_config.server + `/Model/GetAllElementsInView?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}` +
      `&VersionNO=${this.paramService.param.versionNO}&ViewID=${viewId}`;
    return this.http.get(url).map(res => res.json());
  }

}
