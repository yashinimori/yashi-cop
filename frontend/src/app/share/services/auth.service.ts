import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {RESET_PASSWORD_CONFIRM, URL_CREATE_TOKEN, URL_LOGIN, URL_USER_ACTIVATED} from '../urlConstants';

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

  private getTokenHeader() {
    return new HttpHeaders().set('Authorization', `JWT ${localStorage.getItem('token')}`)
  }

  setPassword(data: any) {
    return this.http.post(RESET_PASSWORD_CONFIRM, data, {
        headers: this.getTokenHeader()
      }
    );
  }

  userActivated(data: any){
    return this.http.post(URL_USER_ACTIVATED, data);
  }

}
