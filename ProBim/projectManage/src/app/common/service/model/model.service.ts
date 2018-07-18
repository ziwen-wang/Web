import {Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {ParamService} from '../param/param.service';
import {promise} from 'selenium-webdriver';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class ModelService {

  public modelBaseInfo: any = null;

  public levelCount: number = 0;

  public levels: any[] = null;

  public isMerge = false;

  public modelIds: string[];

  public modelId2ModelInfo: Map<string, any>;

  // public modelId2Version: Map<string, string>;

  constructor(private http: Http, private paramService: ParamService) {
    this.modelIds = [];
    this.modelId2ModelInfo = new Map<string, any>();
    // this.modelId2Version = new Map<string, string>();
  }

  public getBaseModelInfo(): Promise<any> {
    return new Promise(resolve => {
      const url = (window as  any).bim_config.server + `/Prj/GetModel?ProjectID=${this.paramService.param.projectID}&ModelID=${this.paramService.param.modelID}`;
      if (this.modelBaseInfo !== null) {
        resolve(this.modelBaseInfo);
      } else {
        this.http.get(url).subscribe(res => {
          this.modelBaseInfo = res.json();
          this.isMerge = this.modelBaseInfo.IsMerge;
          if (this.isMerge) {
            let model2View = this.modelBaseInfo.Model_N_View.split('^');
            for (let modelView of model2View) {
              this.modelIds.push(modelView.split('@')[0]);
            }
          } else {
            this.modelIds.push(this.paramService.param.modelID);
          }
          resolve(this.modelBaseInfo);
        });
      }

    });

  }

  public getModelInfo(): Promise<number> {
    return new Promise<number>(resolve => {
      for (let modelId of this.modelIds) {
        const url = (window as  any).bim_config.server + `/Model/GetFile?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${this.paramService.param.versionNO}&FileType=Project&FileName=${'Model'}`;
        this.http.get(url).subscribe(res => {
          res = res.json();
          this.modelId2ModelInfo.set(modelId, res);
          // this.modelId2Version.set(modelId, (res as any).version);
          if (this.modelId2ModelInfo.size === this.modelIds.length) {
            resolve(this.modelIds.length);
          }
        });

      }
    });
  }

  public getLevelCount(modelId?: string, version?: string): Promise<number> {
    return new Promise<number>(resolve => {
      if (this.levelCount !== 0) {
        resolve(this.levelCount);
      } else {
        if (modelId === undefined) {
          modelId = this.paramService.param.modelID;
        }
        if (version === undefined) {
          version = this.paramService.param.versionNO;
        }

        const url = (window as  any).bim_config.server + `/Model/GetAllLevelCount?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${version}`;
        this.http.get(url).subscribe(res => {
          this.levelCount = parseInt(res.text(), 10);
          resolve(this.levelCount);
        });

      }
    });
  }

  public getLevel(modelId?: string, version?: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (this.levels !== null) {
        resolve(this.levels);
      } else {
        if (modelId === undefined) {
          modelId = this.paramService.param.modelID;
        }
        if (version === undefined) {
          version = this.paramService.param.versionNO;
        }
        const url = (window as  any).bim_config.server + `/Model/GetAllLevels?ProjectID=${this.paramService.param.projectID}&ModelID=${modelId}&VersionNO=${version}`;
        this.http.get(url).subscribe(res => {
          if (this.levels === null) {
            this.levels = [];
          }
          res = res.json();
          if ((res as any).length > 0) {
            for (let level of res as any) {
              if (level.LevelType === 'Level') {
                this.levels.push(level);
              }
            }
          } else {
            this.modelId2ModelInfo.forEach((modelInfo) => {
              for (let link of modelInfo.links) {
                for (let level of link.levels) {
                  this.levels.push(level);
                }
              }
            });
          }

          resolve(this.levels);
        });
      }
    });
  }

  public getVersion(): Observable<any> {
    const url = (window as  any).bim_config.server + `/Prj/GetAllVersions?ProjectID=${this.paramService.param.projectID}&ModelID=${this.paramService.param.modelID}`;
    return this.http.get(url).map(res => JSON.parse(res.json()));
  }

}
