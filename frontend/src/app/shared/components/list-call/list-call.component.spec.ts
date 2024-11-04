import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListCallComponent } from './list-call.component';

describe('ListCallComponent', () => {
  let component: ListCallComponent;
  let fixture: ComponentFixture<ListCallComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListCallComponent]
    });
    fixture = TestBed.createComponent(ListCallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
