import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubmitChangesComponent } from './submit-changes.component';

describe('SubmitChangesComponent', () => {
  let component: SubmitChangesComponent;
  let fixture: ComponentFixture<SubmitChangesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubmitChangesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubmitChangesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
