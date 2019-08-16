import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-live-questions',
  templateUrl: './live-questions.component.html',
  styleUrls: ['./live-questions.component.scss']
})
export class LiveQuestionsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('test');
  }

}
