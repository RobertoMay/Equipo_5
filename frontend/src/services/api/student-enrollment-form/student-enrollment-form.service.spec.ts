import { TestBed } from '@angular/core/testing';

import { StudentEnrollmentFormService } from './student-enrollment-form.service';

describe('StudentEnrollmentFormService', () => {
  let service: StudentEnrollmentFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentEnrollmentFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
