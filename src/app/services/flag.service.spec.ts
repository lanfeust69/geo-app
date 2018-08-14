import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { FlagService } from './flag.service';

describe('FlagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ FlagService ]
    });
  });

  it('should be created', inject([FlagService], (service: FlagService) => {
    expect(service).toBeTruthy();
  }));
});
