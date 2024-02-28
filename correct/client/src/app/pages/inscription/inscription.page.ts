import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AnimationController, IonCard } from '@ionic/angular';
import { CoolServiceService } from 'src/app/services/cool-service.service';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['./inscription.page.scss'],
})
export class InscriptionPage implements OnInit {

  inscForm: FormGroup;
  isTypePassword: boolean = true;
  message:string;
  partie1:boolean=true;
  partie2:boolean=false;
  partie3:boolean=false;
  nom:string;
  prenom:string;
  email:string;
  tel:number;
  bio:String;
  password:any;

  constructor( private coolService: CoolServiceService, private router:Router) {
    this.initForm();
  }

  ngOnInit() {

  }
  
  // pour la validation du form
  initForm() {
    this.inscForm = new FormGroup({
      nom: new FormControl('', 
        {validators: [Validators.required]}
      ),
      prenom: new FormControl('', 
        {validators: [Validators.required]}
      ),
      email: new FormControl('', 
        {validators: [Validators.required, Validators.email]}
      ),
      tel: new FormControl('', 
      {validators: [Validators.required, Validators.maxLength(9), Validators.minLength(9)]}
      ),
      bio: new FormControl('', 
      {validators: [Validators.required, Validators.maxLength(50)]}
      ),
      password: new FormControl('', 
        {validators: [Validators.required, Validators.minLength(8)]}
      ),
    });
  }
  //pour afficher et cacher les champs
  changeParti1(){
    if(this.nom && this.prenom && this.email){
      this.partie1=false;
      this.partie2=true;
    }else{
      this.message = "saisir les informations demander"
    }
  }
//Pour le mots de passe
  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }
//envoie du formulaire
  onSubmit() {
    if(this.inscForm.value){
      this.coolService.setUser(this.inscForm.value).subscribe(
        (doc)=>{
          this.message = doc.message;
          if(doc.token){
            localStorage.setItem("token", doc.token);
            this.router.navigate(["/messenger"]);
          }
        }
        )
      }
      if(!this.inscForm.valid) return;
    console.log(this.inscForm.value);
  }

}
