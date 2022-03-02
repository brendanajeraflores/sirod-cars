import { LightningElement, api } from 'lwc';

export default class BnfToast extends LightningElement {
    @api message = '';
    @api showtoast = false;

    closeToast(event){
        this.showtoast = false;
    }
}