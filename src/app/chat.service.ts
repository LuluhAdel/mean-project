//keep the socket.io connection logic
import { Injectable } from '@angular/core';
import * as io from 'socket.io-client'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  //create socket object
  socket:any;
  readonly uri: string = "http://localhost:3000";
  //create connection code within the constructor
  constructor() { 
    this.socket = io.connect(this.uri)
  }

  //listenmethod
  listen(eventName: string){
    return new Observable((subsecriber) => {
      this.socket.on(eventName, (data) => { //listen to the event, get the call back with data
        console.log('data got is',data)
      })
    });
  }
  
  joinRoom(data){
        this.socket.emit('join', data)
  }

  newUserJoined(){
     let observable = new Observable<{user:String, message: String}>(observer=>{
       this.socket.on('new user joined', (data)=>{
         console.log(data)
         observer.next(data);
       });
       return() => {this.socket.disconnect();}

     });

     return observable;
  }

  sendMessage(data){
    console.log("call join message")
    this.socket.emit('message', data)
  }

  newMessageRecieved(){
    let observable = new Observable<{user:String, message: String}>(observer=>{
      this.socket.on('new message', (data)=>{
        observer.next(data);
      });
      return() => {this.socket.disconnect();}

    });

    return observable;
  }



}