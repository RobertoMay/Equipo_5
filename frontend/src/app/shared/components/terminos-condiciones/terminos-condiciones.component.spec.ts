import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminosCondicionesComponent } from './terminos-condiciones.component';

describe('TerminosCondicionesComponent', () => {
  let component: TerminosCondicionesComponent;
  let fixture: ComponentFixture<TerminosCondicionesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TerminosCondicionesComponent]
    });
    fixture = TestBed.createComponent(TerminosCondicionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
