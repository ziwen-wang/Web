import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ParamService} from '../param/param.service';

@Injectable()
export class SystemService {

  public modelId2System: Map<string, any> = null;

  constructor(private http: Http, private paramService: ParamService) {
    this.modelId2System = new Map<string, any>();
  }

  public getSystemList<T>(modelId?: string, version?: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (modelId === undefined) {
        modelId = this.paramService.param.modelID;
      }
      if (version === undefined) {
        version = this.paramService.param.versionNO;
      }
      if (this.modelId2System.has(modelId)) {
        resolve(this.modelId2System.get(modelId));
      } else {
        const url = (window as any).bim_config.server + `/Model/GetAllMEPSystemType?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${version}`;
        return this.http.get(url).subscribe(res => {
          res = res.json();
          this.modelId2System.set(modelId, res);
          resolve(res);
        });
      }
    });
  }

  public getSystemElement<T>(modelId: string, MEPSystemType: string): Observable<T> {
    const url = (window as any).bim_config.server + `/Model/LoadMEPSystemType`;
    let formData = new FormData();
    formData.append('ProjectID', this.paramService.param.projectID);
    formData.append('ModelID', modelId);
    formData.append('VersionNO', '');
    formData.append('MEPSystemType', MEPSystemType);
    formData.append('CategoryID', '');
    formData.append('WithBlock', false + '');
    return this.http.post(url, formData).map(res => {
      return res.json();
    });
  }

}
