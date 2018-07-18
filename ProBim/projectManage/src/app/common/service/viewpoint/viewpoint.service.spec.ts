import { TestBed, inject } from '@angular/core/testing';

import { ViewpointService } from './viewpoint.service';

describe('ViewpointService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewpointService]
    });
  });

  it('should be created', inject([ViewpointService], (service: ViewpointService) => {
    expect(service).toBeTruthy();
  }));
});
