import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_CREATE_TOKEN, URL_LOGIN, URL_SET_PASS } from '../urlConstants';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) {
  }

  getToken(user: any) {
    return this.http.post(URL_CREATE_TOKEN, user);
  }

  login() {
    return this.http.get(URL_LOGIN, this.getHeaders());
  }

  
  private getHeaders() {
    let body = `JWT ${localStorage.getItem('token')}`;
    return {
      headers: new HttpHeaders({
        Authorization: body
      })
    };
  }


  setPassword(data: any ){
    return this.http.post(URL_SET_PASS, data);

  }



}
