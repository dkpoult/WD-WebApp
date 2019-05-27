import { SurveyService } from '../shared/survey.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { switchMap, startWith } from 'rxjs/operators';
import { SocketService } from '../shared/socket.service';
import { isNullOrUndefined } from 'util';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  unansweredSurvey = true;
  survey: any;

  currentTabIndex = 0;

  pollingInterval = 5000;
  pollingData: Subscription;

  messages: Array<any>;
  unreadMessages = 0;
  course: any;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private socketService: SocketService,
    private surveyService: SurveyService
  ) { }

  ngOnInit() {
    this.messages = [];
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
        this.sharedService.getCourse(result).subscribe((response: any) => {
          this.course = response.course;
        });
        this.sharedService.getSurvey(result).subscribe((response: any) => {
          this.survey = response.survey;
          // this.unansweredSurvey = !this.survey.answered;
        });
        this.socketService.subscribeToCourse(result).subscribe((message: any) => {
          console.log('Received', message);
          switch (message.messageType) {
            case 'DELETE':
              this.removeMessage(parseInt(message.content, 10));
              break;
            case 'SURVEY':
              this.handleSurvey(message);
              break;
            case 'CHAT':
              if (this.currentTabIndex !== 0) {
                this.unreadMessages++;
              }
              this.messages.push(message);
              break;
          }
        });
      });
  }

  tabChange(event) {
    this.currentTabIndex = event.index;

    if (this.pollingData) {
      this.pollingData.unsubscribe();
    }

    switch (event.index) {
      case 0:
        this.unreadMessages = 0;
        break;
      case 1:
        this.getSurvey();
        this.unansweredSurvey = false; // ! For now unanswered == unread
        break;
    }
  }

  sendMessage(input: HTMLTextAreaElement, event?) {
    if (event) {
      event.preventDefault();
    }
    const message = input.value;
    message.replace(/$(\s)*/, '');
    if (message.length === 0) {
      return;
    }
    this.socketService.sendMessage(message);
    input.value = '';
  }

  handleSurvey(message: any) {
    if (message.content.endsWith('opened')) {
      this.getSurvey();
      if (!this.isModerator()) {
        this.unansweredSurvey = true;
      }
    } else {
      this.survey = null;
      this.unansweredSurvey = false;
    }
  }

  getSurvey() {
    if (!this.survey) {
      return;
    }
    if (this.isModerator() && this.survey.responseType === 'MC') {
      // poll
      this.pollingData = interval(this.pollingInterval)
        .pipe(startWith(0),
          switchMap(() => this.sharedService.getSurvey(this.course.courseCode, true))
        ).subscribe((result: any) => {
          this.survey = result.survey;
        });
    } else {
      // Just once off
      this.sharedService.getSurvey(this.course.courseCode, this.isModerator()).subscribe((result: any) => {
        this.survey = result.survey;
      });
    }
  }

  // remove it from our list of messages (incoming only)
  removeMessage(id: number) {
    // find it
    const i = this.messages.findIndex((value) => value.id === id);
    // remove it
    this.messages = this.messages.filter((value, index) => index !== i);
    // flick it
    // bop it
  }

  // send delete message to everyone
  deleteMessage(id: number) {
    this.socketService.deleteMessage(id); // delete it (outgoing only)
  }

  getMessageColor(message: any) {
    if (message.personNumber === this.sharedService.currentUser.personNumber) {
      return '#84b3ff'; // TODO: Make these use theme colors
    } else {
      return '#d1ba57';
    }
  }

  isModerator(): boolean {
    if (!isNullOrUndefined(this.course) && this.course.lecturer.personNumber === this.sharedService.currentUser.personNumber) {
      return true;
    }
    // ? More logic
    return false;
  }

}
