import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AnimationController, LoadingController, ModalController, PopoverController } from '@ionic/angular';
import { Observable, of } from 'rxjs';
import { CoolServiceService } from 'src/app/services/cool-service.service';
import { covType } from 'src/assets/convType';
import { userType } from 'src/assets/usertype';
import { AuthService } from 'src/app/services/servicesLogin/auth.service';
import { io } from 'socket.io-client';

@Component({
  selector: 'app-messenger',
  templateUrl: './messenger.page.html',
  styleUrls: ['./messenger.page.scss'],
})
export class MessengerPage implements OnInit {

  @ViewChild('modal') modal: ModalController;
  @ViewChild('popover') popover: PopoverController;
  @Input() sockets:any;
  userc:userType[];
  lastMessage:any;
  filtMessage:number;

  open_new_chat:boolean = false;
  token = localStorage.getItem('token');
  user:Observable<userType>;
  allmssg:any[];
  userId:string;
  chatConevers:Observable<covType[]>;
  socket:any;
  conv:any;
  userDefault= {id :1, name:"CoolShapp", photo:"../../../assets/image/logo1.png", date: new Date()};
  userAll:any[];
  query:any;
  queryConv:any;
  search:any[];
  newConV:covType;
  active:boolean=true;
  constructor(
    private router: Router, 
    private coolService: CoolServiceService,
     private animationCtrl: AnimationController,
     private serviceAu:AuthService,
     private loadingCtrl: LoadingController
     ) { }

  ngOnInit() {
    //connection server socket 
    this.socket = io("ws://localhost:8900");
    this.socket.connect();
    this.socket.on("getUsers", async(data:any[]) => {
      this.serviceAu.tab = data;
    })
    this.serviceAu.socket = this.socket;

    //recuperation de l'id du user
       if(this.token){
        this.coolService.getIduser(this.token)
        .subscribe((doc)=>{
          this.userId = doc.data.data.id;
          this.socket.emit("addUsernav", doc.data.data.id);
          this.socket.emit("addUser",doc.data.data.id);
          this.getConversation(doc.data.data.id);
          this.getUser(doc.data.data.id);
          this.getAllMessage(doc.data.data.id);
            this.getNumberMessage();
          this.getMessageTimRel();
        })
       }
      this.getAllUsers();
      if(!this.chatConevers){
        this.showLoading();
      }
  }
  // loading page
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'loading...',
      duration: 2000,
    });

    loading.present();
  }

 //prend la valeur a rechercher
  setQery(e){
    if(e.length > 2 || e.length === 0){
      this.query = e;
      this.search = this.coolService.searchInArray(this.query, this.userAll).slice(0,7);
    }
  }
 //prend la valeur a rechercher pour conversation
 setQeryConv(e){
  if(e.length > 2 || e.length === 0){
    this.queryConv = e;
    this.chatConevers = of(this.coolService.searchInArrayConv(this.queryConv, this.conv));
    console.log(this.coolService.searchInArrayConv(this.queryConv, this.conv));
  }
}
//get tous les user
  getAllUsers(){
    this.coolService.getAllUser().subscribe(
      (doc)=>{
         this.userAll = doc;
         console.log(this.query);
         this.search = this.coolService.searchInArray(this.query, this.userAll);
         console.log(this.search);
      }
    )
  }

  //affiche conversation
  getConversation(id:string){
    this.chatConevers = this.coolService.getConversation(id);
    this.chatConevers.subscribe((doc) =>{
      this.conv = doc;
      console.log(doc);
      this.chatConevers = of(this.coolService.searchInArrayConv(this.queryConv, this.conv));
    });
  }

 //creer une conversation 
 setConversation(receverId){
   this.coolService.setConversation(this.userId, receverId).subscribe(
    (doc)=>{
      this.newConV = doc;
      this.getChat(this.newConV._id);
    }
   )
 }

  //getAllMessageUser
 getAllMessage(idUser:string){
  this.coolService.getAllMessagesUser(idUser).subscribe(
   (doc)=>{
    this.allmssg = doc
     this.filtMessage = this.allmssg.length;
     console.log(this.filtMessage);
   }
  )
}

  //message en tmps reel
  getMessageTimRel(){
    this.socket.on("getMessage", (data:any) => {
      if(data.senderId[0]._id !== this.userId ){
        //pour ajouter le nombre de no
        if(this.serviceAu.actif){
          this.filtMessage+=1;
        }
      }
      this.coolService.getConversation(this.userId).subscribe(
       (doc1)=>{
          this.chatConevers.subscribe(
           (doc)=>{
             const elm = doc.filter(elm=> elm._id === data.conid);
             console.log(elm);
             if(!elm.length){
               doc.unshift(...doc1.filter(elm=> elm._id === data.conid));
             }
           }
          )
       }
      );
    }
    )
   }
   
    //numbre de message pour la suppresion au niveau des notifications
  getNumberMessage(){
    this.socket.on("getNumberNotif", (data:any) => {
      console.log(data);
      this.getConversation(this.userId);
      this.active=false;
      if(data.userId === this.userId){
        if(this.filtMessage !== 0){
          this.active = true;
          this.filtMessage-=data.number;
        }

      }
    }
    )
  }

  //get user
  getUser(id:string){
    this.user = this.coolService.getUser(id);
  }
  
   //le modale new conv
   enterAnimation = (baseEl: HTMLElement) => {
    const root = baseEl.shadowRoot;

    const backdropAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('ion-backdrop')!)
      .fromTo('opacity', '0.01', 'var(--backdrop-opacity)');

    const wrapperAnimation = this.animationCtrl
      .create()
      .addElement(root.querySelector('.modal-wrapper')!)
      .keyframes([
        { offset: 0, opacity: '0', transform: 'scale(0)' },
        { offset: 1, opacity: '0.99', transform: 'scale(1)' },
      ]);

    return this.animationCtrl
      .create()
      .addElement(baseEl)
      .easing('ease-out')
      .duration(500)
      .addAnimation([backdropAnimation, wrapperAnimation]);
  };

  leaveAnimation = (baseEl: HTMLElement) => {
    return this.enterAnimation(baseEl).direction('reverse');
  };

  //get Chat
  getChat(id:string){
    this.modal.dismiss();
    this.router.navigate(["/chats", id]);
   }

  logout(){
    this.popover.dismiss();
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
}
