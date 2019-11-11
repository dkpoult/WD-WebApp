import { EventStage } from './../../../../shared/services/models';
import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormArray, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-edit-flow',
  templateUrl: './edit-flow.component.html',
  styleUrls: ['./edit-flow.component.scss']
})
export class EditFlowComponent implements OnInit {

  panelOpenState: boolean;

  @Input() stage;
  @Output() remove = new EventEmitter<void>();

  filterDeleted = (item) => {
    return !item.value.delete;
  }

  constructor(
    private snackBar: MatSnackBar,
  ) { }

  get steps() {
    console.log(this.stage.get('steps'));
    return this.stage.get('steps') as FormArray;
  }

  addStep() {
    const control = new FormGroup({
      text: new FormControl('', [Validators.required]),
      venue: new FormGroup({
        buildingCode: new FormControl(''),
        floor: new FormControl(''),
        venueCode: new FormControl('')
      }, [])
    });
    this.steps.push(control);
  }

  ngOnInit() {
  }

  removeStage() {
    this.remove.emit();
  }

  removeStep(index: number) {
    const removed = this.steps.at(index);
    this.stage.markAsDirty();
    if (removed.value.old) {
      // Just mark it as delete
      removed.get('delete').setValue(true);
      const snackBarRef = this.snackBar.open(`Removed step`, 'Undo', { duration: 7500 });
      snackBarRef.onAction().subscribe(() => {
        removed.get('delete').setValue(false);
      });
    } else {
      const i = this.steps.controls.findIndex(e => e.value.venueName === removed.value.venueName);
      // Remove it from the form
      const snackBarRef = this.snackBar.open(`Removed step`, 'Undo', { duration: 7500 });
      snackBarRef.onAction().subscribe(() => {
        this.steps.insert(i, removed);
      });
      this.steps.removeAt(i);
    }
  }

}
