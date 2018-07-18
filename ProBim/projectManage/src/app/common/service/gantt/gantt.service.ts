import {Injectable} from '@angular/core';
import {ParamService} from '../param/param.service';
import {Http} from '@angular/http';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class GanttService {

  constructor(private paramService: ParamService, private http: Http) {
  }

  public get4D(): Observable<any> {
    const url = (window as any).bim_config.server + `/Prj/Get4D?ProjectID=${this.paramService.param.projectID}&ModelID=${this.paramService.param.modelID}`;
    return this.http.get(url).map(res => JSON.parse(res.json()));
  }

}
