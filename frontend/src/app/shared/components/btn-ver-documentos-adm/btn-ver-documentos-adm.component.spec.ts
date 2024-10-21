import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BtnVerDocumentosAdmComponent } from './btn-ver-documentos-adm.component';

describe('BtnVerDocumentosAdmComponent', () => {
  let component: BtnVerDocumentosAdmComponent;
  let fixture: ComponentFixture<BtnVerDocumentosAdmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BtnVerDocumentosAdmComponent]
    });
    fixture = TestBed.createComponent(BtnVerDocumentosAdmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
