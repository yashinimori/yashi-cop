import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  private getHeaders() {
    return {
      headers: new HttpHeaders({
        Authorization: localStorage.getItem('token')
      })
    };
  }
}
