import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, Subject, throwError  } from 'rxjs';

import { Plugins } from '@capacitor/core';
const { Storage } = Plugins;

const TOKEN_KEY = 'my-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  token = '';

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  async loadToken() {
    const token = await Storage.get({ key: TOKEN_KEY });
    if (token && token.value) {
      this.token = token.value;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { email, password }): Observable<any> {
    let user = [{
      "USUARIO": credentials.email,
      "CONTRASEÑA": credentials.password
    }]
    let headers = new HttpHeaders({
      'Content-type': 'application/json',
    });
  
    return this.http.post(`https://inaupi.dyndns.org:5001/Login`, user, { headers: headers }).pipe(
      map((data: any) => data),
      switchMap(token => {
        if (token["Error"] !== undefined){
          return throwError('Usuario no existe');
        }else{
          return from(Storage.set({ key: TOKEN_KEY, value: JSON.stringify(token) }));
        }
       /*  return from(Storage.set({ key: TOKEN_KEY, value: token.Token })); */
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    ) 
  }

  logout(): Promise<void> {
    this.isAuthenticated.next(false);
    return Storage.remove({ key: TOKEN_KEY });
  }
}