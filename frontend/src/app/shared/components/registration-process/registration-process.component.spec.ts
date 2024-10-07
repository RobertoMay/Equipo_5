import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationProcessComponent } from './registration-process.component';

describe('RegistrationProcessComponent', () => {
  let component: RegistrationProcessComponent;
  let fixture: ComponentFixture<RegistrationProcessComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegistrationProcessComponent]
    });
    fixture = TestBed.createComponent(RegistrationProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
