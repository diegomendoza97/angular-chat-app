import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor( private httpClient: HttpClient) { }

  getMessages() {
    return this.httpClient.get('api/messages');
  }
}
