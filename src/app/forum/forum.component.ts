import { SharedService } from './../shared/shared.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material';
import { CreatePostComponent } from '../create-post/create-post.component';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  createPostDialogRef: MatDialogRef<CreatePostComponent>;

  course$: Observable<string>;
  course: string;

  gotPosts = false;
  posts: Array<any>;

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private logger: NGXLogger,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.course$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      ));
    this.course$.subscribe((result: any) => {
      this.course = result;
      this.getPosts();
    });
  }

  getPosts() {
    this.sharedService.getPosts(this.course).subscribe((response: any) => {
      if (response.responseCode.startsWith('failed')) {
        this.logger.error(response.responseCode);
        return;
      }
      this.gotPosts = true;
      this.posts = response.posts;
    });
  }

  openCreatePostDialog() {
    this.createPostDialogRef = this.dialog.open(CreatePostComponent, { data: this.course });
    this.createPostDialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.getPosts();
      }
    });
  }
}
