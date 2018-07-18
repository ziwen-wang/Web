import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {GanttService} from '../../common/service/gantt/gantt.service';
import {ComposerService} from '../composer/composer.service';
import {ParamService} from '../../common/service/param/param.service';

declare var gantt;

@Component({
  selector: 'bim-gantt',
  templateUrl: './gantt.component.html',
  styleUrls: ['./gantt.component.scss']
})
export class GanttComponent implements OnInit {

  @ViewChild('iframe') scheduleElementRef: ElementRef;
  public height: string = '0px';
  public width: string = '0px';
  @ViewChild('iframe') iframe: ElementRef;

  constructor(private ganttService: GanttService,
              private paramService: ParamService,
              private composerService: ComposerService) {
    // this.ganttService.get4D().subscribe(res => {
    //   this.initGantt();
    //   // gantt.clearAll();
    //   this.initTask(res);
    // });
    this.height = document.body.clientHeight - 44 + 'px';
    this.width = document.body.clientWidth - 120 + 'px';
  }

  ngOnInit() {
    this.iframe.nativeElement.src = `/schedule-vue/index.html?urlConfig=${'https://bimcomposer.probim.cn'}&ProjectID=${this.paramService.param.modelID}&ModelID=${this.paramService.param.modelID}`;
    (this.scheduleElementRef.nativeElement.contentWindow as any).showOrHideComposer = (event) => {
      let height = document.body.clientHeight - 44;
      let width = 600;
      this.composerService.showComposer(height, width, event);
    };
  }

  // private initGantt() {
  //   gantt.config.xml_date = '%Y-%m-%d %H:%i';
  //   gantt.config.multiselect = true;
  //   gantt.config.row_height = 32;
  //   this.initLocale();
  //
  //   gantt.templates.progress_text = function (start, end, task) {
  //     return '<span>' + Math.round(task.progress * 100) + '% </span>';
  //   };
  //   gantt.init(this.ganttContainer.nativeElement);
  // }
  //
  // private initLocale() {
  //
  //   let locale = {
  //     date: {
  //       month_full: ['一月', '二月', '三月', '四月', '五月', '六月', '七月',
  //         '八月', '九月', '十月', '十一月', '十二月'],
  //       month_short: ['一月', '二月', '三月', '四月', '五月', '六月', '七月',
  //         '八月', '九月', '十月', '十一月', '十二月'],
  //       day_full: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六',
  //         '星期七'],
  //       day_short: ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六',
  //         '星期七']
  //     },
  //     labels: {
  //       new_task: '新建任务',
  //       icon_save: '保存',
  //       icon_cancel: '关闭',
  //       icon_details: 'Details',
  //       icon_edit: '编辑',
  //       icon_delete: '删除',
  //       confirm_closing: '',
  //       confirm_deleting: '是否删除任务?',
  //
  //       section_description: '描述',
  //       section_time: '时间',
  //
  //       /* link confirmation */
  //
  //
  //       type_task: 'Task',
  //       type_project: 'Project',
  //       type_milestone: 'Milestone',
  //
  //       column_text: '任务',
  //       column_start_date: '开始时间',
  //       column_duration: '周期',
  //       column_add: '',
  //
  //
  //       confirm_link_deleting: '是否要删除链接?',
  //       link_from: 'From',
  //       link_to: 'To',
  //       link_start: '开始',
  //       link_end: '结束',
  //
  //       minutes: 'Minutes',
  //       hours: '时',
  //       days: '天',
  //       weeks: '星期',
  //       months: '月',
  //       years: '年'
  //     }
  //   };
  //   gantt.locale = locale;
  // }
  //
  // private initTask(res) {
  //   let tasks = [];
  //   let links = [];
  //   for (let object4D of res.Tasks) {
  //     tasks.push({
  //       id: parseInt(object4D.TaskID, 10),
  //       text: object4D.TaskName,
  //       start_date: new Date(object4D.StartDate),
  //       duration: parseInt(object4D.Duration, 10),
  //       progress: parseFloat(object4D.Progress),
  //       parent: parseInt(object4D.Parent, 10),
  //       $open: object4D.OpenStatus
  //     });
  //     // this.ganttTaskService.taskIdMapElementIds.set(object4D.TaskID, object4D.LinkedElements);
  //   }
  //
  //   for (let link of res.Links) {
  //     links.push({
  //       id: parseInt(link.LinkID, 10),
  //       source: parseInt(link.Source, 10),
  //       target: parseInt(link.Target, 10),
  //       type: link.LinkType
  //     });
  //   }
  //   gantt.parse({
  //     data: tasks,
  //     links: links
  //   });
  //   gantt.render();
  //   gantt.setSizes();
  // }
}
