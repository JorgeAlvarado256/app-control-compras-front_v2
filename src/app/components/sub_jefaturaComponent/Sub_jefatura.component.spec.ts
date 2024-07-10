import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Sub_jefaturaComponent } from './Sub_jefatura.component';

describe('Sub_jefaturaComponent', () => {
  let component: Sub_jefaturaComponent;
  let fixture: ComponentFixture<Sub_jefaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [Sub_jefaturaComponent]
    });
    fixture = TestBed.createComponent(Sub_jefaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
