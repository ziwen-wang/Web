import { TestBed, inject } from '@angular/core/testing';

import { ComposerService } from './composer.service';

describe('ComposerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComposerService]
    });
  });

  it('should be created', inject([ComposerService], (service: ComposerService) => {
    expect(service).toBeTruthy();
  }));
});
