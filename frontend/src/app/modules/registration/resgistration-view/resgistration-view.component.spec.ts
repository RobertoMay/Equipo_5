import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResgistrationViewComponent } from './resgistration-view.component';

describe('ResgistrationViewComponent', () => {
  let component: ResgistrationViewComponent;
  let fixture: ComponentFixture<ResgistrationViewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResgistrationViewComponent]
    });
    fixture = TestBed.createComponent(ResgistrationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
