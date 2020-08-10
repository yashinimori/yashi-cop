export class FieldsStatus {
    constructor(props?: Partial<FieldsStatus>) {
        if (props) {
        this.pAN = props.pAN || new paramStatusFields();

        } else {
        this.default();
        }
    }

    pAN: paramStatusFields;

    default() {
        this.pAN = new paramStatusFields({invisible: true});
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
      


