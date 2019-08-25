import { StompRService, StompConfig, StompState } from '@stomp/ng2-stompjs';
import { Injectable } from '@angular/core';
import { User } from './models';
import { Observable, Subscription } from 'rxjs';
import { Message, StompHeaders } from '@stomp/stompjs';
import { map } from 'rxjs/operators';
import { API } from './api';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  courseCode: string;
  user: User;

  stomp$: Observable<Message>;
  // stompSubscription: Subscription;

  constructor(private stompService: StompRService) { }

  connect(user: User) {
    this.user = user;
    const stompConfig: StompConfig = {
      url: `${API.wsRoot}/chatsocket/websocket`,
      headers: {
        personNumber: user.personNumber,
        userToken: user.userToken
      },
      heartbeat_in: 0, // Typical value 0 - disabled
      heartbeat_out: 20000, // Typical value 20000 - every 20 seconds
      reconnect_delay: 5000, // Typical value 5000 (5 seconds)
      // Will log diagnostics on console
      debug: false
    };
    this.stompService.config = stompConfig;
    this.stompService.initAndConnect();
  }

  subscribeToCourse(courseCode: string, tutor: boolean = false): Observable<any> {
    // if (this.stompSubscription && !this.stompSubscription.closed) {
    // this.stompSubscription.unsubscribe(); // ! what is this
    // }
    this.courseCode = courseCode;
    this.stomp$ = this.stompService.subscribe(`/topic/${courseCode}:${tutor ? 'tutor' : 'normal'}`, {
      personNumber: this.user.personNumber,
      userToken: this.user.userToken
    });
    return this.stomp$.pipe(map((message: Message) => {
      return JSON.parse(message.body);
    }));
  }

  submitQuestion(question: string) {
    this.stompService.publish(`/chat/${this.courseCode}:normal/sendMessage`,
      JSON.stringify({ content: `${question}`, messageType: 'LIVE_QUESTION' }), {
        personNumber: this.user.personNumber,
        userToken: this.user.userToken
      });
  }

  voteQuestion(vote: any) {
    this.stompService.publish(`/chat/${this.courseCode}:normal/sendMessage`,
      JSON.stringify({ content: `${vote.id} ${vote.vote}`, messageType: 'LIVE_QUESTION_VOTE' }), {
        personNumber: this.user.personNumber,
        userToken: this.user.userToken
      });
  }

  sendMessage(message: string, tutor: boolean = false) {
    this.stompService.publish(`/chat/${this.courseCode}:${tutor ? 'tutor' : 'normal'}/sendMessage`,
      JSON.stringify({ content: message, messageType: 'CHAT' }), {
        personNumber: this.user.personNumber,
        userToken: this.user.userToken
      });
  }

  deleteMessage(id: any, tutor: boolean = false) {
    this.stompService.publish(`/chat/${this.courseCode}:${tutor ? 'tutor' : 'normal'}/deleteMessage`,
      JSON.stringify({ content: id, messageType: 'DELETE' }), {
        personNumber: this.user.personNumber,
        userToken: this.user.userToken
      });
  }
}
