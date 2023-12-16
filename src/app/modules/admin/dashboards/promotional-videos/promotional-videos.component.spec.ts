import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionalVideosComponent } from './promotional-videos.component';

describe('PromotionalVideosComponent', () => {
  let component: PromotionalVideosComponent;
  let fixture: ComponentFixture<PromotionalVideosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PromotionalVideosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionalVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
