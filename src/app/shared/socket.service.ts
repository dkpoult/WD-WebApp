import { StompRService, StompConfig, StompState } from '@stomp/ng2-stompjs';
import { Injectable } from '@angular/core';
import { User } from './user';
import { Observable, Subscription } from 'rxjs';
import { Message, StompHeaders } from '@stomp/stompjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  courseCode: string;
  user: User;

  stomp$: Observable<Message>;
  stompSubscription: Subscription;

  constructor(private stompService: StompRService) { }

  connect(apiRoot: string, user: User) {
    this.user = user;
    const stompConfig: StompConfig = {
      url: `${apiRoot}/chatsocket/websocket`,
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
    this.stompService.state.pipe(
      map((state: number) => StompState[state]))
      .subscribe((status: string) => {
        console.log(`Stomp connection status: ${status}`);
      });
    this.stompService.initAndConnect();
  }

  subscribeToCourse(courseCode: string): Observable<any> {
    if (this.stompSubscription && !this.stompSubscription.closed) {
      this.stompSubscription.unsubscribe();
    }
    this.courseCode = courseCode;
    this.stomp$ = this.stompService.subscribe(`/topic/${courseCode}`, {
      personNumber: this.user.personNumber,
      userToken: this.user.userToken
    });
    return this.stomp$.pipe(map((message: Message) => {
      return JSON.parse(message.body);
    }));
  }

  sendMessage(message: string) {
    this.stompService.publish(`/chat/${this.courseCode}/sendMessage`, JSON.stringify({ content: message, messageType: 'CHAT' }), {
      personNumber: this.user.personNumber,
      userToken: this.user.userToken
    });
  }

  deleteMessage(message: any) {
    this.stompService.publish(`/chat/${this.courseCode}/deleteMessage`, JSON.stringify({ content: message.id, messageType: 'DELETE' }), {
      personNumber: this.user.personNumber,
      userToken: this.user.userToken
    });
  }
}
