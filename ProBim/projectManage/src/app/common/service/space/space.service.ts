import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {ParamService} from '../param/param.service';

@Injectable()
export class SpaceService {

  public modelId2LevelInfo: Map<string, any>;

  public spaceNumber: number = 0;

  constructor(private http: Http, private paramService: ParamService) {
    this.modelId2LevelInfo = new Map<string, any>();
  }

  public getSpaceTree(modelId: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (this.modelId2LevelInfo.has(modelId)) {
        resolve(this.modelId2LevelInfo.get(modelId));
      } else {
        const url = (window as any).bim_config.server + `/Model/GetFile?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${this.paramService.param.versionNO}&FileType=ModelStructure&FileName=spacetree`;
        this.http.get(url).subscribe(res => {
          if ((res as any)._body === '') {
            this.modelId2LevelInfo.set(modelId, '');
            resolve('');
          } else {
            res = res.json();
            this.modelId2LevelInfo.set(modelId, res);
            resolve(res);
          }
        });
      }
    });
  }

  public getSpaceProperty<T>(modelId: string, spaceId: string): Observable<T> {
    const url = (window as any).bim_config.server + `/Model/GetSpaceProperty?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${this.paramService.param.versionNO}&ElementID=${spaceId}`;
    return this.http.get(url).map(res => res.json());
  }

  public getSpaceElement<T>(modelId: string, spaceId: string): Observable<T> {
    const url = (window as any).bim_config.server + `/Model/LoadSpace`;
    let formData = new FormData();
    formData.append('ProjectID', this.paramService.param.projectID);
    formData.append('ModelID', modelId);
    formData.append('VersionNO', this.paramService.param.versionNO);
    formData.append('Space', spaceId);
    formData.append('WithBlock', false + '');
    formData.append('CategoryID', '');
    return this.http.post(url, formData).map(res => res.json());
  }

  public getAllSpaceCount(modelId?: string, version?: string): Promise<number> {
    return new Promise<number>(resolve => {
      if (this.spaceNumber !== 0) {
        resolve(this.spaceNumber);
      } else {
        if (modelId === undefined) {
          modelId = this.paramService.param.modelID;
        }
        if (version === undefined) {
          version = this.paramService.param.versionNO;
        }
        const url = (window as any).bim_config.server + `/Model/GetAllSpaceCount?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${version}`;
        this.http.get(url).subscribe(res => {
          this.spaceNumber = parseInt(res.text(), 10);
          resolve(this.spaceNumber);
        });
      }
    });
  }

}
