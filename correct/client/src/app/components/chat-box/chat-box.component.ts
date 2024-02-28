import { Component, Input, OnInit } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import {format} from 'timeago.js';

@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss'],
})
export class ChatBoxComponent  implements OnInit {

  @Input() chat:any;
  @Input() user_id:any;

  time:any;
  isModalOpen = false;
  photo:any;
  constructor(private animationCtrl: AnimationController) { }

  ngOnInit() {
    this.time = format(this.chat?.createdAt);
    
  }
 
 

  setOpen(isOpen: boolean, img:any) {
    this.photo = img;
    this.isModalOpen = isOpen;
  }
}
