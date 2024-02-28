import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { CoolServiceService } from 'src/app/services/cool-service.service';
import { AuthService } from 'src/app/services/servicesLogin/auth.service';
import { covType } from 'src/assets/convType';
import { userType } from 'src/assets/usertype';

@Component({
  selector: 'app-conversation',
  templateUrl: './conversation.component.html',
  styleUrls: ['./conversation.component.scss'],
})
export class ConversationComponent  implements OnInit {
  @Input() conversation:covType;
  @Input() userIdCon:string;
  @Input() socket:any;
  userc:userType[];
  lastMessage:any;
  longMessages:number;
  allMessge:any;
  tabmessg:any[];
  messages:any[];
  constructor(private router: Router, private coolService: CoolServiceService, private serviceAuth:AuthService) { }

  ngOnInit() {
    this.userc = this.conversation.members.filter((doc:any)=> doc._id !== this.userIdCon);
    this.coolService.getMessages(this.conversation._id).subscribe(
      (doc) => {
        this.messages = doc;
        this.lastMessage = this.messages[this.messages.length - 1];
      }
    )
    this.getAllmssgConv(this.conversation._id);
    if(this.serviceAuth.actif){
      this.getmssg();
    }
  }
  
   //redirection au chats
  getChat(item:string){
    //envoie du nombre de message
    this.socket.emit("sendNmbMssg", {
      number:this.longMessages,
      userId: this.userIdCon
    })

    this.longMessages = 0;
    this.allMessge.forEach((m:any) => {
      this.coolService.deleteAllMssgs(item, m._id);
    });  
    this.serviceAuth.actif=false;  
    this.router.navigate(["/chats", item]);
}

//temps reel notification
getmssg(){
  this.socket.on("getMessage", (data:any) => {
    console.log(data);
    console.log(data.senderId[0]);
   if(data.conid === this.conversation._id){
    if(data.senderId[0]._id !== this.userIdCon){
      this.messages.push({
        sender:data.senderId, 
        text:data.text,
        createdAt: Date.now(),
      });
      this.lastMessage = this.messages[this.messages.length - 1];
      this.longMessages+=1;
    }
   }
})
}
// get les messages et leur nombres
async getAllmssgConv(idcon:string){
  this.coolService.getUneConversation(idcon).subscribe(
    (doc)=>{
      this.allMessge = doc.messages.filter((doc:any)=> doc.sender[0] !== this.userIdCon);
      this.tabmessg = this.allMessge
      this.longMessages = this.tabmessg.length;
    }
  )
}
}
