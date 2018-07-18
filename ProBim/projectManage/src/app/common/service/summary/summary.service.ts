import {Injectable} from '@angular/core';
import {ParamService} from '../param/param.service';
// import {el} from '@angular/platform-browser/testing/src/browser_util';
import {Http} from '@angular/http';

// import {promise} from 'selenium-webdriver';

@Injectable()
export class SummaryService {

  public modelId2Document: Map<string, any>;

  public model2RelationScene: Map<string, any>;

  public model2Issue: Map<string, any>;

  constructor(private paramService: ParamService, private http: Http) {
    this.modelId2Document = new Map<string, any>();
    this.model2RelationScene = new Map<string, any>();
    this.model2Issue = new Map<string, any>();
  }

  /**
   * 得到文档数据
   * @param {string} modelId
   * @returns {Promise<any>}
   */
  public getDocument(modelId?: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (modelId === undefined) {
        modelId = this.paramService.param.modelID;
      }
      // if (this.modelId2Document.get(modelId) !== undefined) {
      //   resolve(this.modelId2Document.get(modelId));
      // } else {
        const url = (window as any).bim_config.server + `/Doc/GetFileCountBySourceID?ProjectID=${this.paramService.param.projectID}&LikeName=&SourceID=${modelId}`;
        this.http.get(url).subscribe(res => {
          let count = res.text();
          this.modelId2Document.set(modelId, count);
          resolve(count);
        });
      // }
    });
  }

  /**
   * 得到现场数据
   * @param {string} modelId
   * @returns {Promise<any>}
   */
  public getRelationScene(modelId?: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (modelId === undefined) {
        modelId = this.paramService.param.modelID;
      }
      if (this.model2RelationScene.get(modelId) !== undefined) {
        resolve(this.model2RelationScene.get(modelId));
      } else {
        const url = (window as any).bim_config.mainServer + `/GetRelationSceneBySourceID?SourceID=${modelId}`;
        this.http.get(url).subscribe(res => {
          res = res.json();
          this.model2RelationScene.set(modelId, res);
          resolve(res);
        });
      }
    });
  }

  public getIssue(modelId?: string): Promise<any> {
    return new Promise<any>(resolve => {
      if (modelId === undefined) {
        modelId = this.paramService.param.modelID;
      }
      if (this.model2Issue.get(modelId) !== undefined) {
        resolve(this.model2Issue.get(modelId));
      } else {
        const url = (window as any).bim_config.mainServer + `/GetRelationIssueBySourceID?SourceID=${modelId}&BIMComposerID=${this.paramService.param.projectID}`;
        this.http.get(url).subscribe(res => {
          res = res.json();
          this.model2Issue.set(modelId, res);
          resolve(res);
        });
      }
    });
  }

}
