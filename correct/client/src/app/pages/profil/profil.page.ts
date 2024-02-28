import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { CoolServiceService } from 'src/app/services/cool-service.service';
import { FirstServiceService } from 'src/app/services/opperation/first-service.service';
import { AuthService } from 'src/app/services/servicesLogin/auth.service';
import { userType } from 'src/assets/usertype';

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {
  filtMessage:any;
  socket:any;
  allmssg:any;
  user:Observable<userType>;
  token = localStorage.getItem('token');
  userId:any;
  urlPhoto:any;
  userChat:any;
  numMssg:number;
  isModalOpen = false;

  constructor(
    private router: Router, 
    private coolService: CoolServiceService,
     private serviceAu:AuthService,
     private serviceOpp:FirstServiceService,
     private loadingCtrl: LoadingController
  ) { }

  ngOnInit() {
    this.socket = this.serviceAu.socket;
    if(this.token){
      this.coolService.getIduser(this.token)
      .subscribe((doc)=>{
        console.log(doc);
        this.userId = doc.data.data.id;
        //pour un autre user
        if(!this.serviceOpp.iduser){
          this.getUser(doc.data.data.id);
          this.getAllMessage(doc.data.data.id);
        }else{
          this.userChat=this.serviceOpp.iduser;
          this.numMssg = this.serviceOpp.numbreMssg | 0;
          this.getUser(this.serviceOpp.iduser);
          this.getAllMessage(this.serviceOpp.iduser);
        }
        console.log(this.serviceOpp.iduser);
      })
    }

    if(this.socket){
      this.getMessageTimRel();
      this.getNumberMessage();
    }
    if(!this.user){
      this.showLoading();
    }
  }

  // loading page
  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'loading...',
      duration: 1000,
    });

    loading.present();
  }

 //modall image profil
 
 setOpen(isOpen: boolean) {
  this.isModalOpen = isOpen;
}

  //pour l'autre user quand il sort
  outProfil(){
    this.serviceOpp.iduser="";
    this.serviceOpp.numbreMssg=0;
  }

   //get user
   getUser(id:string){
     this.user = this.coolService.getUser(id);
  }

  //getAllMessageUser
  getAllMessage(idUser:string){
    this.coolService.getAllMessagesUser(idUser).subscribe(
      (doc)=>{
        this.filtMessage = doc.length;
        console.log(this.filtMessage);
      }
    )
    }

  //message en tmps reel ajout de la notification
  getMessageTimRel(){
    this.socket.on("getMessage", (data:any) => {
      if(data.senderId[0]._id !== this.userId ){
        //pour ajouter le nombre de no
        if(this.serviceAu.actif){
          this.filtMessage+=1;
        }
      }
      } )
  }

  // suppresion d'une noticfication
  getNumberMessage(){
    this.socket.on("getNumberNotif", (data:any) => {
      if(data.userId === this.userId){
        this.filtMessage-=data.number;
      }
    }
    )
  }

  // fonction pour recuper la valeur de l'input et le passe au fonction de conversion
  async subimitModif(event: any): Promise<void> {
    const file = event.target.files[0];

    if (file) {
      try {
        const compressedImage = await this.serviceOpp.compressImage(file); // on passe la valeur au fonction de conversion avant le stokage
        this.urlPhoto = compressedImage;
        console.log(this.urlPhoto);
        this.coolService.UpdateUser(this.userId, compressedImage); 
      } catch (error) {
        console.error('Error compressing image:', error);
      }
    }
  }

  //fonction pour que quand l'utilisateur click sur l'icone sa declanche un even click pour l'input
  click(){
   const elm:any = document.querySelector("#loge");
   elm.click();
  }

  //suppresion d'une conversation
  suppConv(){
    if(this.serviceOpp.idConv){
      this.coolService.DeleteConv(this.serviceOpp.idConv);
      const url:any=`/messenger`;
      window.location = url;
    }
  }

  // deconnection du user
  logout(){
    localStorage.removeItem("token");
    this.router.navigate(["login"]);
  }
}
