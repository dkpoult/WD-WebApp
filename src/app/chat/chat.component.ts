import { PermissionService } from './../shared/permission.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit, ViewChild } from '@angular/core';
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

  pollingInterval = 5000;
  pollingData: Subscription;

  tutorMode = false;

  liveQuestions: Array<any>;
  messagesTutor: Array<any>;
  messagesStudent: Array<any>;
  unreadMessages = 0;
  course: any;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private socketService: SocketService,
    private permissionService: PermissionService
  ) { }

  ngOnInit() {
    this.messagesStudent = [];
    this.messagesTutor = [];
    this.liveQuestions = [];
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
        this.sharedService.getCourse(result).subscribe((response: any) => {
          this.course = response.course;
          // Can only do this after we have course
          if (this.isModerator()) {
            this.sharedService.getMessages(result, true).subscribe((res: any) => {
              switch (res.responseCode) {
                case 'successful':
                  const temp = res.messages.reverse();
                  temp.forEach(message => {
                    this.handleMessage(message, true);
                  });
                  break;
              }
            });
            this.socketService.subscribeToCourse(result, true).subscribe((message: any) => {
              this.handleMessage(message, true);
            });
          }
        });
        this.sharedService.getSurvey(result).subscribe((response: any) => {
          this.survey = response.survey;
          // this.unansweredSurvey = !this.survey.answered; // ! David must add this to server
        });
        // Get previous messages
        this.sharedService.getMessages(result, false).subscribe((res: any) => {
          switch (res.responseCode) {
            case 'successful':
              const temp = res.messages.reverse();
              temp.forEach(message => {
                this.handleMessage(message, false);
              });
              break;
          }
        });
        this.socketService.subscribeToCourse(result).subscribe((message: any) => {
          this.handleMessage(message, false);
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

  handleMessage(message: any, tutorMode: boolean) {
    // this.autoscroll.nativeElement.scrollTop = this.autoscroll.nativeElement.scrollHeight;
    const array = tutorMode ? this.messagesTutor : this.messagesStudent;
    switch (message.messageType) {
      case 'DELETE':
        this.removeMessage(parseInt(message.content, 10), tutorMode);
        break;
      case 'SURVEY':
        console.log('Received survey:', message);
        this.handleSurvey(message);
        break;
      case 'CHAT':
        if (this.currentTabIndex !== 0) {
          this.unreadMessages++;
        }
        array.push(message);
        break;
      case 'LIVE_QUESTION':
        this.liveQuestions.push(message);
        break;
      case 'LIVE_QUESTION_VOTE':
        const data = message.content.split(' ');
        this.liveQuestions.find((value) => value.id === parseInt(data[0], 10)).score = parseInt(data[1], 10);
        break;
    }
  }

  askQuestion(question: string) {
    this.socketService.submitQuestion(question);
  }

  voteQuestion(id: number) {
    const question = this.liveQuestions.find((value) => value.id === id);
    const vote = (question.voted === 1) ? 0 : 1; // 0 if it was 1, 1 if it was 0
    question.voted = vote;
    const content = { id, vote };
    this.socketService.voteQuestion(content);
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

  // remove it from our local list of messages
  removeMessage(id: number, tutorMode: boolean) {
    if (tutorMode) {
      this.messagesTutor = this.messagesTutor.filter((value) => value.id !== id); // Will remove messages
    } else {
      this.messagesStudent = this.messagesStudent.filter((value) => value.id !== id);
    }
    this.liveQuestions = this.liveQuestions.filter((value) => value.id !== id); // Will remove questions
  }

  // send delete message to everyone
  deleteMessage(id: number) {
    this.socketService.deleteMessage(id, this.tutorMode); // delete it (outgoing only)
  }

  deleteQuestion(id: number) {
    this.removeMessage(id, false); // local  side
    this.deleteMessage(id); // server side
  }

  isModerator(): boolean {
    if (!isNullOrUndefined(this.course)) {
      return this.permissionService.hasPermission('MODERATE', this.course.permissions);
    }
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
