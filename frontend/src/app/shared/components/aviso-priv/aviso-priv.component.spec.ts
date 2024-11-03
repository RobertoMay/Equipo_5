import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvisoPrivComponent } from './aviso-priv.component';

describe('AvisoPrivComponent', () => {
  let component: AvisoPrivComponent;
  let fixture: ComponentFixture<AvisoPrivComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AvisoPrivComponent]
    });
    fixture = TestBed.createComponent(AvisoPrivComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
