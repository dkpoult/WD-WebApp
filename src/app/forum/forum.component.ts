import { SharedService } from './../shared/shared.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  course$: Observable<string>;
  course: string;

  gotPosts = false;
  posts: Array<any>;

  constructor(
    private sharedService: SharedService,
    private route: ActivatedRoute,
    private logger: NGXLogger
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

  vote(post: any, vote: number) {
    let vote$: Observable<any>;
    if (post.voted === vote) {
      vote$ = this.sharedService.vote(post, 0);
    } else {
      vote$ = this.sharedService.vote(post, vote);
    }
    vote$.subscribe((response: any) => {
      console.log(response);
      // ! Should probably only update the one post
      this.getPosts();
    });
  }

  getPosts() {
    const forum = this.course;
    this.sharedService.getPosts(forum).subscribe((response: any) => {
      if (response.responseCode.startsWith('failed')) {
        this.logger.error(response.responseCode);
        return;
      }
      this.gotPosts = true;
      this.posts = response.posts;
    });
  }

}
