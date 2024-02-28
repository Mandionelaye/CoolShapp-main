import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { CoolServiceService } from 'src/app/services/cool-service.service';
import {io} from "socket.io-client";
import { AnimationController, IonContent, LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/services/servicesLogin/auth.service';
import { FirstServiceService } from 'src/app/services/opperation/first-service.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.page.html',
  styleUrls: ['./chats.page.scss'],
})
export class ChatsPage implements OnInit {
  @ViewChild(IonContent) content: IonContent;

  socket:any;
  messages:any[];
  token = localStorage.getItem('token');
  name:string = "Sender";
  message:string;
  photo:any;
  isLoading = false;
  userId:string;
  senderId:Observable<any>;
  sender:any[];
  idConv:any;
  arrivalMessage:any;
  live:boolean=false;
  constructor(
    private coolService: CoolServiceService,
    private router: ActivatedRoute,
    private serviceAu:AuthService,
    private cdr:ChangeDetectorRef,
    private route:Router,
    private serviceOpp:FirstServiceService,
    private loadingCtrl: LoadingController
     ) {}

  ngOnInit() {
    this.getConversation();
    //recuperation de l'id du user
     this.soketconnection();
    this.getMessageTimRel();
    this.getIdUser();
    if(!this.messages){
      this.showLoading()
    }
  }

  ionViewDidEnter(){
    this.scroll();
  }
  ngAfterViewChecked() {
    this.scroll();
  }
  // loading page
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'loading...',
      duration: 2000,
    });

    loading.present();
  }
  
//sup en tmps reel des message quand il sort
 popConv(){
  this.serviceAu.actif=true;
  this.socket.emit("sendNmbMssg", {
    number:0,
    userId:this.userId
  })

  // pour quand il creer une nouvelle conversation et qu'il n'envie pas de message
    if(!this.messages.length){
      this.coolService.DeleteConv(this.idConv).subscribe(
        (doc)=>{ 
          console.log(doc);
        }
      );
    }
 }

//voire le profil de l'utilisateur en cour de conversation
getProfilPage(id:string){
    this.serviceOpp.iduser = id;
    this.serviceOpp.idConv = this.idConv;
    this.serviceOpp.numbreMssg=this.messages.length;
    this.route.navigate(['profil']);
}

//delete Les messges pour les notifications
dellAllMsgConv(id:string){
       this.coolService.deleteAllMssgs(this.idConv, id);
}

//scroll auto
scroll(){
      this.content.scrollToBottom(100);
  }
  // connection au server socket
  soketconnection(){
    if(this.serviceAu.socket){
      this.socket = this.serviceAu.socket;
    }else{
      this.socket = io("ws://localhost:8900");
      this.socket.connect();
    }
  }

   // get messages et le celui qui envoie
   getConversation(){
    this.idConv = this.router.snapshot.paramMap.get('id');

      this.coolService.getMessages(this.idConv).subscribe(
      (doc)=>{
        this.messages = doc;
      }
     );
    this.coolService.getUneConversation(this.idConv)
    .subscribe((doc)=>{
      this.sender = doc.members.filter((doc:any)=> doc._id !== this.userId);
      this.getUserLive(this.sender[0]._id);
      this.senderId = of(this.sender);

    } );
    
   }
   
   //get de l'ID du user 
   getIdUser(){
    if(this.token){
      this.coolService.getIduser(this.token)
      .subscribe((doc)=>{
        this.userId = doc.data.data.id;
      })
    }
   }

 //user en ligne
getUserLive(sendrid:string){  
  if(this.serviceAu.tab){
    const elm = this.serviceAu.tab.filter(doc => doc.userId === sendrid);
    console.log(elm);
       if(elm.length===0){
         this.live = false;
       }else{
         this.live = true;
       }
  }
    console.log(this.live); 
 }

   //get message en tmps reel
  getMessageTimRel(){
    this.socket.on("getMessage", (data:any) => {
      console.log(data);
      this.messages.push({
        _id:data._id,
        sender:data.senderId, 
        text:data.text,
        photo:data.photo,
        createdAt: Date.now(),
      });
     this.cdr.detectChanges();
     this.dellAllMsgConv(data._id);
      //  this.messages = [...this.messages,{
      //     sender:data.senderId, 
      //     text:data.text,
      //     createdAt: Date.now(),
      //   }]
    }
    )
   }
   
 

  //envoie du user
  sendMessage() {

    //send messages 
    if(!this.photo){
      this.coolService.sendMessage(this.idConv, this.userId, this.message, "").subscribe(
        (doc)=>{          
          //send messages en temps reel
          this.socket.emit("sendMessage", {
            _id:doc._id,
            text:doc.text,
            senderId : this.userId,
            receveurId : this.sender[0]._id,
            conid:this.idConv
          })
          this.messages.push(doc);
          this.cdr.detectChanges();
        }
        )
      }

      //envoie de photo 
      if(this.photo){
        this.coolService.sendMessage(this.idConv, this.userId, "", this.photo).subscribe(
          (doc)=>{        
            console.log(doc);
            //send messages en temps reel
            this.socket.emit("sendMessage", {
              _id:doc._id,
              text:null,
              photo:doc.photo,
              senderId : this.userId,
              receveurId : this.sender[0]._id,
              conid:this.idConv
            })
            this.messages.push(doc);
            this.cdr.detectChanges();
          }
          )
      }
      this.message = "",
      this.photo=null;
   }
   // fonction pour recuper la valeur de l'input et le passe au fonction de conversion
  async subimitModif(event: any): Promise<void> {
    const file = event.target.files[0];

    if (file) {
      try {
        const compressedImage = await this.serviceOpp.compressImage(file); // on passe la valeur au fonction de conversion avant le stokage
         this.photo = compressedImage;
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  }
   click(){
    const elm:any = document.querySelector("#loge");
    elm.click();
   }
}
