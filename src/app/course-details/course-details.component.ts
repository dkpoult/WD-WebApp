import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.scss']
})
export class CourseDetailsComponent implements OnInit {

  course$: Observable<any>;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.course$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.get('code')
      ));
    this.course$.subscribe(response => console.log(response));
  }

}
