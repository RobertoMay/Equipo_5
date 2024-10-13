import { TestBed } from '@angular/core/testing';

import { ModalLoginService } from './modal-login.service';

describe('ModalLoginService', () => {
  let service: ModalLoginService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalLoginService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
