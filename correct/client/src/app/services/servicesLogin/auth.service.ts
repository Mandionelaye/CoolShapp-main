import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, from, tap } from 'rxjs';
import { io } from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  connect: boolean;
  socket:any;
  tab:any[];
  actif:boolean=true;

  connection(email: string, password: string): Observable<any> {
    return from(axios.post<any>("http://localhost:8000/connection", { email, password }).then((doc) => doc.data)).pipe(
        tap((res) => {
          this.connect = res.bool;
        }
        )
      )
  }
  deconnection() {
    localStorage.removeItem("token");
  }
}
