import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_GET_CLAIM_LIST, URL_GET_MERCHANTS, URL_CREATE_CLAIM, URL_CREATE_NEW_USER } from '../urlConstants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  getClaimList(pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = `${URL_GET_CLAIM_LIST}/?page_size=${pageSize}&page=${pageNumber}`;
    if(search != undefined) {
      req = req + `&search=${search}`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}`;
    }
    console.log(req);
    return this.http.get(req, this.getHeaders());
  }

  getSingleClaim(id: any) {
    console.log(URL_GET_CLAIM_LIST + '/' + id);
    return this.http.get(URL_GET_CLAIM_LIST + '/' + id, this.getHeaders());
  }

  createNewClaim(claim: any) {
    return this.http.post(URL_CREATE_CLAIM, claim, this.getHeaders());
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


  createNewUser(user: any){
    return this.http.post(URL_CREATE_NEW_USER, user, this.getHeaders());
  }
}
