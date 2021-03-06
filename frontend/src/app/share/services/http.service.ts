import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import {
  URL_GET_CLAIM_LIST,
  URL_GET_MERCHANTS,
  URL_CREATE_CLAIM,
  URL_GET_TRANSACTIONS_LIST,
  URL_UPLOAD_ATM_LOG,
  URL_CREATE_NEW_USER,
  // URL_GET_TIMELINE_INFO,
  URL_UPDATE_CLAIM,
  URL_UPLOAD_CLAIM_DOC,
  URL_CLAIM,
  URL_CREATE_NEW_BANK,
  URL_BANK,
  URL_BANK_USERS,
  URL_RESET_PASS,
  URL_CLAIM_DOC,
  URL_GET_TIMELINE_INFO,
  URL_BANK_COUNT_UPDATED_CLAIMS,
  URL_BANK_COUNT_NEW_CLAIMS,
  URL_COUNT_UPDATED_CLAIMS,
  URL_COUNT_NEW_CLAIMS,
  URL_COUNT_CLAIMS_BY_STAGES,
  URL_COUNT_CLAIMS_BY_RC_GROUP,
  URL_COUNT_CLAIMS_BY_SUPPORT,
  URL_CREATE_NEW_ATM,
  URL_GET_ATMS,
  URL_GET_LOGGER,
  URL_USER_INFO,
  URL_SET_PASS,
  URL_GET_REASON_CODES,
  URL_CREATE_BIN,

} from '../urlConstants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(
    private http: HttpClient,
  ) {
  }

  createClaimMastercardApi(body:any) {
    return this.http.post('https://api.mastercard.com/mastercom/v6/transactions/search', {
      "acquirerRefNumber": "05436847276000293995738",
      "bankNetRefNumber": "U68FRGDFA",
      "primaryAccountNum": "5488888888887192",
      "transAmountFrom": "10000",
      "transAmountTo": "20050",
      "tranStartDate": "2017-10-01",
      "tranEndDate": "2017-10-02"
    }, {
      headers: new HttpHeaders({
        oauth_body_hash:"94cOcstEzvTvyBcNV94PCbo1b5IA35XgPf5dWR4OamU=",
        oauth_nonce:"32lqGrI0f0nQEW85",
        oauth_signature:"MhfaStcHU0vlIoeaBLuP14(...)qqd99lI56XuCk8RM5dDA%3D%3D",
        oauth_consumer_key:"9TioEULnU__3EhV2zYyz67Ji907I9j1umylVzVzc3a3766bd!a2c4fc23e3744a8a9e762bdb22b809190000000000000000",
        oauth_signature_method:"RSA-SHA256",
        oauth_timestamp:"1558370962",
        oauth_version:"1.0"
      })
      // headers: new HttpHeaders({
      //   Authorization: `
      //   OAuth 
      //   oauth_body_hash="94cOcstEzvTvyBcNV94PCbo1b5IA35XgPf5dWR4OamU=",
      //   oauth_nonce="32lqGrI0f0nQEW85",
      //   oauth_signature="MhfaStcHU0vlIoeaBLuP14(...)qqd99lI56XuCk8RM5dDA%3D%3D",
      //   oauth_consumer_key="9TioEULnU__3EhV2zYyz67Ji907I9j1umylVzVzc3a3766bd!a2c4fc23e3744a8a9e762bdb22b809190000000000000000",
      //   oauth_signature_method="RSA-SHA256",
      //   oauth_timestamp="1558370962",
      //   oauth_version="1.0"`
      // })
    });
  }

  getReasonCodes() {
    return this.http.get(`${URL_GET_REASON_CODES}?page_size=40`, this.getHeaders());
  }
 
  getUserInfo() {
    return this.http.get(URL_USER_INFO+'/', this.getHeaders());
  }
  updateUserInfo(data: any) {
    return this.http.put(`${URL_USER_INFO}/`, data, this.getHeaders());
  }
  updateUserPassword(newPassword: string, currentPassword: string) {
    const data = {
      new_password: newPassword,
      current_password: currentPassword
    }
    return this.http.post(`${URL_SET_PASS}`, data, this.getHeaders());
  }

  getClaimList(pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = '';

    if(pageSize > 0 && pageNumber > 0)
      req = `${URL_GET_CLAIM_LIST}/?page_size=${pageSize}&page=${pageNumber}`;
    else
      req = `${URL_GET_CLAIM_LIST}/?all`;

    if(search != undefined) {
      req = req + `&search=${search}/`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}/`;
    }
    // console.log(req)
    // console.log(req.lastIndexOf("all") == req.length - 3)
    // if(req.lastIndexOf("all") == req.length - 3) {
    //   req = req + '/';
    // }
    // if(search == undefined && ordering == undefined) {
    //   req = req + '/';
    // }
    return this.http.get(req, this.getHeaders());
  }

  getSingleClaim(id: any) {
    return this.http.get(URL_GET_CLAIM_LIST + '/' + id+ '/', this.getHeaders());
  }

  getTimeLine(id: any){
    return this.http.get(URL_GET_TIMELINE_INFO + '/' + id + '/timeline/', this.getHeaders());
  }

  createNewClaim(claim: any) {
    return this.http.post(URL_CREATE_CLAIM, claim, this.getHeaders());
  }

  getMerchants() {
    return this.http.get(URL_GET_MERCHANTS+ '/', this.getHeaders());
  }

  getMerchantById(id:number) {
    return this.http.get(`${URL_GET_MERCHANTS}/${id}/`, this.getHeaders());
  }

  createMerchant(data: any) {
    return this.http.post(URL_CREATE_NEW_USER, data, this.getHeaders());
  }

  getMerchantsAll() {
    return this.http.get(URL_GET_MERCHANTS+'/?all', this.getHeaders());
  }

  private getHeaders() {
    let body = `JWT ${localStorage.getItem('token')}`;
    return {
      headers: new HttpHeaders({
        Authorization: body
      })
    };
  }

  private getHeadersCustom() {
    let body = `JWT ${localStorage.getItem('token')}`;
    return {
      headers: new HttpHeaders({
        'Authorization': body,
        'sec-fetch-user': localStorage.getItem('user_id')
      })
    };
  }

  


  createNewUser(user: any){
    return this.http.post(URL_CREATE_NEW_USER, user);
  }

  createNewBank(user: any){
    return this.http.post(URL_CREATE_NEW_BANK, user, this.getHeaders());
  }

  createNewUserBank(user: any){
    return this.http.post(URL_CREATE_NEW_USER, user, this.getHeadersCustom());
    //return this.http.post(URL_CREATE_NEW_USER, user, this.getHeaders());

  }

  createNewUserMerch(user: any){
    return this.http.post(URL_CREATE_NEW_USER, user, this.getHeaders());
  }

  getTransactionsList(pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = `${URL_GET_TRANSACTIONS_LIST}/?page_size=${pageSize}&page=${pageNumber}`;
    if(search != undefined) {
      req = req + `&search=${search}/`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}/`;
    }
    // if(search == undefined && ordering == undefined) {
    //   req = req + '/';
    // }
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
    // formData.append('user', userId);
    // formData.append('form_name', form_name);

    return this.http.post(URL_UPLOAD_CLAIM_DOC, formData, this.getHeaders());
  }

  updateClaim(claim: any) {
    return this.http.put(URL_UPDATE_CLAIM + claim.claimId + '/', claim, this.getHeaders());
  }

  commentClaim(claimId: any, comment: any, form_name:any) {
    comment = comment == undefined ? ' ': comment;
    let data = {
      "text": comment,
      "form_name": form_name
    };
    return this.http.post(URL_CLAIM + claimId + '/comments/', data, this.getHeaders());
  }

  getBankList(pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = '';

    if(pageSize > 0 && pageNumber > 0)
      req = `${URL_BANK}/?page_size=${pageSize}&page=${pageNumber}`;
    else
      req = `${URL_BANK}/?all`;

    if(search != undefined) {
      req = req + `&search=${search}`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}`;
    }
    // if(search == undefined && ordering == undefined) {
    //   req = req + '/';
    // }
    return this.http.get(req, this.getHeaders());
  }

  getBank(id: any) {
    return this.http.get(URL_BANK + '/' + id, this.getHeaders());
  }


  getAllBank() {
    return this.http.get(URL_BANK + '?all', this.getHeaders());
  }

  getBankUserById(id:number) {
    return this.http.get(`${URL_BANK_USERS}/${id}/`, this.getHeaders());
  }

  getBankUsersList(bankId: any, pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = '';

    // if(pageSize > 0 && pageNumber > 0)
    //   req = `${URL_BANK_USERS}/?page_size=${pageSize}&page=${pageNumber}`;
    // else
    //   req = `${URL_BANK_USERS}/?all`;

    req = `${URL_BANK_USERS}/?all&bank=${bankId}`;

    if(search != undefined) {
      req = req + `&search=${search}`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}`;
    }
    // if(search == undefined && ordering == undefined) {
    //   req = req + '/';
    // }
    return this.http.get(req, this.getHeaders());
  }

  getMerchList(bankId: any, pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = '';

    // if(pageSize > 0 && pageNumber > 0)
    //   req = `${URL_GET_MERCHANTS}/?page_size=${pageSize}&page=${pageNumber}`;
    // else
    //   req = `${URL_GET_MERCHANTS}/?all`;

    req = `${URL_GET_MERCHANTS}/?all&bank=${bankId}`;

    if(search != undefined) {
      req = req + `&search=${search}`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}`;
    }
    // if(search == undefined && ordering == undefined) {
    //   req = req + '/';
    // }
    return this.http.get(req, this.getHeaders());
  }

  getBankEmployees(userId: any){
    return this.http.get(URL_BANK_USERS+`/?all&user=${userId}`, this.getHeaders());
  }


  sendEmailResetPass(data: any){
    return this.http.post(URL_RESET_PASS, data, this.getHeaders());
  }

  getClaim(id: any) {
    return this.http.get(URL_CLAIM + id + '/', this.getHeaders());
  }

  getClaimDocs(id: any) {
    return this.http.get(URL_CLAIM_DOC + id + '/pdf/', this.getHeaders());
  }

  getBankCountUpdatedClaims(bankId: string) {
    let req = '';
    req = `${URL_BANK_COUNT_UPDATED_CLAIMS}${bankId}/stats/updated-claims/`;
    return this.http.get(req, this.getHeaders());
  }

  getBankCountNewClaims(bankId: string) {
    let req = '';
    req = `${URL_BANK_COUNT_NEW_CLAIMS}${bankId}/stats/`;
    return this.http.get(req, this.getHeaders());
  }

  getCountUpdatedClaims() {
    let req = '';
    req = `${URL_COUNT_UPDATED_CLAIMS}/`;
    return this.http.get(req, this.getHeaders());
  }

  getCountNewClaims() {
    let req = '';
    req = `${URL_COUNT_NEW_CLAIMS}/`;
    return this.http.get(req, this.getHeaders());
  }

  getCountClaimsByStages() {
    let req = '';
    req = `${URL_COUNT_CLAIMS_BY_STAGES}/`;
    return this.http.get(req, this.getHeaders());
  }


  getCountClaimsByRcGroup() {
    let req = '';
    req = `${URL_COUNT_CLAIMS_BY_RC_GROUP}`;
    return this.http.get(req, this.getHeaders());
  }


  getCountClaimsBySupport() {
    let req = '';
    req = `${URL_COUNT_CLAIMS_BY_SUPPORT}`;
    return this.http.get(req, this.getHeaders());
  }

  createNewATM(atm: any){
    return this.http.post(URL_CREATE_NEW_ATM, atm, this.getHeaders());
  }

  getAtmList(bankId: any, pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = '';

    // if(pageSize > 0 && pageNumber > 0)
    //   req = `${URL_GET_ATMS}/?page_size=${pageSize}&page=${pageNumber}`;
    // else
    //   req = `${URL_GET_ATMS}/?all`;

    req = `${URL_GET_ATMS}?all&bank=${bankId}`;

    if(search != undefined) {
      req = req + `&search=${search}`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}`;
    }
    // if(search == undefined && ordering == undefined) {
    //   req = req + '/';
    // }
    return this.http.get(req, this.getHeaders());
  }

  getAtm(id:number) {
    return this.http.get(`${URL_GET_ATMS}${id}/`, this.getHeaders());
  }

  getLoggerList(userId: any, pageSize: any, pageNumber:any, search?: any, ordering?: any) {
    let req = '';

    // if(pageSize > 0 && pageNumber > 0)
    //   req = `${URL_GET_LOGGER}/?page_size=${pageSize}&page=${pageNumber}`;
    // else
    //   req = `${URL_GET_LOGGER}/?all`;

    req = `${URL_GET_LOGGER}?all&user=${userId}`;

    if(search != undefined) {
      req = req + `&search=${search}`;
    }
    if(ordering != undefined) {
      req = req + `&ordering=${ordering}`;
    }
    // if(search == undefined && ordering == undefined) {
    //   req = req + '/';
    // }
    return this.http.get(req, this.getHeaders());
  }

  downloadDocument(url: string) {
    this.http.get(url, {responseType: 'blob', headers: new HttpHeaders({
        Authorization: `JWT ${localStorage.getItem('token')}`
      })}).subscribe(data => {
      const blob = new Blob([data], {type: 'application/pdf'});
      const downloadURL = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadURL;
      link.download = '??????????_??????????????????????.pdf';
      link.click();
    });
  }

  addNewBin(data) {
    return this.http.post(URL_CREATE_BIN, data, this.getHeaders());
  }
}
