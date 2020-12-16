import { ChangeDetectorRef, Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(private cdr: ChangeDetectorRef) { 
    this.selectedChat = '';
  }

  // @HostListener('window:keydown', ['$event'])
  // handleKeyDown(event) {
  //   console.log(event)
  // }

  onFilesDropped(event) {
    console.log(event)
  }

  isChatOpen: boolean = false;
  selectedChat:any;
  chat: any = {
      status: 'info',
      title: `Чат з `,
      messages: [
        {
          text: 'Test text def',
          date: new Date(),
          reply: true,
          user: {
            name: `${localStorage.getItem('fio')}`,
          },
        },
      ],
      size: 'small',
    };

  messages: any[];
  role: any;
  testObj: any;
  isVisibleSmallButtons: boolean = false;
  isVisibleButton1: boolean = false;
  isVisibleButton2: boolean = false;
  buttonsRole: Array<any> = new Array<any>();
  

  ngOnInit(): void {
    this.role = localStorage.getItem('role');
    switch(this.role) {
      case 'cardholder':
        this.testObj = {
          merchId: '12345678',
          cbId: null,
          cardholderId: null
         }
        break;
      case 'chargeback_officer':
        this.testObj = {
          merchId: '12345678',
          cbId: null,
          cardholderId: '1235213'
         }
        break;
      case 'merchant':
        this.testObj = {
          merchId: null,
          cbId: '1235213',
          cardholderId: '12345678'
         }
        break;
      default:
        this.testObj = {
          merchId: null,
          cbId: null,
          cardholderId: null
         }
        break;
    }
    this.setVisibilityChatButtons();
    console.log(this.role)
  }

  setVisibilityChatButtons() {
    if(this.testObj.merchId) {
      this.buttonsRole.push({merchId: this.testObj.merchId, name: 'Merchant'});
      if(this.isVisibleButton1) {
        this.isVisibleButton2 = true;
      } else {
        this.isVisibleButton1 = true;
      }
    }
    if(this.testObj.cbId) {
      this.buttonsRole.push({cbId: this.testObj.cbId, name: 'Chargeback officer'})
      if(this.isVisibleButton1) {
        this.isVisibleButton2 = true;
      } else {
        this.isVisibleButton1 = true;
      }
    }
    if(this.testObj.cardholderId) {
      this.buttonsRole.push({cardholderId: this.testObj.cardholderId, name: 'Cardholder'})
      if(this.isVisibleButton1) {
        this.isVisibleButton2 = true;
      } else {
        this.isVisibleButton1 = true;
      }
    }
  }

  openChatDelay(selectedChat:any) {
    this.selectedChat = selectedChat;
    this.chat.title = `Чат з ${this.selectedChat.name}`;
    this.isChatOpen = true;
  }

  openChatMain() {
    if(!this.isVisibleSmallButtons) {
      if(this.isVisibleButton2) {
        this.isVisibleSmallButtons = true;
        //this.selectedChat = selectedChat;
      } else {
        //this.isVisibleButton1 = false;
        // this.isChatOpen = true;
        //this.selectedChat = this.buttonsRole[0];
        this.isVisibleSmallButtons = false;
        this.openChatDelay(this.buttonsRole[0]);
      }
    } else {
      this.isVisibleSmallButtons = false;
    }
    this.cdr.detectChanges();
    //this.isChatOpen = true;
  }

  closeChat() {
    this.isVisibleSmallButtons = false;
    this.isChatOpen = false;
  }

  sendMessage(messages, event) {
    const files = !event.files ? [] : event.files.map((file) => {
      return {
        url: file.src,
        type: file.type,
        icon: 'file-text-outline',
      };
    });
    console.log(event)
    console.log(files)
    messages.push({
      text: event.message,
      date: new Date(),
      files: files,
      type: files.length ? 'file' : 'text',
      reply: true,
      user: {
        name: `${localStorage.getItem('fio')}`,
      },
    });
  }

}
