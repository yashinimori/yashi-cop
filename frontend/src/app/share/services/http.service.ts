import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { URL_GET_CLAIM_LIST, 
  URL_GET_MERCHANTS, 
  URL_CREATE_CLAIM, 
  URL_GET_TRANSACTIONS_LIST,
  URL_UPLOAD_ATM_LOG,
  URL_CREATE_NEW_USER,
  URL_GET_TIMELINE_INFO,
  URL_UPDATE_CLAIM,
  URL_UPLOAD_CLAIM_DOC,
  URL_CLAIM,
  URL_CREATE_NEW_BANK_USER,
  URL_CREATE_NEW_MERCH_USER,
  URL_CREATE_NEW_BANK,
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

  // getTimelineInfo(id: any){
  //   console.log('commentsssssssssssss')
  //   console.log(URL_GET_TIMELINE_INFO + id + '/comments/')
  //   return this.http.post(URL_GET_TIMELINE_INFO + id + '/comments', this.getHeaders());
  // }

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
    return this.http.post(URL_CREATE_NEW_USER, user);
  }

  createNewBankUser(user: any){
    return this.http.post(URL_CREATE_NEW_BANK_USER, user);
  }


  createNewBank(user: any){
    return this.http.post(URL_CREATE_NEW_BANK, user);
  }

  createNewMerchUser(user: any){
    return this.http.post(URL_CREATE_NEW_MERCH_USER, user);
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

  uploadClaimDoc(file: any, type_: any, claimId: any, userId: any, form_name: any) {
    const formData: FormData = new FormData();
    formData.append('file', file, file.name);
    formData.append('description', "");
    formData.append('type', type_);
    formData.append('claim', claimId);
    formData.append('user', userId);
    formData.append('form_name', form_name);

    return this.http.post(URL_UPLOAD_CLAIM_DOC, formData, this.getHeaders());
  }

  updateClaim(claim: any) {
    return this.http.put(URL_UPDATE_CLAIM + claim.claimId + '/', claim, this.getHeaders());
  }

  commentClaim(claimId: any, comment: any, form_name:any) {
    let data = {
      "text": comment,
      "form_name": form_name
    };
    return this.http.post(URL_CLAIM + claimId + '/comments/', data, this.getHeaders());
  }

}
