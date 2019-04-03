import { Component, OnInit, Input } from '@angular/core';


@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss']
})
export class SpeedDialFabComponent implements OnInit {
  @Input() icon = 'add';
  @Input() actions: Array<any>;

  opened = false;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.opened = !this.opened;
    console.log(this.actions);
  }

}
