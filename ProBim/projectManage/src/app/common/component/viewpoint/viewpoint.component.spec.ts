import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewpointComponent } from './viewpoint.component';

describe('ViewpointComponent', () => {
  let component: ViewpointComponent;
  let fixture: ComponentFixture<ViewpointComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewpointComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewpointComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
