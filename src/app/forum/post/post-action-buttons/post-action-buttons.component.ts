import { MatDialogRef, MatDialog } from '@angular/material';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { CreateCommentComponent } from '../create-comment/create-comment.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { trigger, style, transition, animate, keyframes, state } from '@angular/animations';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-post-action-buttons',
  templateUrl: './post-action-buttons.component.html',
  styleUrls: ['./post-action-buttons.component.scss'],
  animations: [
    trigger('fadeInOut', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', [animate('0.2s 0.2s ease-in')]),
      transition('* => void', [animate('0.2s ease-in')])
    ]),
    trigger(
      'bounce', [
        transition('none <=> upvoted, none <=> downvoted', [
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
export class PostActionButtonsComponent implements OnInit {
  @Input() post: any = {};
  @Output() changeVote = new EventEmitter<number>();

  createCommentDialogRef: MatDialogRef<CreateCommentComponent>;

  get score(): number { return this.post.upscore - this.post.downscore; }

  get upvoted() { return this.post.voted === 1; }
  get downvoted() { return this.post.voted === -1; }

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog
  ) { }

  ngOnInit() { }

  reply() {
    this.createCommentDialogRef = this.dialog.open(CreateCommentComponent, { data: this.post });
    this.createCommentDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        if (!isNullOrUndefined(this.post.comments)) {
          this.post.comments.push(result);
        }
      }
    });
  }

  vote(vote: number) {
    if (this.post.voted === vote) {
      vote = 0;
    }
    switch (vote) {
      case -1:
        if (this.post.voted === 1) {
          this.post.upscore--;
        }
        this.post.downscore++;
        break;
      case 1:
        if (this.post.voted === -1) {
          this.post.downscore--;
        }
        this.post.upscore++;
        break;
      case 0:
        if (this.post.voted === 1) {
          this.post.upscore--;
        } else if (this.post.voted === -1) {
          this.post.downscore--;
        }
    }
    this.post.voted = vote;
    this.changeVote.next(vote);
    this.sharedService.vote(this.post, vote).subscribe();
  }

  downvoteState(): string {
    if (this.post.voted === -1) { return 'downvoted'; }
    return 'none';
  }

  voteState(): string {
    switch (this.post.voted) {
      case -1:
        return 'downvoted';
      case 0:
        return 'none';
      case 1:
        return 'upvoted';
    }
  }

  upvoteState(): string {
    if (this.post.voted === 1) { return 'upvoted'; }
    return 'none';
  }
}
