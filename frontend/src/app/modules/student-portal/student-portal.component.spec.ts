import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPortalComponent } from './student-portal.component';

describe('StudentPortalComponent', () => {
  let component: StudentPortalComponent;
  let fixture: ComponentFixture<StudentPortalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentPortalComponent]
    });
    fixture = TestBed.createComponent(StudentPortalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
