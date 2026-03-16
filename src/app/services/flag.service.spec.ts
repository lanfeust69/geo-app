import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, inject } from '@angular/core/testing';

import { FlagService } from './flag.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('FlagService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [FlagService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
  });

  it('should be created', inject([FlagService], (service: FlagService) => {
    expect(service).toBeTruthy();
  }));
});
