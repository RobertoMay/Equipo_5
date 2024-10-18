import { TestBed } from '@angular/core/testing';

import { DatastudentService } from './datastudent.service';

describe('DatastudentService', () => {
  let service: DatastudentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatastudentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
