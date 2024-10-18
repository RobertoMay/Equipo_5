import { TestBed } from '@angular/core/testing';

import { StudentdocService } from './studentdoc.service';

describe('StudentdocService', () => {
  let service: StudentdocService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentdocService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
