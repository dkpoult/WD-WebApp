import { MatDialogRef, MatDialog } from '@angular/material';
import { Component, OnInit, Input } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { CreateCommentComponent } from '../create-comment/create-comment.component';

@Component({
  selector: 'app-post-action-buttons',
  templateUrl: './post-action-buttons.component.html',
  styleUrls: ['./post-action-buttons.component.scss']
})
export class PostActionButtonsComponent implements OnInit {
  @Input() post: any;

  createCommentDialogRef: MatDialogRef<CreateCommentComponent>;

  constructor(
    private sharedService: SharedService,
    private dialog: MatDialog
  ) { }

  ngOnInit() {

  }

  reply() {
    this.createCommentDialogRef = this.dialog.open(CreateCommentComponent, { data: this.post });
    this.createCommentDialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.post.comments.push(result);
      }
    });
  }

  vote(vote: number) {
    if (this.post.voted === vote) {
      vote = 0;
    }
    this.sharedService.vote(this.post, vote).subscribe((response: any) => {
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
    });
  }
}
