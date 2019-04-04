import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { SharedService } from '../shared/shared.service';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  postCode: string;

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
    console.log(this.postCode);
    this.sharedService.getPost(this.postCode).subscribe((response: any) => {
      this.gotPost = true;
      this.post = response.post;
    });
  }

}
