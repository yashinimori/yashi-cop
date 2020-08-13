import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_GET_CLAIM_LIST, URL_GET_MERCHANTS } from '../urlConstants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  getClaimList() {
    return this.http.get(URL_GET_CLAIM_LIST, this.getHeaders());
  }

  getSingleClaim(id: any) {
    return this.http.get(URL_GET_CLAIM_LIST + '/' + id, this.getHeaders());
  }

  createNewClaim(claim: any) {
    return this.http.post(URL_GET_CLAIM_LIST, claim, this.getHeaders());
  }

  getMerchants() {
    return this.http.get(URL_GET_MERCHANTS, this.getHeaders());
  }
  

  private getHeaders() {
    let body = `JWT ${localStorage.getItem('token')}`;
    return {
      headers: new HttpHeaders({
        Authorization: body
      })
    };
  }
}
