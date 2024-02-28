import { Injectable } from '@angular/core';
import axios from 'axios';
import { Observable, catchError, from, of, tap } from 'rxjs';
import { covType } from 'src/assets/convType';
import { userType } from 'src/assets/usertype';

@Injectable({
  providedIn: 'root'
})

export class CoolServiceService {
  api = "http://localhost:8000";


  //afficher un user
  getUser(userid: string): Observable<userType> {
    return from(axios.get<userType>(`${this.api}/user/${userid}`).then((doc) => doc.data)).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
  }
  // Creer un User
  setUser(user:any):Observable<any>{
    return from(axios.post<any>(`${this.api}/user`, user).then((doc) => doc.data)).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
  }
  // get tout les User
  getAllUser():Observable<any[]>{
    return from(axios.get<any[]>(`${this.api}/users`).then((doc) => doc.data)).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
  }
  //recupere l'id du user
  getIduser(token: any): Observable<any> {
    return from(axios.get(`${this.api}/donnee/${token}`)).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
  }

  // modifi profi user
  UpdateUser(id:string, file:any):Observable<any>{
    return from(axios.post(`${this.api}/modifUser/${id}`, {photo:file})).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
  }
  //Creer une conversation
  setConversation(senderId:string, receverId:string):Observable<any>{
        return from(axios.post<any>(`${this.api}/conversation`, {senderId,receverId}).then((doc) => doc.data)).pipe(
          tap((res) => this.log(res)),
          catchError((err) => this.errorDefault(err, null))
        )
  }

  //afficher les conversations
  getConversation(id: string): Observable<covType[]> {
    return from(axios.get(`${this.api}/conversations/${id}`).then((doc) => doc.data.reverse())).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
  }

  //afficher une conversations
  getUneConversation(id: string): Observable<covType> {
    return from(axios.get<covType>(`${this.api}/conversation/${id}`).then((doc) => doc.data)).pipe(
      tap((res) => res),
      catchError((err) => this.errorDefault(err, null))
    )
  }
 //Supprimer une conversation
  DeleteConv(idConv:string):Observable<any>{
    return from(axios.put<any>(`${this.api}/deleteConversation/${idConv}`).then((doc) => doc.data)).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
}
  //afficher les messages
  getMessages(idConv: string): Observable<any[]> {
    return from(axios.get<any>(`${this.api}/messages/${idConv}`).then((doc) => doc.data)).pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
  }

  //envoyer un message
  sendMessage(conversationId: string, sender: string, text: string, photo:any): Observable<any> {
    return from(axios.post<any>(`${this.api}/message`, {conversationId, sender, text, photo}).then((doc) => doc.data))
    .pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
  }

  // get touts les messages du user
  getAllMessagesUser(idUser:string):Observable<any>{
     return from(axios.get<any>(`${this.api}/filterMessage/${idUser}`).then((doc) => doc.data))
     .pipe(
      tap((res) => res),
      catchError((err) => err)
     )
  }


   //pour la notification supprime tout les id message de cette conversation
   deleteAllMssgs(idConv:string, idmssg:string):Observable<any>{
    return from(axios.put<any>(`${this.api}/delAllMssg`,{idConv, idmssg}).then((doc) => doc.data))
    .pipe(
      tap((res) => this.log(res)),
      catchError((err) => this.errorDefault(err, null))
    )
   }
 
   //pour la recherche
   searchInArray(searchTerm: string, arrayToSearch: any[]): any[] {
   const keys:any[] = ["nom","prenom","email","tel"];
    if (!searchTerm || searchTerm.trim() === '') {
      // Si la recherche est vide, retourner le tableau complet
      return arrayToSearch;
    }
    searchTerm = searchTerm.toLowerCase();
    // Filtrer le tableau en fonction du terme de recherche
    return arrayToSearch.filter(item => {
      const itemValue = keys.find((key) =>  item[key]
        ?.toString().toLowerCase().includes(searchTerm)
      );

      return itemValue;
    });
  }

     //pour la recherche
     searchInArrayConv(searchTerm: string, arrayToSearch: any[],): any[] {
      const keys:any[] = ["nom","prenom","email","tel"];
       if (!searchTerm || searchTerm.trim() === '') {
         // Si la recherche est vide, retourner le tableau complet
         return arrayToSearch;
       }
      // const tabs = arrayToSearch.filter(item => item.members.find((key => key )))

       searchTerm = searchTerm.toLowerCase();
       // Filtrer le tableau en fonction du terme de recherche
       return arrayToSearch.filter(item => {
         const itemValue = keys.find((key) =>  item.members.find(elm => elm[key]
          ?.toString().toLowerCase().includes(searchTerm))
         );
   
         return itemValue;
       });
     }

   
  //function pour l'affichage au niveau du console
  private log(res: any) {
    return console.table(res);
  }

  private errorDefault(error: Error, errorValue: any) {
    console.error(error);
    return of(errorValue);
  }
}


