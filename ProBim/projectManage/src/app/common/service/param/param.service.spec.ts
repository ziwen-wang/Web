import { TestBed, inject } from '@angular/core/testing';

import { ParamService } from './param.service';

describe('ParamService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParamService]
    });
  });

  it('should be created', inject([ParamService], (service: ParamService) => {
    expect(service).toBeTruthy();
  }));
});
