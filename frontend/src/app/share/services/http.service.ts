import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { URL_GET_CLAIM_LIST, 
  URL_GET_MERCHANTS, 
  URL_CREATE_CLAIM, 
  URL_GET_TRANSACTIONS_LIST,
  URL_UPLOAD_ATM_LOG
} from '../urlConstants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) {
  }

  getClaimList(pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = '';

    if(pageSize > 0 && pageNumber > 0)
      req = `${URL_GET_CLAIM_LIST}/?page_size=${pageSize}&page=${pageNumber}`;
    else
      req = `${URL_GET_CLAIM_LIST}/?all`;

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

  getTransactionsList(pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = `${URL_GET_TRANSACTIONS_LIST}/?page_size=${pageSize}&page=${pageNumber}`;
    if(search != undefined) {
      req = req + `&search=${search}`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}`;
    }
    console.log(req);
    return this.http.get(req, this.getHeaders());
  }

   
  uploadATMlog(file: any) {
    const formData: FormData = new FormData();
    formData.append('log', file, file.name);
    return this.http.post(URL_UPLOAD_ATM_LOG, formData, this.getHeaders());
  }

}
