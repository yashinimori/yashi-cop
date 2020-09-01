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
            this.status = props.status || new paramStatusFields();
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
    status: paramStatusFields;
    actionNeeded: paramStatusFields;
    result: paramStatusFields;
    dueDate: paramStatusFields;
    currencyName: paramStatusFields;
    fio: paramStatusFields;
    rC: paramStatusFields;
    aRN: paramStatusFields;
    docs: paramStatusFields;
    single_claim_form: paramStatusFields;
    scf_clarif_comment: paramStatusFields;
    scf_clarif_upload_doc: paramStatusFields;
    scf_finish_comment: paramStatusFields;
    scf_finish_reason: paramStatusFields;
    scf_finish_decision: paramStatusFields;
    scf_finish_responce: paramStatusFields;
    scf_finish_amount: paramStatusFields;
    scf_finish_upload_doc: paramStatusFields;
    scf_escal_upload_doc: paramStatusFields;
    scf_escal_mmt: paramStatusFields;
    scf_escal_reasoncode: paramStatusFields;
    scf_escal_comment: paramStatusFields;
    button_escalation: paramStatusFields;
    button_escal_clarif: paramStatusFields;
    button_escal_finish: paramStatusFields;
    button_escal_add_responce: paramStatusFields;
    button_request_docs: paramStatusFields;
    scf_query_comment: paramStatusFields;
    scf_query_upload_doc: paramStatusFields;
    bank_single_view: paramStatusFields;
    list_claims: paramStatusFields;

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
        this.status = new paramStatusFields({invisible: true});
        this.actionNeeded = new paramStatusFields({invisible: true});
        this.result = new paramStatusFields({invisible: true});
        this.dueDate = new paramStatusFields({invisible: true});
        this.currencyName = new paramStatusFields({invisible: true});
        this.fio = new paramStatusFields({invisible: true});
        this.rC = new paramStatusFields({invisible: true});
        this.aRN = new paramStatusFields({invisible: true});
        this.docs = new paramStatusFields({invisible: true});
        this.single_claim_form = new paramStatusFields({invisible: true});
        this.scf_finish_comment = new paramStatusFields({invisible: true});
        this.scf_finish_reason = new paramStatusFields({invisible: true});
        this.scf_finish_decision = new paramStatusFields({invisible: true});
        this.scf_finish_responce = new paramStatusFields({invisible: true});
        this.scf_finish_amount = new paramStatusFields({invisible: true});
        this.scf_finish_upload_doc = new paramStatusFields({invisible: true});
        this.scf_escal_upload_doc = new paramStatusFields({invisible: true});
        this.scf_escal_mmt = new paramStatusFields({invisible: true});
        this.scf_escal_reasoncode = new paramStatusFields({invisible: true});
        this.scf_escal_comment = new paramStatusFields({invisible: true});
        this.scf_clarif_comment = new paramStatusFields({invisible: true});
        this.scf_clarif_upload_doc = new paramStatusFields({invisible: true});
        this.button_escalation = new paramStatusFields({invisible: true});
        this.button_escal_clarif = new paramStatusFields({invisible: true});
        this.button_escal_finish = new paramStatusFields({invisible: true});
        this.button_escal_add_responce = new paramStatusFields({invisible: true});
        this.button_request_docs = new paramStatusFields({invisible: true});
        this.scf_query_comment = new paramStatusFields({invisible: true});
        this.scf_query_upload_doc = new paramStatusFields({invisible: true});
        this.bank_single_view = new paramStatusFields({invisible: true});
        this.list_claims = new paramStatusFields({invisible: true});
        
    }

    public setStatusByRole(role: string) {

        switch(role) { 
            case 'merchant':{ 
                this.list_claims = new paramStatusFields({invisible: false});
                this.bank_single_view = new paramStatusFields({invisible: false});
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
                this.status = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.actionNeeded = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.result = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.dueDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currencyName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.fio = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.rC = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.aRN = new paramStatusFields({invisible: true}); 
                this.docs = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.single_claim_form = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_reason = new paramStatusFields({invisible: true});
                this.scf_finish_decision = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_responce = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_amount = new paramStatusFields({invisible: true});
                this.scf_finish_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_upload_doc = new paramStatusFields({invisible: true}); 
                this.scf_escal_mmt = new paramStatusFields({invisible: true});
                this.scf_escal_reasoncode = new paramStatusFields({invisible: true});
                this.scf_escal_comment = new paramStatusFields({invisible: true});
                this.scf_clarif_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.button_escalation = new paramStatusFields({invisible: true});
                this.button_escal_clarif = new paramStatusFields({invisible: false});
                this.button_escal_finish = new paramStatusFields({invisible: false});
                this.button_escal_add_responce = new paramStatusFields({invisible: true});
                this.button_request_docs = new paramStatusFields({invisible: true});
                this.scf_query_comment = new paramStatusFields({invisible: true});
                this.scf_query_upload_doc = new paramStatusFields({invisible: true});
            } 
            break; 
            case 'cardholder': 
            case 'сс_branch': 
            case 'user': { 
                this.list_claims = new paramStatusFields({invisible: false});
                this.bank_single_view = new paramStatusFields({invisible: false});
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
                this.status = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.actionNeeded = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.result = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.dueDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currencyName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.fio = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.rC = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.aRN = new paramStatusFields({invisible: true}); 
                this.docs = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.single_claim_form = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_reason = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_decision = new paramStatusFields({invisible: true}); 
                this.scf_finish_responce = new paramStatusFields({invisible: true}); 
                this.scf_finish_amount = new paramStatusFields({invisible: true}); 
                this.scf_finish_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_mmt = new paramStatusFields({invisible: true}); 
                this.scf_escal_reasoncode = new paramStatusFields({invisible: true});  
                this.scf_escal_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.button_escalation = new paramStatusFields({invisible: false}); 
                this.button_escal_clarif = new paramStatusFields({invisible: false});
                this.button_escal_finish = new paramStatusFields({invisible: false});
                this.button_escal_add_responce = new paramStatusFields({invisible: true});
                this.button_request_docs = new paramStatusFields({invisible: true});
                this.scf_query_comment = new paramStatusFields({invisible: true});
                this.scf_query_upload_doc = new paramStatusFields({invisible: true});
            } 
            break; 
            case 'cop_manager':{
                this.list_claims = new paramStatusFields({invisible: true});
                this.bank_single_view = new paramStatusFields({invisible: false});
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
                this.status = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.actionNeeded = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.result = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.dueDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currencyName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.fio = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.rC = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.aRN = new paramStatusFields({invisible: true}); 
                this.docs = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.single_claim_form = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.scf_finish_comment = new paramStatusFields({invisible: false, readonly:false, required: false});  
                this.scf_finish_reason = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_decision = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_responce = new paramStatusFields({invisible: true}); 
                this.scf_finish_amount = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.scf_finish_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_mmt = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_reasoncode = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.button_escalation = new paramStatusFields({invisible: false});
                this.button_escal_clarif = new paramStatusFields({invisible: false});
                this.button_escal_finish = new paramStatusFields({invisible: false});
                this.button_escal_add_responce = new paramStatusFields({invisible: true});
                this.button_request_docs = new paramStatusFields({invisible: false});
                this.scf_query_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_query_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
            }
            break;
            case 'chargeback_officer': { 
                this.list_claims = new paramStatusFields({invisible: false});
                this.bank_single_view = new paramStatusFields({invisible: false});
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
                this.status = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.actionNeeded = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.result = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.dueDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currencyName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.fio = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.rC = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.aRN = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.docs = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.single_claim_form = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.scf_finish_comment = new paramStatusFields({invisible: false, readonly:false, required: false});  
                this.scf_finish_reason = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_decision = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_responce = new paramStatusFields({invisible: true}); 
                this.scf_finish_amount = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.scf_finish_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_mmt = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_reasoncode = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.button_escalation = new paramStatusFields({invisible: false});
                this.button_escal_clarif = new paramStatusFields({invisible: false});
                this.button_escal_finish = new paramStatusFields({invisible: false});
                this.button_escal_add_responce = new paramStatusFields({invisible: true});
                this.button_request_docs = new paramStatusFields({invisible: false});
                this.scf_query_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_query_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
            } 
            break; 
            case 'top_level': { 
                this.list_claims = new paramStatusFields({invisible: true});
                this.bank_single_view = new paramStatusFields({invisible: false});
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
                this.status = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.actionNeeded = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.result = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.dueDate = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.currencyName = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.fio = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.rC = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.aRN = new paramStatusFields({invisible: true}); 
                this.docs = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.single_claim_form = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.scf_finish_comment = new paramStatusFields({invisible: false, readonly:false, required: false});  
                this.scf_finish_reason = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_decision = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_responce = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_amount = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_finish_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false});
                this.scf_escal_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_mmt = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_reasoncode = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_escal_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_clarif_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.button_escalation = new paramStatusFields({invisible: false});
                this.button_escal_clarif = new paramStatusFields({invisible: false});
                this.button_escal_finish = new paramStatusFields({invisible: false});
                this.button_escal_add_responce = new paramStatusFields({invisible: false});
                this.button_request_docs = new paramStatusFields({invisible: false});
                this.scf_query_comment = new paramStatusFields({invisible: false, readonly:false, required: false}); 
                this.scf_query_upload_doc = new paramStatusFields({invisible: false, readonly:false, required: false}); 
            }
            break; 
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
      


