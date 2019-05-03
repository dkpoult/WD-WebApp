import { ViewSurveyComponent } from './../view-survey/view-survey.component';
import { CreateSurveyComponent } from './../create-survey/create-survey.component';
import { SurveyService } from './survey.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { switchMap } from 'rxjs/operators';
import { SocketService } from '../shared/socket.service';
import { isNullOrUndefined } from 'util';
import { MatDialog, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  viewSurveyDialogRef: MatDialogRef<ViewSurveyComponent>;
  createSurveyDialogRef: MatDialogRef<CreateSurveyComponent>;

  messages: Array<any>;
  course: any;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private socketService: SocketService,
    private surveyService: SurveyService,
    private dialog: MatDialog
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
        this.socketService.subscribeToCourse(result).subscribe((message: any) => {
          console.log('Received', message);
          switch (message.messageType) {
            case 'DELETE':
              this.removeMessage(parseInt(message.content, 10));
              break;
            case 'SURVEY':
              this.addSurvey();
              break;
            case 'CHAT':
              this.messages.push(message);
              break;
          }
        });
      });
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

  addSurvey() {
    if (isNullOrUndefined(this.course)) {
      return;
    }
    this.sharedService.getSurvey(this.course.courseCode).subscribe((result: any) => {
      this.surveyService.surveys[this.course.courseCode] = result.survey;
      console.log(this.surveyService.surveys);
    });
  }

  sendDummySurvey() {
    if (isNullOrUndefined(this.course)) {
      return;
    }
    this.createSurveyDialogRef = this.dialog.open(CreateSurveyComponent, { data: this.course });
    this.createSurveyDialogRef.afterClosed().subscribe(survey => {
      this.sharedService.makeSurvey(this.course.courseCode, survey).subscribe(console.log);
    });
  }

  closeSurvey() {
    if (isNullOrUndefined(this.course) || !this.surveyService.surveyIsActive(this.course.courseCode)) {
      return;
    }
    this.sharedService.closeSurvey(this.course.courseCode).subscribe(console.log);
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
      return '#84b3ff';
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
