import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/shared/services/shared.service';
import { PermissionService } from 'src/app/shared/services/permission.service';
import { transition, trigger, style, animate, keyframes } from '@angular/animations';
import {UserService} from '../../../shared/services/user.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss'],
  animations: [
    trigger(
      'bounce', [
        transition('none => answer', [
          animate(300,
            keyframes([
              // Copy of rubberBand animation
              style({ transform: 'scale3d(1, 1, 1)', offset: 0 }),
              style({ transform: 'scale3d(1.25, 0.75, 1)', offset: 0.3 }),
              style({ transform: 'scale3d(0.75, 1.25, 1)', offset: 0.4 }),
              style({ transform: 'scale3d(1.15, 0.85, 1)', offset: 0.5 }),
              style({ transform: 'scale3d(0.95, 1.05, 1)', offset: 0.65 }),
              style({ transform: 'scale3d(1.05, 0.95, 1', offset: 0.75 }),
              style({ transform: 'scale3d(1, 1, 1)', offset: 1 })
            ]),
          )])
      ]),
  ]
})
export class CommentComponent implements OnInit {
  @Input() comment: any;
  @Input() level = 0;
  @Input() postCode: string; // ! I don't like this, needs to be built into comment or something
  @Input() isAnswer = false; // ! Remove when this is built into comment
  @Input() permissions = 0; // ! This also needs to be dynamic

  @Output() newAnswer = new EventEmitter<any>();
  @Output() changeVote = new EventEmitter<number>();

  get isLecturer() { return this.permissionService.isLecturer(this.permissions); }

  get isOwnPost() { return this.comment.poster === this.userService.currentUser.personNumber; }

  constructor(
    private sharedService: SharedService,
    private userService: UserService,
    private permissionService: PermissionService,
  ) { }

  ngOnInit() { }

  markAsAnswer() {
    this.sharedService.markAsAnswer(this.postCode, this.comment.code)
      .subscribe((response: any) => {
        switch (response.responseCode) {
          case 'successful':
            this.isAnswer = true;
            this.newAnswer.emit(this.comment);
            break;
          default:
            console.log(response);
            break;
        }
      });
  }
}
