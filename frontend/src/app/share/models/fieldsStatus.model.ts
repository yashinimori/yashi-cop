export class FieldsStatus {
    constructor(props?: Partial<FieldsStatus>) {
        if (props) {
            this.pan = props.pan || new paramStatusFields();
            this.transDate = props.transDate || new paramStatusFields();
            this.merchantID = props.pan || new paramStatusFields();
            this.terminalID = props.terminalID || new paramStatusFields();
            this.amount = props.amount || new paramStatusFields();
            this.currency = props.currency || new paramStatusFields();
            this.authCode = props.authCode || new paramStatusFields();
            this.comment = props.comment || new paramStatusFields();
            this.cOPClaimID = props.cOPClaimID || new paramStatusFields();
            this.merchantName = props.merchantName || new paramStatusFields();
            this.reasonCodeGroup = props.reasonCodeGroup || new paramStatusFields();
            this.stage = props.stage || new paramStatusFields();
            this.actionNeeded = props.actionNeeded || new paramStatusFields();
            this.result = props.result || new paramStatusFields();
            this.dueDate = props.dueDate || new paramStatusFields();
            this.currencyName = props.currencyName || new paramStatusFields();
            this.fio = props.fio || new paramStatusFields();
            this.rC = props.rC || new paramStatusFields();
            this.aRN = props.aRN || new paramStatusFields();
            this.docs =  props.docs || new paramStatusFields();

        } else {
            this.default();
        }
    }

    pan: paramStatusFields;
    transDate: paramStatusFields;
    merchantID: paramStatusFields;
    terminalID: paramStatusFields;
    amount: paramStatusFields;
    currency: paramStatusFields;
    authCode: paramStatusFields;
    comment: paramStatusFields;
    cOPClaimID: paramStatusFields;
    merchantName: paramStatusFields;
    reasonCodeGroup: paramStatusFields;
    stage: paramStatusFields;
    actionNeeded: paramStatusFields;
    result: paramStatusFields;
    dueDate: paramStatusFields;
    currencyName: paramStatusFields;
    fio: paramStatusFields;
    rC: paramStatusFields;
    aRN: paramStatusFields;
    docs: paramStatusFields;

    default() {
        this.pan = new paramStatusFields({invisible: true});
        this.transDate = new paramStatusFields({invisible: true});
        this.merchantID = new paramStatusFields({invisible: true});
        this.terminalID = new paramStatusFields({invisible: true});
        this.amount = new paramStatusFields({invisible: true});
        this.currency = new paramStatusFields({invisible: true});
        this.authCode = new paramStatusFields({invisible: true});
        this.comment = new paramStatusFields({invisible: true});
        this.cOPClaimID = new paramStatusFields({invisible: true});
        this.merchantName = new paramStatusFields({invisible: true});
        this.reasonCodeGroup = new paramStatusFields({invisible: true});
        this.stage = new paramStatusFields({invisible: true});
        this.actionNeeded = new paramStatusFields({invisible: true});
        this.result = new paramStatusFields({invisible: true});
        this.dueDate = new paramStatusFields({invisible: true});
        this.currencyName = new paramStatusFields({invisible: true});
        this.fio = new paramStatusFields({invisible: true});
        this.rC = new paramStatusFields({invisible: true});
        this.aRN = new paramStatusFields({invisible: true});
        this.docs = new paramStatusFields({invisible: true});

    }

    public setStatusByRole(role: string) {

        switch(role) { 
            case 'merchant':
            case 'cardholder': 
            case 'user': { 
                this.pan = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.transDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.merchantID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.terminalID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.amount = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currency = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.authCode = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.comment = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.cOPClaimID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.merchantName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.reasonCodeGroup = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.stage = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.actionNeeded = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.result = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.dueDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currencyName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.fio = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.rC = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.aRN = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.docs = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                break; 
            } 
            case 'chargeback_officer': { 
                this.pan = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.transDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.merchantID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.terminalID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.amount = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currency = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.authCode = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.comment = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.cOPClaimID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.merchantName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.reasonCodeGroup = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.stage = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.actionNeeded = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.result = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.dueDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currencyName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.fio = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.rC = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.aRN = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.docs = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                break; 
            } 
            case 'top_level': { 
                this.pan = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.transDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.merchantID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.terminalID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.amount = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currency = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.authCode = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.comment = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.cOPClaimID = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.merchantName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.reasonCodeGroup = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.stage = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.actionNeeded = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.result = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.dueDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currencyName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.fio = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.rC = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.aRN = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.docs = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                break; 
            }
            default: { 
                this.default(); 
               break; 
            } 
        }

    }
}
      
class paramStatusFields {
    constructor(props?: Partial<paramStatusFields>) {
        if (props) {
            this.readonly = props.readonly || false;
            this.required = props.required || false;
            this.invisible = props.invisible || false;
        } else {
            this.default();
        }
    }

    readonly: boolean;
    required: boolean;
    invisible: boolean;
      
    default() {
        this.readonly = false;
        this.required = true;
        this.invisible = true;
    }
    
}
      


