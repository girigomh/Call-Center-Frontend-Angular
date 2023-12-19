import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyHoursModalComponent } from './company-hours-modal.component';

describe('CompanyHoursModalComponent', () => {
  let component: CompanyHoursModalComponent;
  let fixture: ComponentFixture<CompanyHoursModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompanyHoursModalComponent]
    });
    fixture = TestBed.createComponent(CompanyHoursModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
