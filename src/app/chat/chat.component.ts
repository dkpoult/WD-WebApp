import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { switchMap, startWith } from 'rxjs/operators';
import { SocketService } from '../shared/socket.service';
import { isNullOrUndefined } from 'util';
import { interval, Subscription, Subject } from 'rxjs';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  @ViewChild('autoscroll') autoscroll: any;
  @ViewChild('switchButton') switchButton: any;

  unansweredSurvey = false;
  private _survey;
  get survey() { return this._survey; }
  set survey(value) { this.surveySubject.next(value); this._survey = value; }
  private surveySubject = new Subject<any>();
  survey$ = this.surveySubject.asObservable();

  get currentUser() { return this.sharedService.currentUser; }

  currentTabIndex = 0;

  pollingInterval = 2000;
  pollingData: Subscription;

  tutorMode = false;

  messages: Array<any>;
  unreadMessages = 0;
  course: any;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    // TODO: Fetch previous messages
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
              // console.log(this.autoscroll);
              // this.autoscroll.nativeElement.scrollIntoView(false);
              this.messages.push(message);
              break;
            case 'LIVE_QUESTION':
              break;
            case 'LIVE_QUESTION_VOTE':
              break;
          }
        });
        if (this.isModerator()) {
          this.socketService.subscribeToCourse(result, true).subscribe((message: any) => {
            console.log(message);
          });
        }
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
    let message = input.value;
    message = message.trim();
    if (message.length === 0) {
      return;
    }
    this.socketService.sendMessage(message, this.tutorMode);
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
    if (!isNullOrUndefined(this.survey) && this.isModerator() && this.survey.responseType === 'MC') {
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
    // bop it
  }

  // send delete message to everyone
  deleteMessage(id: number) {
    this.socketService.deleteMessage(id); // delete it (outgoing only)
  }

  isModerator(): boolean {
    if (!isNullOrUndefined(this.course) && this.course.lecturer.personNumber === this.sharedService.currentUser.personNumber) {
      return true;
    }
    // ? More logic
    return false;
  }

  switchMode() {
    this.tutorMode = !this.tutorMode;
    // Animate the button
    this.switchButton._elementRef.nativeElement.classList.add('animate');
    setTimeout(() => {
      this.switchButton._elementRef.nativeElement.classList.remove('animate');
    }, 300);
  }

}
