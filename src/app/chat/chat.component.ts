import { ActivatedRoute, ParamMap } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { SharedService } from '../shared/shared.service';
import { switchMap } from 'rxjs/operators';
import { SocketService } from '../shared/socket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  messages: Array<any>;
  courseCode: string;

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.messages = [];
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
        this.courseCode = result;
        this.socketService.subscribeToCourse(result).subscribe((message: any) => {
          this.messages.push(message);
        });
      });
  }

  sendMessage(input: HTMLTextAreaElement) {
    const message = input.value;
    message.replace(/$(\s)*/, '');
    if (message.length === 0) {
      return;
    }
    this.socketService.sendMessage(message);
    input.value = '';
  }

  deleteMessage(i: number) {
    this.socketService.deleteMessage(this.messages[i]);
    this.messages = this.messages.filter((value, index) => {
      return index !== i;
    });
  }

  getMessageColor(message: any) {
    if (message.personNumber === this.sharedService.currentUser.personNumber) {
      return '#84b3ff';
    } else {
      return '#d1ba57';
    }
  }
}
