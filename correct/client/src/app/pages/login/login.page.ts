import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/servicesLogin/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  message: string;
  email: string;
  password: string;
  authservice: AuthService;
  isTypePassword: boolean = true;
  form: FormGroup;

  constructor(
    private auth: AuthService,
    private route: Router
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.authservice = this.auth;
  }
  //pour gere les erreur du formulaire
  initForm() {
    this.form = new FormGroup({
      email: new FormControl('',
        { validators: [Validators.required, Validators.email] }
      ),
      password: new FormControl('',
        { validators: [Validators.required, Validators.minLength(8)] }
      ),
    });
  }

  onChange() {
    this.isTypePassword = !this.isTypePassword;
  }

  login() {
    console.log(this.email);
    this.message = "Tentative de connextion en cours...";
    this.authservice.connection(this.email, this.password)
      .subscribe((doc) => {
        console.log(doc);
        if (doc.token) {
          localStorage.setItem("token", doc.token);
          this.message = "vous etes connecter";
          this.route.navigate(["messenger"]);
          const url:any=`/messenger`;
          window.location = url;
          this.email = "";
          this.password = "";
        } else {
          this.message = doc.message;
          this.password = "";
          this.route.navigate(["login"]);
        }
      })
  }
  
  logout() {
    this.authservice.deconnection();
    this.message = 'Vous ete deconnecter';
  }

}
