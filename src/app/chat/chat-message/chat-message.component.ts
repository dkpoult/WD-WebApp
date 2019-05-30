import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.scss']
})
export class ChatMessageComponent implements OnInit {

  @Input() message;
  @Input() isModerator = false;
  @Input() outgoing = true;
  @Output() delete = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }

  deleteThis() {
    this.delete.emit();
  }

}
