import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdquisidorComponent } from './adquisidor.component';

describe('AdquisidorComponent', () => {
  let component: AdquisidorComponent;
  let fixture: ComponentFixture<AdquisidorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdquisidorComponent]
    });
    fixture = TestBed.createComponent(AdquisidorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
