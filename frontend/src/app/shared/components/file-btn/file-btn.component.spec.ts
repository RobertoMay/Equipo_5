import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileBtnComponent } from './file-btn.component';

describe('FileBtnComponent', () => {
  let component: FileBtnComponent;
  let fixture: ComponentFixture<FileBtnComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileBtnComponent]
    });
    fixture = TestBed.createComponent(FileBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
