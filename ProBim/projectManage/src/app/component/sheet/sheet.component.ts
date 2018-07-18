import {ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import {SheetService} from '../../common/service/sheet/sheet.service';
import {ElementService} from '../../common/service/element/element.service';
import {DomHandler} from 'primeng/primeng';
import {ModelService} from '../../common/service/model/model.service';
import {CommonService} from '../../common/service/common/common.service';
import {AfterViewChecked} from '@angular/core/src/metadata/lifecycle_hooks';
import {ParamService} from '../../common/service/param/param.service';

declare let paper: any;
declare let view: any;
declare let Point: any;
declare let Rectangle: any;
declare let Size: any;
declare let Path: any;
declare let Raster: any;
declare let Tool: any;
declare let project: any;
declare let Popper: any;
declare let Group: any;
declare let PointText: any;
declare let Hammer;

@Component({
  selector: 'bim-sheet',
  templateUrl: './sheet.component.html',
  styleUrls: ['./sheet.component.scss'],
  providers: [DomHandler]
})
export class SheetComponent implements OnInit {

  public sheets: any[];

  public data: any;

  public raster: any;

  public tool: any;

  // public popper: any;
  public mouseRightDown: any;

  public isDragViewState: any;

  public lastPoint: any;

  public dragDoOnce: boolean;

  public elementProperty: any;

  @ViewChild('canvas') canvas: ElementRef;

  @ViewChild('canvasContent') canvasContent: ElementRef;

  public isMobileDevice: boolean = false;

  public isDisplaySheetList: boolean = true;

  public isDisplayShowSheet: boolean = true;

  private excludeTypes = ['OST_Walls',
    'OST_WallFoundationAnalytical',
    'OST_WallAnalytical',
    'OST_StackedWalls',
    'OST_SWallRectOpening',
    'OST_CurtainWallPanels',
    'OST_RailingSystemPanel',
    'OST_FloorAnalytical',
    'OST_FloorOpening',
    'OST_RoofOpening',
    'OST_Floors',
    'OST_BeamEndSegment',
    'OST_BeamStartSegment',
    'OST_BeamAnalytical',
    'OST_SiteRegion',
    'OST_SiteSurface',
    'OST_Site',
    'OST_TopographySurface',
    'OST_Topography',
    'OST_SecondaryTopographyContours',
    'OST_CeilingOpening',
    'OST_Ceilings',
    'OST_StructuralFramingOpening',
    'OST_ColumnOpening',
    'OST_ShaftOpening',
    'OST_CurtainWallMullions',
    'OST_BraceAnalytical',
    'OST_Rooms',
    'OST_Girder',
    'OST_StructuralFraming',
    'OST_StructuralFoundation',
    'OST_StructuralFramingSystem',
    'OST_Roofs',
    'OST_RoofSoffit',
    'OST_EdgeSlab',
    'OST_FoundationSlabAnalytical'];

  private modelId: string;

  private popper: any;

  private touchDelta = {x: 0, y: 0};
  private touchStartPoint = {x: 0, y: 0};
  private touchEndPoint = {x: 0, y: 0};

  private mc: any;

  constructor(private sheetService: SheetService,
              private elementService: ElementService,
              private changeDetector: ChangeDetectorRef,
              private modelService: ModelService,
              private commonService: CommonService,
              private paramService: ParamService,
              private domHandler: DomHandler) {
    this.elementProperty = [];
    this.isMobileDevice = this.commonService.browserCheck();
    this.isDisplayShowSheet = !this.isMobileDevice;
  }

  ngOnInit() {
    paper.install(window);
    this.sheets = [];
    for (let modelId of this.modelService.modelIds) {
      this.sheetService.getSheets(modelId).then(res => {
        let sheets = [];
        for (let sheet of (res as any).sheets) {
          sheet.modelId = modelId;
          sheets.push(sheet);
        }
        this.sheets.push(...sheets);
      });
    }

  }

  public backSheetList() {
    this.isDisplaySheetList = true;
    this.isDisplayShowSheet = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (view) {
      view.viewSize.width = this.domHandler.getWidth(this.canvas.nativeElement);
      view.viewSize.height = this.domHandler.getHeight(this.canvas.nativeElement);
      view.update();
    }
  }

  public show2D(event) {
    if (this.isMobileDevice) {
      this.isDisplaySheetList = false;
      this.isDisplayShowSheet = true;
    }

    // setTimeout(() => {
    this.initCanvas(event);
    // }, 20);
    // this.event = event;
  }


  /**
   * 鼠标滚轮事件
   * @param event
   */
  public mousewheelevent(event: MouseWheelEvent) {
    if (view === null) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (event.wheelDelta > 0) {
      view.scale(1.25, view.getEventPoint(event));
    } else {
      view.scale(0.8, view.getEventPoint(event));
    }
    view.update();
  }

  /**
   * 鼠标右键菜单事件
   */
  public contextMenu(event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    return false;
  }


  private getElementProperty(elementId) {
    this.elementProperty = [];
    this.elementProperty = null;
    this.elementService.getElementProperty(elementId, this.modelId).subscribe(elementInfo => {
      this.elementProperty = elementInfo;
      view.update();
      this.changeDetector.detectChanges();
    });
  }

  private initCanvas(event) {
    this.sheetService.getSheetPicture(event.modelId, event.sheetId).then((data) => {
      this.modelId = event.modelId;
      if (view) {
        view.remove();
      }
      paper.setup('twodimensionScene');
      if (project) {
        project.clear();
      }
      if (typeof(data) === 'undefined') {
        return;
      }
      this.data = data;
      if (this.raster) {

        this.raster.remove();
      }
      this.raster = new Raster({
        source: 'data:image/png;base64,' + data.imagebase64,
      });
      this.raster.on('load', () => {
        try {
          // if (this.doOnce === true) {
          this.drawElements();
          this.raster.position = new Point(this.raster.bounds.width / 2, this.raster.bounds.height / 2);
          // 关闭自动渲染更新view，
          // 需要通过view.update()手动更新，
          // 每次操作后执行
          view.autoUpdate = false;
          view.center = new Point(this.raster.bounds.width / 2, this.raster.bounds.height / 2);
          view.zoom = 0.64 * 0.8 * 0.8;
          view.update();
          // this.raster.size = new Size(this.raster.bounds.width*0.7, this.raster.bounds.height*0.7);
          // this.doOnce = false;
          // }
          // console.log('Successfully loaded image!');
        } catch (e) {
          console.log(e);
        }
      });
      this.tool = new Tool();
      this.tool.activate();

      if (this.isMobileDevice) {
        this.mobileOperation();
      } else {
        this.customOperation();
      }
      // if(true) {
      //   console.log('is ipad pro');
      // }
      data = null;
    });
    if (!this.isMobileDevice) {
      let popperDom = document.getElementById('ViewpointPopper');
      let myCanvas = document.getElementById('twodimensionScene');
      this.popper = new Popper(myCanvas, popperDom, {
        placement: 'top',
        onUpdate: function (e) {
          e.instance.popper.children[0].innerHTML = e.instance.popper.getAttribute('data-title');
          e.instance.popper.children[2].innerHTML = e.instance.popper.getAttribute('data-value');
        },
      });
      document.getElementById('pivotDiv').style.display = '';
    }


  }

  private customOperation() {
    this.tool.on('mouseup', this.mouseupEventHandle);
    this.tool.on('mousedown', this.mousedownEventHandle);
    this.tool.on('mousedrag', this.mousedragEventHandle);
  }

  /**
   * 鼠标抬起时
   * @param event
   */
  private mouseupEventHandle = (event) => {
    if (this.mouseRightDown) {
      this.isDragViewState = false;
      this.mouseRightDown = false;
    } else {
      if (event.event.target.id !== 'twodimensionScene') {
        return;
      }
      if (this.isDragViewState) {
        this.isDragViewState = false;
        // this.dragDoOnce = true;
      } else if (!this.isDragViewState && event.item && event.item.data && event.item.data.type === 'Element') {
        // console.log(event.item.data);
        // this.getElementProperty(event.item.data.elementId);
      }
    }
  };

  /**
   * 鼠标按下后事件
   * @param event
   */
  private mousedownEventHandle = (event) => {
    if (event.event.button === 2) {
      this.lastPoint = event.point;
      this.mouseRightDown = true;
    } else {
      if (event.event.target.id !== 'twodimensionScene') {
        return;
      }
      this.lastPoint = event.point;
    }
  };

  /**
   * 鼠标拖拽事件
   * @param event
   */
  private mousedragEventHandle = (event) => {
    if (this.mouseRightDown) {
      let delta = event.point.subtract(this.lastPoint);
      view.translate(delta);
      if (this.dragDoOnce) {
        this.isDragViewState = true;
        this.dragDoOnce = false;
      }
    } else {
      if (event.event.target.id !== 'twodimensionScene') {
        return;
      }
      if (event.event.target.id === 'twodimensionScene') {
        let delta = event.point.subtract(this.lastPoint);
        view.translate(delta);
      }
    }
    view.update();
  };


  /**
   * 绘制Element feature
   */
  private drawElements() {
    let featureArray = this.data.viewports[0].view.elements;
    for (let i = 0; i < featureArray.length; i++) {
      // for(let i=0; i<0000; i++) {
      if (this.excludeTypes.indexOf(featureArray[i].category) < 0) {
        if (i >= 100000) {
          return;
        }
        this.createElement(featureArray[i]);
      }
    }
  }

  private mobileOperation() {

    let twoDimension = document.getElementById('twodimensionScene');
    // this.mc = new Hammer(twoDimension);
    // this.mc.get('pan').set({direction: Hammer.DIRECTION_ALL});
    // this.mc.on('pan', (event) => {
    //   console.log(event);
    //   this.touchmove(event);
    // });
    document.getElementById('twodimensionScene').addEventListener('touchstart', this.touchstart);
    document.getElementById('twodimensionScene').addEventListener('touchmove', this.touchmove);
    document.getElementById('twodimensionScene').addEventListener('touchend', this.touchend);
  }

  /**
   * 创建单个构建对象
   * @param element
   */
  private createElement(element) {
    try {
      // if(!(element.id === '217846'||element.id === '212675'||element.id === '217842')) {
      let minY = this.raster.bounds.height - element.cropboxpix.min.V;
      let minX = element.cropboxpix.min.U;
      let maxY = this.raster.bounds.height - element.cropboxpix.max.V;
      let maxX = element.cropboxpix.max.U;
      let rectangle = null;
      if (this.data.viewports[0].view.viewtype === 'section') {
        // rectangle = new Rectangle(new Point(minX+170, minY-18), new Point(maxX+170, maxY-18));
        rectangle = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));

      } else if (this.data.viewports[0].view.viewtype === 'elevation') {
        // rectangle = new Rectangle(new Point(minX+170, minY-18), new Point(maxX+170, maxY-18));

        rectangle = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
      } else {
        // rectangle = new Rectangle(new Point(minX+19, minY-18), new Point(maxX+19, maxY-18));
        rectangle = new Rectangle(new Point(minX, minY), new Point(maxX, maxY));
      }
      let cornerSize = new Size(10, 10);
      let path = new Path.RoundRectangle(rectangle, cornerSize);
      path.fillColor = 'blue';
      path.opacity = 0.0;
      // path.name = element.name;

      path.data = {
        'type': 'Element',
        'elementId': element.id,
        'elementName': element.name,
        'elementCategory': element.category
      };
      // if (this.deviceService.browserCheck()) {
      path.on('click', (event) => {
        try {
          if (this.isDragViewState) {
            this.isDragViewState = false;
            return;
          }
          this.getElementProperty( event.target.data.elementId);
          // this.selectorService.removeAll().then(() => {
          //   try {
          //     this.zoomService.fitById(this.resourceService.param.modelID + '^' + event.target.data.elementId);
          //     //*******************()****************
          //     this.cameraGroup.position = this.getCamera2DPosition();
          //     // console.log(this.cameraGroup.rotation);
          //     //定位到特别的区域
          //     // this.zoomToSpecialPosition();
          //     view.update();
          //   } catch (e) {
          //     console.log(e);
          //   }
          // });
        } catch (e) {
          // console.log(e);
        }
      });
      // }
      path.on('mouseenter', (event) => {
        try {
          if (event.event.target.id !== 'twodimensionScene') {
            return;
          }
          // if (document.getElementById('twodimensionScene')) {
          document.getElementById('twodimensionScene').style.cursor = 'pointer';
          if (!this.isMobileDevice) {
            document.getElementById('pivotDiv').style.left = event.event.clientX + 'px';
            document.getElementById('pivotDiv').style.top = event.event.clientY - 50 + 'px';
            //   document.getElementById('twodimensionScene').style.cursor = 'pointer';
            let popperDom = document.getElementById('ViewpointPopper');
            this.popper.reference = document.getElementById('pivotDiv');
            popperDom.style.display = 'block';
            popperDom.setAttribute('data-title', path.data.elementName);
            popperDom.setAttribute('data-value', path.data.elementCategory);
            this.popper.update();
          }

          // }
        } catch (e) {
          console.log(e);
        }
      });
      path.on('mouseleave', (event) => {
        try {
          if (event.event.target.id !== 'twodimensionScene') {
            return;
          }
          // if (document.getElementById('twodimensionScene')) {
          document.getElementById('twodimensionScene').style.cursor = 'default';
          //
          let popperDom = document.getElementById('ViewpointPopper');
          popperDom.style.display = 'none';
          document.getElementById('twodimensionScene').style.cursor = 'default';
          // }
        } catch (e) {
          console.log(e);
        }
      });
    } catch (e) {
      console.log(e);
    }
  }

  private touchstart = (event) => {
    switch (event.touches.length) {
      case 1:
        this.lastPoint = view.getEventPoint(event);
        break;
      case 2:
        this.touchZoomStart(event);
        break;
    }
  };

  private touchmove = (event) => {
    event.preventDefault();
    switch (event.touches.length) {
      case 1:

        let point = view.getEventPoint(event);
        view.translate(point.x - this.lastPoint.x, point.y - this.lastPoint.y);
        view.update();
        break;
      case 2:
        this.touchZoom(event);
        view.update();
        break;
    }

  };

  private touchend = (event) => {
    switch (event.touches.length) {
      case 0:
        break;
      case 1:
        //   this.isDragViewState = false;
        break;
      case 2:
        break;
    }
  };

  private touchZoomStart(event) {

    let dx = event.touches[0].pageX - event.touches[1].pageX;
    let dy = event.touches[0].pageY - event.touches[1].pageY;

    let distance = Math.sqrt(dx * dx + dy * dy);

    this.touchStartPoint = {x: 0, y: distance};
  }


  private touchZoom(event) {

    let dx = event.touches[0].pageX - event.touches[1].pageX;
    let dy = event.touches[0].pageY - event.touches[1].pageY;

    let distance = Math.sqrt(dx * dx + dy * dy);

    this.touchEndPoint = {x: 0, y: distance};

    this.touchDelta = {x: this.touchEndPoint.x - this.touchStartPoint.x, y: this.touchEndPoint.y - this.touchStartPoint.y};

    if (this.touchDelta.y > 0) {
      // this.touchDelta.y

      view.scale(1 / 0.95, view.getEventPoint(event));

    } else if (this.touchDelta.y < 0) {

      view.scale(0.95, view.getEventPoint(event));

    }
  }

}
