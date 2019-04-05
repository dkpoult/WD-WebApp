import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SharedService } from '../shared/shared.service';
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
  @Output() newAnswer = new EventEmitter<any>();

  constructor(
    private sharedService: SharedService,
  ) { }

  ngOnInit() {
  }

  markAsAnswer() {
    this.sharedService.markAsAnswer(this.postCode, this.comment.code)
      .subscribe((response: any) => {
        switch (response.responseCode) {
          case 'successful':
            this.isAnswer = true;
            this.newAnswer.emit(this.comment); // Only level 0 comment can be answer, so we don't worry about bubbling for now
            break;
          default:
            console.log(response);
            break;
        }
      });
  }
}
