import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjefaturaComponent } from './subjefatura.component';

describe('SubjefaturaComponent', () => {
  let component: SubjefaturaComponent;
  let fixture: ComponentFixture<SubjefaturaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjefaturaComponent]
    });
    fixture = TestBed.createComponent(SubjefaturaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
