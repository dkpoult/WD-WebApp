import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SharedService } from '../../shared/shared.service';
import { switchMap } from 'rxjs/operators';

enum SortMode {
  New,
  Top,
}

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postCode: string;

  sortMode: SortMode = SortMode.Top;

  gotPost = false;
  post: any;

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('post')
      )).subscribe((result: any) => {
        this.postCode = result;
        this.getPost();
      });
  }

  getPost() {
    this.sharedService.getPost(this.postCode).subscribe((response: any) => {
      this.gotPost = true;
      this.post = response.post;
      this.sortComments(this.post);
    });
  }

  markNewAnswer(comment: any) {
    this.post.answer = comment;
  }

  isAnswer(comment: any) {
    if (!this.gotPost || !this.post.answer) {
      return false;
    }
    return this.post.answer.code === comment.code;
  }

  sortComments(post, reversing = false, sortMode = this.sortMode) {
    if (post.comments && post.comments.length > 1) {
      // Recursively call to sort children
      post.comments.forEach(comment => {
        this.sortComments(comment);
      });
      // Actually sort the comments
      switch (sortMode) {
        case SortMode.Top:
          post.comments.sort((a, b) => {
            const val = (b.upscore - b.downscore) - (a.upscore - a.downscore);
            return val * (reversing ? -1 : 1);
          });
          break;
        case SortMode.New:
          post.comments.sort((a, b) => {
            const bTime = new Date(b.time);
            const aTime = new Date(a.time);
            const val = bTime.valueOf() - aTime.valueOf();
            return val * (reversing ? -1 : 1);
          });
          break;
      }
      // Sticky the answer
      const sortedArr = post.comments.reduce((acc, element) => {
        if (this.isAnswer(element)) {
          return [element, ...acc];
        }
        return [...acc, element];
      }, []);
      post.comments = sortedArr;
    }
  }
}
