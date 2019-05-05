import { SurveyService } from '../shared/survey.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { switchMap } from 'rxjs/operators';
import { SocketService } from '../shared/socket.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  unansweredSurvey = true;
  survey: any;

  currentTabIndex = 0;

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
          this.unansweredSurvey = !this.survey.answered;
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
    switch (event.index) {
      case 0:
        this.unreadMessages = 0;
        break;
      case 1:
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
      this.sharedService.getSurvey(this.course.courseCode).subscribe((result: any) => {
        this.survey = result.survey;
      });
      if (this.course.lecturer.personNumber === this.sharedService.currentUser.personNumber) {
        this.unansweredSurvey = true;
      }
    } else {
      this.survey = null;
      this.unansweredSurvey = false;
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
