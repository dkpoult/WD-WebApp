import { VenueService } from 'src/app/shared/services/venue.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Building } from 'src/app/shared/services/models';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-edit-step',
  templateUrl: './edit-step.component.html',
  styleUrls: ['./edit-step.component.scss']
})
export class EditStepComponent implements OnInit {

  @Input() step;
  @Output() remove = new EventEmitter<void>();

  get venue() {
    return this.step.get('venue').get('venueCode');
  }

  get building() {
    return this.step.get('venue').get('buildingCode');
  }

  get floor() {
    return this.step.get('venue').get('floor');
  }

  private buildingList$ = this.venueService.newVenues$;

  buildingList: Building[];

  get floorList() {
    if (
      !this.building ||
      !this.building.value ||
      this.buildingList === undefined ||
      this.buildingList.length === 0
    ) { return []; }
    return this.buildingList.find(b => b.buildingCode === this.building.value).floors;
  }
  get venueList() {
    if (
      !this.building ||
      !this.floor.value ||
      this.floorList === undefined ||
      this.floorList.length === 0
    ) { return []; }
    return this.floorList[this.floor.value].venues;
  }
  private _buildingList: Building[];

  constructor(private venueService: VenueService) { }

  ngOnInit() {
    this.venueService.refreshVenues();
    this.buildingList$.subscribe(venues => {
      console.log(venues);
      this.buildingList = venues;
    });
  }

  removeStep() {
    this.remove.emit();
  }

}
