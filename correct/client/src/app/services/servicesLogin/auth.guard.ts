import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  token = localStorage.getItem("token");

  constructor(
    private autServie: AuthService,
    private route: Router
  ) { }
  //c'est un guard il gere la navigation si le token
  // n'existe pas il t redirige dans la page login
  canActivate(): boolean {
    if (this.token) {
      return true;
    }
    this.route.navigate(["/home"]);
    return false;
  }

}
