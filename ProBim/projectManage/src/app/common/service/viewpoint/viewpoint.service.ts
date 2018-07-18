import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ModelService} from '../model/model.service';
import {ParamService} from '../param/param.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ViewpointService {

  public modelId2Viewpoint: Map<string, any>;

  constructor(private http: Http, private paramService: ParamService, private modelService: ModelService) {
    this.modelId2Viewpoint = new Map<string, any>();
  }

  public getAllViewpoint(modelId?: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (modelId === undefined) {
        modelId = this.paramService.param.modelID;
      }
      // if (this.modelId2Viewpoint.has(modelId)) {
      //   resolve(this.modelId2Viewpoint.get(modelId));
      // } else {
        const url = (window as any).bim_config.server + `/Prj/GetAllViewpoint?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}`;
        this.http.get(url).subscribe(res => {
          this.modelId2Viewpoint.set(modelId, res.json());
          resolve(res.json());
        });
      // }
    });
  }

  public getViewpointSnapshot(viewpointId: string): Observable<string> {
    const url = (window as any).bim_config.server + `/Prj/GetViewpointSnapshot?ProjectID=${this.paramService.param.projectID}&ViewpointID=${viewpointId}`;
    return this.http.get(url).map(res => res.text());
  }

}
