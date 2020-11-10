import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-tutorials-dialog',
  templateUrl: './tutorials-dialog.component.html',
  styleUrls: ['./tutorials-dialog.component.scss']
})
export class TutorialsDialogComponent implements OnInit {

  @Input() title: string;
  @Input() content: any;
  
  constructor(protected ref: NbDialogRef<TutorialsDialogComponent>) {}

  dismiss() {
    this.ref.close();
  }

  ngOnInit() {
    console.log(this.content);
  }

}
