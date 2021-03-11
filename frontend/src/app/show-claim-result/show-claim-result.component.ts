import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-show-claim-result',
  templateUrl: './show-claim-result.component.html',
  styleUrls: ['./show-claim-result.component.scss']
})
export class ShowClaimResultComponent implements OnInit {

  constructor() { }
  isResult: boolean = false;
  claimID: any;

  ngOnInit(): void {
  }

  sendRequest() {
    this.isResult = true;
  }
}
