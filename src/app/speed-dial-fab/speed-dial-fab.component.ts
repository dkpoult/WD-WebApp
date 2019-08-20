import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { trigger, transition, style, animate, state, query, stagger, keyframes } from '@angular/animations';

@Component({
  selector: 'app-speed-dial-fab',
  templateUrl: './speed-dial-fab.component.html',
  styleUrls: ['./speed-dial-fab.component.scss'],
  animations: [
    trigger('fabToggler', [
      state('inactive', style({
        transform: 'rotate(0deg)'
      })),
      state('active', style({
        transform: 'rotate(225deg)'
      })),
      transition('* <=> *', animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    trigger('speedDialStagger', [
      transition('* => *', [

        query(':enter', style({ opacity: 0 }), { optional: true }),

        query(':enter', stagger('40ms',
          [
            animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
              keyframes(
                [
                  style({ opacity: 0, transform: 'translateY(10px)' }),
                  style({ opacity: 1, transform: 'translateY(0)' }),
                ]
              )
            )
          ]
        ), { optional: true }),

        query(':leave',
          animate('200ms cubic-bezier(0.4, 0.0, 0.2, 1)',
            keyframes([
              style({ opacity: 1 }),
              style({ opacity: 0 }),
            ])
          ), { optional: true }
        )

      ])
    ])
  ]
})
export class SpeedDialFabComponent implements OnInit {
  @Input() icon = 'add';
  @Input() spin = true;
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
