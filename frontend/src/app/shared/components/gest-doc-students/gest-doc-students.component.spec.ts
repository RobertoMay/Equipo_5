import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestDocStudentsComponent } from './gest-doc-students.component';

describe('GestDocStudentsComponent', () => {
  let component: GestDocStudentsComponent;
  let fixture: ComponentFixture<GestDocStudentsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GestDocStudentsComponent]
    });
    fixture = TestBed.createComponent(GestDocStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
