import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

// TODO: Animation on open/close
@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss']
})
export class SpeedDialFabComponent implements OnInit {
  @Input() icon = 'add';
  @Input() actions: Array<any>;
  @Output() clicked = new EventEmitter<string>();
  opened = false;

  constructor() { }

  ngOnInit() {
  }

  toggle() {
    this.opened = !this.opened;
  }

  doAction(action: any) {
    this.clicked.emit(action.event);
    this.toggle();
  }

}
