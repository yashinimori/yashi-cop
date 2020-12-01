import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RESET_PASSWORD_CONFIRM, URL_CREATE_TOKEN, URL_USER_INFO, URL_USER_ACTIVATED, URL_RESET_PASS} from '../urlConstants';

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
    return this.http.get(URL_USER_INFO, this.getHeaders());
  }

  private getHeaders() {
    let body = `JWT ${localStorage.getItem('token')}`;
    return {
      headers: new HttpHeaders({
        Authorization: body
      })
    };
  }

  private getTokenHeader() {
    return new HttpHeaders().set('Authorization', `JWT ${localStorage.getItem('token')}`)
  }

  sendResetPassword(email: string) {
    const data = {email: email};
    return this.http.post(URL_RESET_PASS, data);
  }

  setPassword(data: any) {
    return this.http.post(RESET_PASSWORD_CONFIRM, data);
  }

  userActivated(data: any){
    return this.http.post(URL_USER_ACTIVATED, data);
  }

}
