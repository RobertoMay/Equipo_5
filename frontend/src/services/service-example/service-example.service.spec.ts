import { TestBed } from '@angular/core/testing';

import { ServiceExampleService } from './service-example.service';

describe('ServiceExampleService', () => {
  let service: ServiceExampleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceExampleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
