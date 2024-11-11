import { TestBed } from '@angular/core/testing';

import { ExpiredService } from './expired.service';

describe('ExpiredService', () => {
  let service: ExpiredService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExpiredService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
