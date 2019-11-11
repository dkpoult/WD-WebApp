import { MatSnackBar } from '@angular/material';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VenueNode } from '../../../shared/services/venue.service';
import { FormArray, FormControl, FormGroup, Validators, ValidationErrors, AbstractControl } from '@angular/forms';
import { ScriptableEvent } from '../../../shared/services/models';
import { EventService } from '../../../shared/services/event.service';
import { TimetableService } from '../../../shared/services/timetable.service';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.scss']
})
export class ViewEventComponent implements OnInit {

  constructor(
    private eventService: EventService,
    private timetableService: TimetableService,
    private snackBar: MatSnackBar
  ) {
  }

  get stages() {
    return this.form.get('stages') as FormArray;
  }

  get event(): ScriptableEvent {
    return this._event;
  }

  @Input() set event(value: ScriptableEvent) {
    console.log(value);
    if (!value) {
      if (this.form) {
        this.form.reset();
      }

      this._event = null;
      this.form = new FormGroup({
        eventCode: new FormControl('', [Validators.required]),
        eventName: new FormControl('', [Validators.required]),
        eventDescription: new FormControl('', [Validators.required]),
        startDate: new FormControl(new Date(), [Validators.required]),
        endDate: new FormControl(new Date(), [Validators.required]),
        stages: new FormArray([])
      });
    } else {
      this._event = value;
      this.form = new FormGroup({
        eventCode: new FormControl(value.eventCode),
        eventName: new FormControl(value.eventName, [Validators.required]),
        eventDescription: new FormControl(value.eventDescription, [Validators.required]),
        startDate: new FormControl(value.startDate, [Validators.required]),
        endDate: new FormControl(value.endDate, [Validators.required]),
        stages: new FormArray([])
      });
      if (this.event.stages) {
        for (const stage of this.event.stages) {
          const control = new FormGroup({
            title: new FormControl(stage.title, [Validators.required]),
            text: new FormControl(stage.text, [Validators.required]),
            optional: new FormControl(stage.optional, [Validators.required]),
            steps: new FormArray([]),
            old: new FormControl(true),
            delete: new FormControl(false)
          });
          for (const step of stage.steps) {
            const stepControl = new FormGroup({
              text: new FormControl(step.text),
              venue: new FormGroup({
                buildingCode: new FormControl(step.venue.buildingCode),
                floor: new FormControl(step.venue.floor),
                venueCode: new FormControl(step.venue.venueCode),
                eventSpecific: new FormControl(false)
              }),
              old: new FormControl(true),
              delete: new FormControl(false)
            });
            (control.get('steps') as FormArray).push(stepControl);
          }
          this.stages.push(control);
        }
      }
    }
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }

  form: FormGroup;

  @Output() selectEvent = new EventEmitter<ScriptableEvent>();

  private _event: ScriptableEvent;

  filterDeleted = (item) => {
    return !item.value.delete;
  }

  ngOnInit() {
  }

  canSubmit() {
    return this.form.dirty && this.form.valid;
  }

  submit() {
    // const event: ScriptableEvent = this.form.value;
    const event = this.form.value;
    event.startDate = this.timetableService.getDateString(new Date(event.startDate));
    event.endDate = this.timetableService.getDateString(new Date(event.endDate));
    event.stages = event.stages.filter(e => !e.delete);
    event.stages = event.stages.map(e => {
      e.steps = e.steps.filter(s => !s.delete);
      return e;
    });

    if (this.event) {
      this.eventService.updateEvent(event);
    } else {
      this.eventService.createEvent(event);
    }
    this.form.markAsPristine();
    this.selectEvent.next(event);
  }

  addStage() {
    const control = new FormGroup({
      title: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
      optional: new FormControl(true, [Validators.required]),
      steps: new FormArray([]),
    });
    this.stages.push(control);
    console.log(this.stages);
  }

  delete() {
    this.eventService.removeEvent(this.event);
    this.selectEvent.next(null);
  }

  removeStage(index: number) {
    const removed = this.stages.at(index);
    this.form.markAsDirty();
    if (removed.value.old) {
      // Just mark it as delete
      removed.get('delete').setValue(true);
      const snackBarRef = this.snackBar.open(`Removed stage`, 'Undo', { duration: 15000 });
      snackBarRef.onAction().subscribe(() => {
        removed.get('delete').setValue(false);
      });
    } else {
      const i = this.stages.controls.findIndex(e => e.value.venueName === removed.value.venueName);
      // Remove it from the form
      const snackBarRef = this.snackBar.open(`Removed stage`, 'Undo', { duration: 15000 });
      snackBarRef.onAction().subscribe(() => {
        this.stages.insert(i, removed);
      });
      this.stages.removeAt(i);
    }
  }

  isFormGroup(control: AbstractControl): control is FormGroup {
    return !!(control as FormGroup).controls;
  }

  collectErrors(control: AbstractControl): any | null {
    if (this.isFormGroup(control)) {
      return Object.entries(control.controls)
        .reduce(
          (acc, [key, childControl]) => {
            const childErrors = this.collectErrors(childControl);
            if (childErrors) {
              acc = { ...acc, [key]: childErrors };
            }
            return acc;
          },
          null
        );
    } else {
      return control.errors;
    }
  }
}
