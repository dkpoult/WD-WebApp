import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-view-bookings',
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.scss']
})
export class ViewBookingsComponent implements OnInit {

  @Output() update = new EventEmitter();
  @Input() course;

  form: FormGroup;

  constructor() { }

  ngOnInit() {
    this.form = new FormGroup({

    });
  }

  submit() {
    const v = this.form.value;
    this.update.emit(v);
    this.form.markAsPristine();
  }
}
