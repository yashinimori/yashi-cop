import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { extend } from '@syncfusion/ej2-base';
import { KanbanComponent, ColumnsModel, CardSettingsModel, DialogSettingsModel, CardRenderedEventArgs } from '@syncfusion/ej2-angular-kanban';
import { Subscription } from 'rxjs';
import { HttpService } from '../../../share/services/http.service';
import { ErrorService } from '../../../share/services/error.service';
import { NbWindowService, NbWindowState } from '@nebular/theme';
import { Query } from '@syncfusion/ej2-data';
import { Router } from '@angular/router';
import { TransferService } from '../../../share/services/transfer.service';
import { trigger, style, animate, transition } from '@angular/animations';

interface IKanbanCard {
  Title: string;
  Summary: string;
  Tags: string;
  Status: string;
  Id: any;
  Date: any;
}

@Component({
  selector: 'ngx-chbo-tasks',
  templateUrl: './chbo-tasks.component.html',
  styleUrls: ['./chbo-tasks.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger(
      'inOutAnimation', 
      [
        transition(
          ':enter', 
          [
            style({ width: 0, opacity: 0 }),
            animate('0.7s ease-out', 
                    style({ width: 450, opacity: 1 }))
          ]
        ),
        transition(
          ':leave', 
          [
            style({ width: 450, opacity: 1 }),
            animate('0.7s ease-in', 
                    style({ width: 0, opacity: 0 }))
          ]
        )
      ]
    )
  ]
})
export class ChboTasksComponent implements OnInit, OnDestroy {
  constructor(private httpServise: HttpService, private windowService: NbWindowService,
    private transferService: TransferService,
    private router: Router,
    private errorService: ErrorService) {
        
  }

  @ViewChild('kanbanObj') kanbanObj: KanbanComponent;
  @ViewChild('settingsKanbanTemplate', { read: TemplateRef }) settingsKanbanTemplate: TemplateRef<HTMLElement>;
  @ViewChild('dialogKanbanTemplate', { read: TemplateRef }) dialogKanbanTemplate: TemplateRef<HTMLElement>;

  public kanbanData: Object[];
 
  public columns: ColumnsModel[] = [
    { headerText: 'New', keyField: 'New', allowToggle: true, allowDrop: true, allowDrag: true, isExpanded: false },
    { headerText: 'In Progress', keyField: 'InProgress', allowToggle: true, allowDrop: true, allowDrag: true, isExpanded: false },
    { headerText: 'CH Request', keyField: 'CHRequest', allowToggle: true, allowDrop: true, allowDrag: true, isExpanded: false },
    { headerText: 'Pending', keyField: 'Pending', allowToggle: true, allowDrop: true, allowDrag: true, isExpanded: false },
    { headerText: 'Settlement', keyField: 'Settlement', allowToggle: true, allowDrop: true, allowDrag: true, isExpanded: false },
    { headerText: 'Done', keyField: 'Done', allowToggle: true, allowDrop: false, allowDrag: true, isExpanded: false }
  ];

  public columnsProtected = ['New', 'In Progress', 'CH Request', 'Pending', 'Settlement', 'Done'];

  columnsDescription = [{key: 'New', description: 'New cases'}, {key: 'InProgress', description: 'Cases In Progress'},
  {key: 'CHRequest', description: 'CH Request'},{key: 'Pending', description: 'Pending'},
  {key: 'Settlement', description: 'Settlement'},{key: 'Done', description: 'Done'}]
  isCreatingNewColumn: boolean = false;
  createColumnName: any;
  createColumnDescription: any;
  createColumnPosition: any = 1;

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

  isSettingsWindowOpen: boolean = false;

  claimsSubscription: Subscription = new Subscription();
  onCloseWindowSubscription: Subscription = new Subscription();
  claimsData: any;
  allClaims: any;
  settingsWindowRef: any;
  isGoToClaim = false;
  isFilterBlockOpen = false;
  isSearchBlockOpen = false;
  windowsDetailsArr: Array<any> = new Array<any>();
  filterDate: any;
  public emptyValue: boolean = true;
  filterQuery: Query = new Query();
  searchQuery: Query = new Query();
  
  openWindowWithoutBackdrop() {
    if(!this.isSettingsWindowOpen) {
      this.settingsWindowRef = this.windowService.open(
        this.settingsKanbanTemplate,
        { title: 'Columns settings', windowClass: 'customWindowDrag', hasBackdrop: false, closeOnEsc: false, initialState: NbWindowState.MAXIMIZED },
      );
      this.isSettingsWindowOpen = true;
      this.onCloseWindowSubscription = this.settingsWindowRef.onClose.subscribe(() => {this.isSettingsWindowOpen = false;});
    }
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
    if(!localStorage.getItem('columnsDescription')) {
      localStorage.setItem('columnsDescription', JSON.stringify(this.columnsDescription));
    } else {
      this.columnsDescription = JSON.parse(localStorage.getItem('columnsDescription'));
    }
    this.getClaimsData();
    
  }

  openOrCloseFilterBlock() {
    this.isFilterBlockOpen = !this.isFilterBlockOpen;
  }

  filterCards(period?: any): void {
    this.filterQuery = new Query();
    
    if(!period) {
      this.filterQuery = new Query()
       .where('Date', 'lessthanorequal', this.filterDate.end)
       .where('Date', 'greaterthanorequal', this.filterDate.start);
    } else {
      this.filterQuery = new Query()
       .where('Date', 'lessthanorequal', period.end)
       .where('Date', 'greaterthanorequal', period.start);
    }
    
    this.kanbanObj.query = this.filterQuery;
    console.log(this.kanbanObj.query)
  }

  filterMonth() {
    const start = new Date(new Date().getTime() - 2628000000);
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    this.filterDate = undefined;
    this.filterCards({start: start, end: end});
  }

  filterWeek() {
    const start = new Date(new Date().getTime() - 604800000);
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);
    this.filterDate = undefined;
    this.filterCards({start: start, end: end});
  }

  clearFilters() {
    this.kanbanObj.query = new Query();
    this.filterDate = undefined;
  }

  openOrCloseSearchBlock() {
    this.isSearchBlockOpen = !this.isSearchBlockOpen;
  }


  searchClick(e: KeyboardEvent): void {
    if (e.code === 'Tab' || e.code === 'Escape' || e.code === 'ShiftLeft' || (e.code === 'Backspace' && this.emptyValue)) {
        return;
    }
    console.log(this.filterQuery);
    const searchValue: string = (<HTMLInputElement>e.target).value;
    searchValue.length === 0 ? this.emptyValue = true : this.emptyValue = false;
    let searchQuery: Query = new Query();
    let generalQuery = new Query();
    if (searchValue !== '') {
        searchQuery = new Query().search(searchValue, ['Id', 'Summary'], 'contains', true);
        if(this.filterQuery) {
          searchQuery.queries.forEach(e => {
            generalQuery.queries.push(e);
          });
        } else {
          generalQuery = searchQuery;
        }
    } else {
      if(this.filterQuery) {
        generalQuery = this.filterQuery;
      } else {
        generalQuery = searchQuery;
      }
    }
    
    this.kanbanObj.query = generalQuery;
  }

  resetSearch(e) {
    console.log(e)
  }

  openOnDoubleClick(e) {
    e.cancel = true;
    let el = this.allClaims.find(i => i.id == e.data.Id);
    if((this.windowsDetailsArr.length == 0 || this.windowsDetailsArr.findIndex(ch => ch.id == e.data.Id) == -1) && this.windowsDetailsArr.length < 2) {
      let w = this.windowService.open(
        this.dialogKanbanTemplate,
        { title: `Case ${el.id}`, windowClass: 'customWindowDrag', hasBackdrop: false, context: el,
         closeOnEsc: false, initialState: NbWindowState.MAXIMIZED },
      );
      this.windowsDetailsArr.push({id: el.id, context: w});
      w.onClose.subscribe(() => {
        if(!this.isGoToClaim) {
          //@ts-ignore
          if(this.windowsDetailsArr.findIndex(e => e.id == w.config.context.id) != -1) {
            //@ts-ignore
            this.windowsDetailsArr.splice(this.windowsDetailsArr.findIndex(e => e.id == w.config.context.id), 1);
          }
        }
        
      });
    }
  }

  goToClaim(data) {
    this.isGoToClaim = true;
    if(this.isSettingsWindowOpen) {
      this.settingsWindowRef.close();
    }
    if(data.Id) {
      this.transferService.cOPClaimID.next(data.Id);
    } else {
      this.transferService.cOPClaimID.next(data.id);
      if(this.windowsDetailsArr.length > 0) {
        this.windowsDetailsArr.forEach(e => {
          e.context.close();
        })
      }
    }
    
    this.router.navigate(['cop', 'cabinet', 'single-claim']);
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

        this.allClaims = data;
    
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
      }
    });
  }

  OnActionComplete(e) {
    console.log(e)
    console.log(this.columns)
  }

  createKanbanArr(el:any) {
    let t: IKanbanCard = {} as IKanbanCard;
    // const dateObj = new Date(el.trans_date);
    // console.log(dateObj);
    // const month = dateObj.getMonth() + 1;
    // const day = String(dateObj.getDate()).padStart(2, '0');
    // const year = dateObj.getFullYear();
    // const output = day  + '.' + month  + '.' + year;
    const output = this.formatDate(el.trans_date);
    t.Id = el['id'];
    t.Title = 'Case ' + el['id'];
    t.Tags = el['trans_amount'] + ' ' + el.trans_currency + ',' + output;
    t.Date = new Date(el.trans_date);
  
    if(el.reason_code == null) {
      t.Summary = el['reason_code_group'];
    } else {
      t.Summary = el['reason_code'] + ' - ' + el['reason_code_group'];
    }

    if(localStorage.getItem('kanban') && localStorage.getItem('kanban').length != 0) {
      let localKanban = JSON.parse(localStorage.getItem('kanban'));
      localKanban.forEach(k => {
        if(k.id == t.Id) {
          t.Status = k.status;
          let col = this.columns.find(c => c.keyField == t.Status);
          col.isExpanded = true;
        }
      })
    } else {
      if(el.status.stage == 'pre_mediation' || el.status.stage == 'mediation') {
        t.Status = 'New';
      } else if(el.status.stage == 'closed') {
         t.Status = 'Done';
      } else {
        t.Status = 'InProgress';
     }
    }



    this.claimsData.push(t);
    //this.claimsData.push(t);
  }

  formatDate(date) {
    const dateObj = new Date(date);
    const month = dateObj.getMonth() + 1;
    const day = String(dateObj.getDate()).padStart(2, '0');
    const year = dateObj.getFullYear();
    const output = day  + '.' + month  + '.' + year;
    return output;
  }

  addNewColumn() {
    this.isCreatingNewColumn = true;
  }
  cancelCreateColumn() {
    this.createColumnName = '';
    this.createColumnDescription = '';
    this.createColumnPosition = 1;
    this.isCreatingNewColumn = false;
  }

  createColumn() {
    let text: string = this.createColumnName;
    let key: string = this.createColumnName.replace(/\s+/g, '_');
    let index: number = Number(this.createColumnPosition);
    if (this.kanbanObj.columns.length >= index && key && key.length > 0 && text && text.length > 0 && index !== null) {
        //this.columns.push({ keyField: key, protectedColumn: false, headerText: text, showItemCount: true, allowToggle: true, allowDrop: true, allowDrag: true });
        this.kanbanObj.addColumn({ keyField: key, headerText: text, allowToggle: true, allowDrop: true, allowDrag: true }, index);
        if(localStorage.getItem('kanbanColumns') && localStorage.getItem('kanbanColumns').length > 0) {
          let localKanbanColumns = JSON.parse(localStorage.getItem('kanbanColumns'));
          localKanbanColumns.splice(index, 0, { keyField: key, headerText: text, allowToggle: true, allowDrop: true, allowDrag: true, isExpanded: false });
          this.columns.splice(index, 0, { keyField: key, headerText: text, allowToggle: true, allowDrop: true, allowDrag: true, isExpanded: false });
          localStorage.setItem('kanbanColumns', JSON.stringify(localKanbanColumns));
          this.columnsDescription.splice(index, 0, {key: key, description: this.createColumnDescription});
          localStorage.setItem('columnsDescription', JSON.stringify(this.columnsDescription));
        } 
        this.cancelCreateColumn();
    }
  }

  removeColumn(index) {
    //@ts-ignore
    if(this.kanbanData.filter(e => e.Status == this.columns[index].keyField).length == 0) {
      if (this.kanbanObj.columns.length > 1) {
          if (this.kanbanObj.columns.length >= (index + 1) && index !== null) {
              this.kanbanObj.deleteColumn(index);
              if(localStorage.getItem('kanbanColumns') && localStorage.getItem('kanbanColumns').length > 0) {
                let localKanbanColumns = JSON.parse(localStorage.getItem('kanbanColumns'));
                localKanbanColumns.splice(index, 1);
                this.columns.splice(index, 1);
                this.columnsDescription.splice(index, 1);
                localStorage.setItem('columnsDescription', JSON.stringify(this.columnsDescription));
                localStorage.setItem('kanbanColumns', JSON.stringify(localKanbanColumns));
              }
          }
      }
    }
  }

  cardRendered(args: CardRenderedEventArgs): void {
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

  ngOnDestroy(): void {
    this.claimsSubscription.unsubscribe();
    this.onCloseWindowSubscription.unsubscribe();
  }

}
