import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { TutorialsDialogComponent } from './tutorials-dialog/tutorials-dialog.component';

@Component({
  selector: 'ngx-tutorial-page',
  templateUrl: './tutorial-page.component.html',
  styleUrls: ['./tutorial-page.component.scss']
})
export class TutorialPageComponent implements OnInit {

  constructor(private http: HttpClient, private dialogService: NbDialogService) { }

  tutorialsArr: Array<any> = new Array<any>();
  isUiLoad:boolean = false;

  ngOnInit(): void {
    this.http.get('assets/tutorials.json').subscribe((data: Array<any>) => {
      this.tutorialsArr = data;
      this.isUiLoad = true;
      console.log(data);
   });
  }

  openDialog(title: string, content1: any, content2: any) {
    let arr = new Array<any>();
    arr.push(content1);
    arr.push(content2);
    this.dialogService.open(TutorialsDialogComponent, {
      context: {
        title: title,
        content: arr
      },
    });
  }

}
