import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddContactFormComponent } from './add-contact-form.component';

describe('AddInterpeterFormComponent', () => {
  let component: AddContactFormComponent;
  let fixture: ComponentFixture<AddContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddContactFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
