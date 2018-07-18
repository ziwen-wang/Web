import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ParamService} from '../param/param.service';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class SheetService {

  public modelId2SheetInfo: Map<string, any> = null;

  constructor(private http: Http, private paramService: ParamService) {
    this.modelId2SheetInfo = new Map<string, any>();
  }

  public getSheets<T>(modelId?: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (modelId === undefined) {
        modelId = this.paramService.param.modelID;
      }
      if (this.modelId2SheetInfo.has(modelId)) {
        resolve(this.modelId2SheetInfo.get(modelId));
      } else {
        const url = (window as any).bim_config.server + `/Model/GetFile?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${this.paramService.param.versionNO}&FileType=PlanView&FileName=sheets`;
        this.http.get(url).subscribe(res => {
          if ((res as any)._body === '') {
            this.modelId2SheetInfo.set(modelId, {sheets: []});
          } else {
            this.modelId2SheetInfo.set(modelId, res.json());
          }
          resolve(this.modelId2SheetInfo.get(modelId));
        });
      }
    });

  }

  public getSheetPicture(modelId, sheetId) {
    let fileName = 'sheets';
    if (sheetId) {
      fileName = sheetId;
    }
    const url = (window as any).bim_config.server + `/Model/GetFile?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${this.paramService.param.versionNO}&FileType=PlanView&FileName=${fileName}`;
    return this.http.get(url)
      .toPromise().then(res => res.json(), res => {
        // console.log(res);
      })
      .then(data => {
        return data;
      });
  }

}
