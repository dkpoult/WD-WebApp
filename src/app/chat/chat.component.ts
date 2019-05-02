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

  constructor(
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private socketService: SocketService
  ) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        params.getAll('code')
      )).subscribe((result: any) => {
        this.socketService.subscribeToCourse(result);
      });
  }
}
