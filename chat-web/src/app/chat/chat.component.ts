import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { webSocket} from 'rxjs/webSocket';
import { MessagesService } from '../services/messages.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit  {
  @ViewChild('messageInput') messageInput: ElementRef;
  title = 'chat-web';

  subject = webSocket('ws://127.0.0.1:443');
  messages: string[] = [];

  constructor(private messagesService: MessagesService) {}

  ngOnInit() {

    this.messagesService.getMessages().subscribe( (res: any) => {
      this.updateMessages(res);
    });

    this.subject.subscribe({
            next: (msg: any) => this.updateMessages(msg),
            error: (err) => this.handleError(err)
        });
  }

  updateMessages(msg: string) {
    this.messages.push(...msg);
  }

  handleError(err: Error) {
    console.log(err);
  }


  sendMessage() {
    if (this.messageInput && this.messageInput.nativeElement.value ) {
      const message = this.messageInput.nativeElement.value;
      this.subject.next(message);
      this.messageInput.nativeElement.value = '';
    }
  }
}
