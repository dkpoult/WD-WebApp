import { SharedService } from './shared.service';
import { Injectable } from '@angular/core';
import { User } from './user';
import { StompConfig } from '@stomp/stompjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  constructor() { }

  connect(url: string, user: User) {

    const stompConfig: StompConfig = {
      // Which server?
      url: `${url}/chatsocket`,

      // Headers
      // Typical keys: login, passcode, host
      headers: user,

      // How often to heartbeat?
      // Interval in milliseconds, set to 0 to disable
      heartbeat_in: 0, // Typical value 0 - disabled
      heartbeat_out: 20000, // Typical value 20000 - every 20 seconds

      // Wait in milliseconds before attempting auto reconnect
      // Set to 0 to disable
      // Typical value 5000 (5 seconds)
      reconnect_delay: 5000,

      // Will log diagnostics on console
      debug: true
    };
  }

  subscribeToCourse(courseCode: string) {

  }
}
