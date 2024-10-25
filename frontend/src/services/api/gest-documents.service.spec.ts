import { TestBed } from '@angular/core/testing';

import { GestDocumentsService } from './gest-documents.service';

describe('GestDocumentsService', () => {
  let service: GestDocumentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GestDocumentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
