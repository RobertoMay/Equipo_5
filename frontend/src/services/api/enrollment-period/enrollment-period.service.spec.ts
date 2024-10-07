import { TestBed } from '@angular/core/testing';

import { EnrollmentPeriodService } from './enrollment-period.service';

describe('EnrollmentPeriodService', () => {
  let service: EnrollmentPeriodService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnrollmentPeriodService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
