import {Injectable} from '@angular/core';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {Observable} from 'rxjs/Observable';
import {Http} from '@angular/http';

export interface Access {
  needAccess: boolean;
  accessObject: any;
}

export interface Param {
  useTexture: boolean;
  projectID: string;
  projectName: string;
  loadCategory: string;
  userName: string;
  modelID: string;
  viewID: string;
  viewpointID: string;
  versionNO: string;
  modelTree: boolean;
  currentModelID: string;
  userNameCN: string;
  sessionID: string;
  snapshot: boolean;
  bim365ProjectID: string;
  access: Access;
  workflow: any;
  markupCategory: any[];
  viewpointCategory: any[];
  enableRenderer: boolean;
}

@Injectable()
export class ParamService {

  public param: Param = null;

  public isFirst: boolean = true;

  constructor(private http: Http) {
    this.param = {
      useTexture: false,
      projectID: '734ca1e0-4f4a-e842-6b84-f59cd1c7b218',
      projectName: '',
      userName: '',
      loadCategory: '',
      modelID: 'e1b61a41-9f56-49fd-8597-f0c4a2337b43',
      viewID: '',
      viewpointID: '',
      versionNO: '',
      modelTree: false,
      currentModelID: '',
      userNameCN: '',
      sessionID: '',
      snapshot: false,
      bim365ProjectID: '',
      access: null,
      workflow: '',
      markupCategory: [] = [],
      viewpointCategory: [] = [],
      enableRenderer: true,
    };
  }

  public initParam(params?: any) {
    if (this.isFirst === false) {
      return false;
    }
    this.isFirst = false;
    if (params === undefined) {
      let access = {
        needAccess: false,
        accessObject: [],
      };
      this.param.useTexture = this.getQueryBoolean('usetex') || true;
      this.param.bim365ProjectID = this.getQueryString('bim365ProjectId') || 'd975e1ea-7128-ceed-ac77-4a28d3bfd472';
      this.param.projectID = this.getQueryString('projectId') || '7625a0b0-ae55-4131-843c-c791f93ff496';
      this.param.userName = this.getQueryString('user') || 'Yousong';
      this.param.loadCategory = this.getQueryString('category') || 'model';
      this.param.viewID = this.getQueryString('viewID') || '';
      this.param.modelID = this.getQueryString('model') || '25414c2b-6c54-4640-9c78-21dc9117d13d';
      this.param.versionNO = this.getQueryString('ver') || '';
      this.param.modelTree = this.getQueryBoolean('modelTree') || true;
      this.param.currentModelID = this.getQueryString('model');
      this.param.userNameCN = '';
      this.param.sessionID = this.getQueryString('SessionID') || '';
      this.param.snapshot = this.getQueryBoolean('Snapshot') || false;
      this.param.access = access;
      this.param.viewpointID = this.getQueryString('viewpointId') || '';
      this.param.markupCategory = this.getQueryJson('markupCategory') || '';
      this.param.viewpointCategory = this.getQueryJson('viewpointCategory') || '';
      this.param.enableRenderer = this.getQueryBoolean('enableRenderer') === false ? false : true;
    } else {
      this.param.projectID = params.ProjectID;
      this.param.bim365ProjectID = params.BIM365ProjectID;
      this.param.projectName = params.ProjectName;
      this.param.currentModelID = this.param.modelID = params.ModelID;
      if ((params.VersionNO === undefined) || (params.VersionNO === 'undefined')) {
        this.param.versionNO = '';
      }
      this.param.versionNO = params.VersionNO;
      this.param.viewpointID = params.ViewpointID === undefined ? '' : params.ViewpointID;
      this.param.viewID = params.ViewID === undefined ? '' : params.ViewID;
      this.param.userName = params.UserName;
      this.param.userNameCN = params.UserNameCN;
      this.param.useTexture = params.Texture;
      this.param.snapshot = params.Snapshot;
      this.param.loadCategory = params.category === undefined ? 'model' : params.category;
      let access = {
        needAccess: params.Access.length > 0 ? true : false,
        accessObject: params.Access,
      };
      this.param.access = access;
      this.param.workflow = params.Workflow;
      this.param.markupCategory = params.MarkupCategory;
      this.param.viewpointCategory = params.ViewpointCategory;
      this.param.enableRenderer = true;
    }
    return true;
  }

  public getParamBySessionId(sessionId): Observable<any> {
    const url = (window as  any).bim_config.server + `/Sys/GetURLParameters?ID=${sessionId}`;
    return this.http.get(url).map(res => JSON.parse(res.json()));
  }

  public getQueryString(name: string): string {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) {
      return r[2];
    }
    return null;
  }

  public getQueryBoolean(name: string): boolean {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) {
      if (r[2] === 'false') {
        return false;
      } else {
        return true;
      }
    }
    return null;
  }

  public getQueryJson(name: string): any {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
    let r = window.location.search.substr(1).match(reg);
    if (r !== null) {
      return JSON.parse(r[2]);
    }
    return null;
  }

}
