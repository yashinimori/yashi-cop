import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { extend, addClass } from '@syncfusion/ej2-base';
import { KanbanComponent, ColumnsModel, CardSettingsModel, SwimlaneSettingsModel, DialogSettingsModel, CardRenderedEventArgs } from '@syncfusion/ej2-angular-kanban';
import { cardData } from './data';
import { Subscription } from 'rxjs';
import { HttpService } from '../../../share/services/http.service';
import { ErrorService } from '../../../share/services/error.service';
import { NbWindowService, NbWindowState } from '@nebular/theme';

interface customColumn extends ColumnsModel {
    protectedColumn: boolean;
}

@Component({
  selector: 'ngx-chbo-tasks',
  templateUrl: './chbo-tasks.component.html',
  styleUrls: ['./chbo-tasks.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChboTasksComponent implements OnInit {
  constructor(private httpServise: HttpService, private windowService: NbWindowService, private errorService: ErrorService) {
        
  }

  @ViewChild('kanbanObj') kanbanObj: KanbanComponent;
  @ViewChild('settingsKanbanTemplate', { read: TemplateRef }) settingsKanbanTemplate: TemplateRef<HTMLElement>;

  public kanbanData: Object[];
 
  public columns: ColumnsModel[] = [
    { headerText: 'New', keyField: 'New', allowToggle: true, allowDrop: true, allowDrag: true },
    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, allowDrop: true, allowDrag: true },
    { headerText: 'CH Request', keyField: 'CHRequest', allowToggle: true, allowDrop: true, allowDrag: true },
    { headerText: 'Pending', keyField: 'Pending', allowToggle: true, allowDrop: true, allowDrag: true },
    { headerText: 'Settlement', keyField: 'Settlement', allowToggle: true, allowDrop: true, allowDrag: true },
    { headerText: 'Done', keyField: 'Done', allowToggle: true, allowDrop: false, allowDrag: true }
  ];

  public columnsProtected = ['New', 'In Progress', 'CH Request', 'Pending', 'Settlement', 'Done'];
  isCreatingNewColumn: boolean = false;
  createColumnName: any;
  createColumnKey: any;
  createColumnPosition: any;
  public cardSettings: CardSettingsModel = {
      headerField: 'Title',
      template: '#cardTemplate'
  };
  public dialogSettings: DialogSettingsModel = {
    fields: [
        { text: 'ID', key: 'Title', type: 'TextBox' },
        { key: 'Status', type: 'DropDown' },
        { key: 'Summary', type: 'TextArea' },
        { text: 'Currency', key: 'Tags', type: 'TextBox' },
        
    ]
  };

  claimsSubscription: Subscription = new Subscription();
  claimsData: any;
  
  openWindowWithoutBackdrop() {
    let w = this.windowService.open(
      this.settingsKanbanTemplate,
      { title: 'Columns settings', hasBackdrop: false, closeOnEsc: false, initialState: NbWindowState.MAXIMIZED },
    );

  }

    
  ngOnInit(): void {
    if(!localStorage.getItem('kanban')) {
      localStorage.setItem('kanban', '');
    }
    if(!localStorage.getItem('kanbanColumns')) {
      localStorage.setItem('kanbanColumns', JSON.stringify(this.columns));
    } else {
      this.columns = JSON.parse(localStorage.getItem('kanbanColumns'));
    }
    console.log('aaaaaa')
    this.getClaimsData();
    
  }

  getClaimsData() {
    this.claimsData = new Array<any>();
    let pageSize = 0;
    let pageNumber = 0;
    this.claimsSubscription = this.httpServise.getClaimList(pageSize, pageNumber).subscribe({
      next: (response: any) => {
        let data: any;

        if(pageSize > 0 && pageNumber > 0)
          data = response.results;
        else
          data = response;
    
        data.forEach(el => {
          this.createKanbanArr(el);
        });
      },
      error: error => {
        this.errorService.handleError(error);
        console.error('There was an error!', error);
      },
      complete: () => {
        this.kanbanData = extend([], this.claimsData, null, true) as Object[];
        console.log(this.kanbanData);
      }
    });
  }

  createKanbanArr(el:any) {
    let t = {};
    //@ts-ignore
    t.Id = el['id'];

    const dateObj = new Date(el.trans_date);
    const month = dateObj.getMonth();
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = day  + '.' + month  + '.' + year;
    //@ts-ignore
    t.Title = 'Case: ' + el['id'] + ';  ' + output;
    //@ts-ignore
    // t.Protected = this.columnsProtected.find(pr => pr == el.Title) == undefined;
    if(el.reason_code == null) {
      //@ts-ignore
      t.Summary = el['reason_code_group'];
    } else {
      //@ts-ignore
      t.Summary = el['reason_code'] + ' - ' + el['reason_code_group'];
    }
    
    //@ts-ignore
    t.Tags = el['trans_amount'] + ' ' + el.trans_currency;

    if(localStorage.getItem('kanban') && localStorage.getItem('kanban').length != 0) {
      let localKanban = JSON.parse(localStorage.getItem('kanban'));
      localKanban.forEach(k => {
        //@ts-ignore
        if(k.id == t.Id) {
          //@ts-ignore
          t.Status = k.status;
        }
      })
    } else {
      if(el.status.stage == 'pre_mediation' || el.status.stage == 'mediation') {
        //@ts-ignore
        t.Status = 'New';
      } else if(el.status.stage == 'closed') {
         //@ts-ignore
         t.Status = 'Done';
      } else {
        //@ts-ignore
        t.Status = 'InProgress';
     }
    }
    console.log(t);
    this.claimsData.push(t);
  }

  addNewColumn() {
    this.isCreatingNewColumn = true;
  }
  cancelCreateColumn() {
    this.createColumnName = '';
    this.createColumnKey = '';
    this.createColumnPosition = null;
    this.isCreatingNewColumn = false;
  }

  createColumn() {
    let text: string = this.createColumnName;
    let key: string = this.createColumnKey;
    let index: number = Number(this.createColumnPosition);
    if (this.kanbanObj.columns.length >= index && key && key.length > 0 && text && text.length > 0 && index !== null) {
        //this.columns.push({ keyField: key, protectedColumn: false, headerText: text, showItemCount: true, allowToggle: true, allowDrop: true, allowDrag: true });
        this.kanbanObj.addColumn({ keyField: key, headerText: text, allowToggle: true, allowDrop: true, allowDrag: true }, index);
        if(localStorage.getItem('kanbanColumns') && localStorage.getItem('kanbanColumns').length > 0) {
          let localKanbanColumns = JSON.parse(localStorage.getItem('kanbanColumns'));
          localKanbanColumns.splice(index, 0, { keyField: key, headerText: text, allowToggle: true, allowDrop: true, allowDrag: true });
          this.columns.splice(index, 0, { keyField: key, headerText: text, allowToggle: true, allowDrop: true, allowDrag: true });
          localStorage.setItem('kanbanColumns', JSON.stringify(localKanbanColumns));
        } 
        this.createColumnName = '';
        this.createColumnKey = '';
        this.createColumnPosition = null;
        this.isCreatingNewColumn = false;
    }
  }

  removeColumn(index) {
    // let index: number = this.deleteObj.value;
      if (this.kanbanObj.columns.length > 1) {
          if (this.kanbanObj.columns.length >= (index + 1) && index !== null) {
              this.kanbanObj.deleteColumn(index);
              if(localStorage.getItem('kanbanColumns') && localStorage.getItem('kanbanColumns').length > 0) {
                let localKanbanColumns = JSON.parse(localStorage.getItem('kanbanColumns'));
                localKanbanColumns.splice(index, 1);
                this.columns.splice(index, 1);
                localStorage.setItem('kanbanColumns', JSON.stringify(localKanbanColumns));
              }
          }
      }
  }

  cardRendered(args: CardRenderedEventArgs): void {
      const val: string = (<{[key: string]: Object}>(args.data)).Priority as string;
      let localKanban;
      if(localStorage.getItem('kanban') && localStorage.getItem('kanban').length > 0) {
        localKanban = JSON.parse(localStorage.getItem('kanban'));
        //@ts-ignore
        let identEl = localKanban.filter(item => item.id == args.data.Id);
        if(identEl.length > 0) {
          localKanban.splice(localKanban.indexOf(identEl[0]), 1);
        }
        //@ts-ignore
        localKanban.push({id:args.data.Id, status: args.data.Status}); 
      } else {
        //@ts-ignore
        localKanban = [{id:args.data.Id, status: args.data.Status}];
      }
      localStorage.setItem('kanban', JSON.stringify(localKanban));
  }

}
