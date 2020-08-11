import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_CREATE_TOKEN, URL_LOGIN } from '../urlConstants';

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
    return this.http.get(URL_LOGIN);
  }

}
