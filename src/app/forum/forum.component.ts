import {SharedService} from '../shared/services/shared.service';
import {ActivatedRoute, ParamMap} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import {switchMap} from 'rxjs/operators';
import {MatDialog, MatDialogRef} from '@angular/material';
import {CreatePostComponent} from '../forum/post/create-post/create-post.component';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  createPostDialogRef: MatDialogRef<CreatePostComponent>;

  course: string;

  gotPosts = false;
  posts: any[];

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
  }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
      this.course = result;
      this.getPosts();
    });
  }

  getPosts() {
    this.sharedService.getPosts(this.course).subscribe((response: any) => {
      if (response.responseCode.startsWith('failed')) {
        console.log(response);
        return;
      }
      this.gotPosts = true;
      this.posts = response.posts;
    });
  }

  openCreatePostDialog() {
    this.createPostDialogRef = this.dialog.open(CreatePostComponent, {data: this.course});
    this.createPostDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getPosts();
      }
    });
  }
}
