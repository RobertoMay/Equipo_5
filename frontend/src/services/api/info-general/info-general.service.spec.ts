import { TestBed } from '@angular/core/testing';

import { InfoGeneralService } from './info-general.service';

describe('InfoGeneralService', () => {
  let service: InfoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InfoGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
