import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonPdfComponent } from './button-pdf.component';

describe('ButtonPdfComponent', () => {
  let component: ButtonPdfComponent;
  let fixture: ComponentFixture<ButtonPdfComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ButtonPdfComponent]
    });
    fixture = TestBed.createComponent(ButtonPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
