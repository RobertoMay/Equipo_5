import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamplecomponentComponent } from './examplecomponent.component';

describe('ExamplecomponentComponent', () => {
  let component: ExamplecomponentComponent;
  let fixture: ComponentFixture<ExamplecomponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamplecomponentComponent]
    });
    fixture = TestBed.createComponent(ExamplecomponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
