import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmEnrolmentComponent } from './confirm-enrolment.component';

describe('ConfirmEnrolmentComponent', () => {
  let component: ConfirmEnrolmentComponent;
  let fixture: ComponentFixture<ConfirmEnrolmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmEnrolmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmEnrolmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
