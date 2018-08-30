import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

//create a message service to notify the user/developer whether
//the calls went through or not

export class MessageService {
  constructor() { }
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
  }

  clear(){
    this.messages = [];
  }
}
