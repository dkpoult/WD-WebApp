import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from 'src/app/shared/shared.service';

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
  @Input() isLecturer = true; // ! There is no easy way to actually tell if the user is the lecturer of the course a post is made in
  @Output() newAnswer = new EventEmitter<any>();

  skipAnimation: boolean;

  get isOwnPost() { return this.comment.poster === this.sharedService.currentUser.personNumber; }

  constructor(
    private sharedService: SharedService,
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
