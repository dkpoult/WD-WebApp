import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';
import { PermissionService } from 'src/app/shared/permission.service';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.scss']
})
export class CommentComponent implements OnInit {
  @Input() comment: any;
  @Input() level = 0;
  @Input() postCode: string; // ! I don't like this, needs to be built into comment or something
  @Input() isAnswer = false; // ! Remove when this is built into comment
  @Input() permissions = 0;
  get isLecturer() { return this.permissionService.isLecturer(this.permissions); }
  @Output() newAnswer = new EventEmitter<any>();

  skipAnimation: boolean;

  get isOwnPost() { return this.comment.poster === this.sharedService.currentUser.personNumber; }

  constructor(
    private sharedService: SharedService,
    private permissionService: PermissionService,
  ) { }

  ngOnInit() {
    this.skipAnimation = true;
    setTimeout(() => {
      this.skipAnimation = false;
    }, 500);
  }

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
