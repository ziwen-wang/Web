import {BrowserModule} from '@angular/platform-browser';
import {CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from './app.component';
import {HeaderComponent} from './component/header/header.component';
import {MenuComponent} from './component/menu/menu.component';
import {ModelComponent} from './component/model/model.component';
import {MenuService} from './component/menu/service/menu.service';
import {MemberComponent} from './component/member/member.component';
import {ModelService} from './common/service/model/model.service';
import {ViewService} from './common/service/view/view.service';
import {HttpModule} from '@angular/http';
import {DataTableModule, DropdownModule, InputTextModule, ContextMenuModule} from 'primeng/primeng';
import {ElementService} from './common/service/element/element.service';
import {SpaceComponent} from './component/space/space.component';
import {SpaceService} from './common/service/space/space.service';
import {ElementComponent} from './common/component/element/element.component';
import {PropertyComponent} from './common/component/property/property.component';
import {SystemComponent} from './component/system/system.component';
import {SystemService} from './common/service/system/system.service';
import {ParamService} from './common/service/param/param.service';
import {ViewpointComponent} from './component/viewpoint/viewpoint.component';
import {ViewpointService} from './common/service/viewpoint/viewpoint.service';
import {ViewpointTemplateComponent} from './common/component/viewpoint/viewpoint.component';
import {AnnotationComponent} from './component/annotation/annotation.component';
import {SheetTemplateComponent} from './common/component/sheet/sheet.component';
import {SheetComponent} from './component/sheet/sheet.component';
import {SheetService} from './common/service/sheet/sheet.service';
import {FormsModule} from '@angular/forms';
import {SummaryComponent} from './common/component/summary/summary.component';
import {TopologyComponent} from './component/topology/topology.component';
import {ComposerComponent} from './component/composer/composer.component';
import {GanttComponent} from './component/gantt/gantt.component';
import {GanttService} from './common/service/gantt/gantt.service';
import {SummaryService} from './common/service/summary/summary.service';
import {CommonService} from './common/service/common/common.service';
import {HeaderService} from './component/header/service/header.service';
import { IssueComponent } from './component/issue/issue.component';
import { SiteComponent } from './component/site/site.component';
import { DocumentComponent } from './component/document/document.component';
import {ComposerService} from './component/composer/composer.service';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MenuComponent,
    ModelComponent,
    MemberComponent,
    SpaceComponent,
    ElementComponent,
    PropertyComponent,
    SystemComponent,
    ViewpointComponent,
    ViewpointTemplateComponent,
    AnnotationComponent,
    SheetTemplateComponent,
    SheetComponent,
    SummaryComponent,
    TopologyComponent,
    ComposerComponent,
    GanttComponent,
    IssueComponent,
    SiteComponent,
    DocumentComponent,
  ],
  imports: [
    ContextMenuModule,
    HttpModule,
    BrowserAnimationsModule,
    BrowserModule,
    DataTableModule,
    InputTextModule,
    FormsModule,
    DropdownModule
  ],
  providers: [
    ParamService,
    MenuService,
    ModelService,
    ViewService,
    SpaceService,
    SystemService,
    ViewpointService,
    SheetService,
    GanttService,
    SummaryService,
    CommonService,
    ElementService,
    HeaderService,
    ComposerService],
  bootstrap: [AppComponent],
  schemas: [
    NO_ERRORS_SCHEMA,
    CUSTOM_ELEMENTS_SCHEMA,
  ]

})
export class AppModule {
}
