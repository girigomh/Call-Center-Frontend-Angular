import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointmentStepperComponent } from './appointment-stepper.component';

describe('AppointmentStepperComponent', () => {
  let component: AppointmentStepperComponent;
  let fixture: ComponentFixture<AppointmentStepperComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AppointmentStepperComponent]
    });
    fixture = TestBed.createComponent(AppointmentStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
