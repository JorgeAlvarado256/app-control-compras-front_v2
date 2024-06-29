import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PantallaCargaComponent } from './pantallaCarga.component';

describe('PantallaCargaComponent', () => {
  let component: PantallaCargaComponent;
  let fixture: ComponentFixture<PantallaCargaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PantallaCargaComponent]
    });
    fixture = TestBed.createComponent(PantallaCargaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
