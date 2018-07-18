import {Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {ModelService} from '../../service/model/model.service';
import {ParamService} from '../../service/param/param.service';
import {DomHandler} from 'primeng/primeng';
import {CommonService} from '../../service/common/common.service';

@Component({
  selector: 'template-element',
  templateUrl: './element.component.html',
  styleUrls: ['./element.component.scss'],
  providers: [DomHandler]
})
export class ElementComponent implements OnInit, OnChanges {

  @Input() element: any[];

  @Input() modelId: string;

  @Output() changeSelected: EventEmitter<any> = new EventEmitter<any>();

  @Output() backEvent: EventEmitter<any> = new EventEmitter<any>();

  public elementData: any[];

  public leftContent: string;

  public count = 50;

  public pageCount: any[];

  public first: number;

  public changeToPage: any;

  public currentPage: number;

  public allPage: number;

  public selectedPage: any;

  public searchTypeNames = [{label: '全部', value: null}];
  public filterTypeName = {label: '全部', value: null};

  public searchCategories = [{label: '全部', value: null}];
  public filterCategory = {label: '全部', value: null};

  public searchLevelNames = [{label: '全部', value: null}];
  public filterLevelName = {label: '全部', value: null};

  public height: string;

  public isMobileDevice: boolean = false;

  @ViewChild('dataTable') dataTable: any;

  @ViewChild('content') content: ElementRef;

  private allCount: number = 0;

  private levelId2LevelName: Map<string, string> = new Map<string, string>();

  constructor(private modelService: ModelService,
              private paramService: ParamService,
              private commonService: CommonService,
              private domHandler: DomHandler) {
    this.element = [];
    this.first = 0;
    this.currentPage = 1;
    this.elementData = [];
    this.isMobileDevice = this.commonService.browserCheck();
  }

  ngOnInit() {
    this.pageCount = [
      {label: '20', value: '20'},
      {label: '50', value: '50'},
      {label: '100', value: '100'},
    ];
    this.selectedPage = '50';
    if (this.commonService.browserCheck()) {
      this.selectedPage = '20';
      this.count = 20;
    }
    this.modelService.getLevel().then(levels => {
      for (let level of levels) {
        let id = level.ID === undefined ? level.id : level.ID;
        let levelId = '';
        if (id.indexOf('_') > -1) {
          levelId = id.split('_')[1];
        } else {
          levelId = id;
        }
        this.levelId2LevelName.set(this.paramService.param.modelID + '^' + levelId, level.Name !== undefined ? level.Name : level.name);
      }
    });
  }

  ngOnChanges() {
    // this.height = this.domHandler.getHeight(this.content.nativeElement) - 80 + 'px';
    this.height = this.domHandler.getHeight(this.content.nativeElement) - 150 + 'px';

    let startNumber = 1;
    this.allCount = this.element.length;
    this.allPage = parseInt((this.element.length / this.count).toString(), 10) + 1;
    this.leftContent = `第${startNumber}到${this.count > this.element.length ? this.element.length : this.count} 共${this.element.length}条 共${this.allPage}页`;

    let categorySet: Set<string> = new Set<string>();
    let type: Set<string> = new Set<string>();
    let levelSet: Set<string> = new Set<string>();
    this.elementData = [];
    for (let ele of this.element) {
      if (!categorySet.has(ele.CategoryName)) {
        this.searchCategories.push({label: ele.CategoryName, value: ele.CategoryName});
        categorySet.add(ele.CategoryName);
      }
      if (!type.has(ele.TypeName)) {
        this.searchTypeNames.push({label: ele.TypeName, value: ele.TypeName});
        type.add(ele.TypeName);
      }
      let levelNames = [];
      for (let levelId of ele.LevelID.split('|')) {
        let levelName = this.levelId2LevelName.get(this.paramService.param.modelID + '^' + levelId);
        levelNames.push(levelName);
      }
      if (!levelSet.has(levelNames.toString())) {
        this.searchLevelNames.push({label: levelNames.toString(), value: levelNames.toString()});
        levelSet.add(levelNames.toString());
      }

      // levelSet.forEach(level => {
      //   this.searchLevelNames.push({label: level, value: level});
      // });

      let level = {
        id: ele.ElementID,
        name: ele.Name,
        type: ele.TypeName,
        category: ele.CategoryName,
        level: levelNames.toString(),
        modelId: this.modelId,
      };
      this.elementData.push(level);
    }
  }

  public changeElementProperty(event) {
    this.changeSelected.emit(event);
  }

  public onFilter(event) {
    let filterCount = this.allCount = event.filteredValue.length;
    console.log(filterCount);
    this.allPage = parseInt((filterCount / this.count).toString(), 10) + 1;
    let startNumber = 1;
    this.leftContent = `第${startNumber}到${this.count > filterCount ? filterCount : this.count} 共${filterCount}条 共${this.allPage}页`;
  }

  public changePageCount(event) {
    event.originalEvent.stopPropagation();
    this.count = parseInt(event.value, 10);
    let startNumber = 1;
    this.allPage = parseInt((this.element.length / this.count).toString(), 10) + 1;
    this.leftContent = `第${startNumber}到${this.count} 共${this.element.length}条 共${this.allPage}页`;
    this.first = 0;
    this.changeToPage = 0;
    this.currentPage = 1;
    setTimeout(() => {
      this.dataTable.reset();
    }, 20);
  }

  public addPage() {
    this.first += this.count;
    this.currentPage++;
    let endCount = this.count * this.currentPage > this.allCount ? this.allCount : this.count * this.currentPage;
    this.leftContent = `第${this.count * (this.currentPage - 1) + 1}到${endCount} 共${this.element.length}条 共${this.allPage}页`;
  }

  public lessPage() {
    this.first -= this.count;
    this.currentPage--;
    let endCount = this.count * this.currentPage > this.allCount ? this.allCount : this.count * this.currentPage;
    this.leftContent = `第${this.count * (this.currentPage - 1) + 1}到${endCount} 共${this.element.length}条 共${this.allPage}页`;
  }

  public onblur() {
    if (this.changeToPage === undefined) {
      return;
    }
    if (isNaN(parseInt(this.changeToPage, 10))) {
      this.changeToPage = '';
      return;
    }

    if (parseInt(this.changeToPage, 10) - 1 < 0) {
      this.changeToPage = 1;
      return;
    }
    this.first = (parseInt(this.changeToPage, 10) - 1) * this.count;
    this.currentPage = parseInt(this.changeToPage, 10);
    let endCount = this.count * this.currentPage > this.allCount ? this.allCount : this.count * this.currentPage;
    this.leftContent = `第${this.count * (this.currentPage - 1) + 1}到${endCount} 共${this.element.length}条 共${this.allPage}页`;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.height = this.domHandler.getHeight(this.content.nativeElement) - 150 + 'px';
  }

  public clickBack(event) {
    this.backEvent.emit({originalEvent: event});
  }

}
