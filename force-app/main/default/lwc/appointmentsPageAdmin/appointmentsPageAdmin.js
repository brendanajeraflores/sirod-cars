import { LightningElement, wire ,api, track } from 'lwc';
import getLeads from '@salesforce/apex/AppointmentsController.getLeads';

export default class AppointmentsPageAdmin extends LightningElement {
    @api buttonText;
    @track isLoaded = false;
    dataTable = [];
    boolShowDataTable = false;
    columns = [
        { label: 'Name', fieldName: 'name'},
        { label: 'Last Name', fieldName: 'lastname'},
        { label: 'Email', fieldName: 'email'},
        { label: 'Company', fieldName: 'company'},
        { label: 'State', fieldName: 'state'}
    ];

    @wire(getLeads, {})
    wiredGetLeads({error, data}){
        if(data && !this.isLoaded){
            console.log({data});
            this.dataTable = data.map((item, index) => {
                return {
                    //image: 'imagen',
                    Id: item.Id,
                    name: item.FirstName,
                    lastname: item.LastName,
                    email: item.Email,
                    company: item.Company,
                    state: item.State__c
                }
            });
            this.boolShowDataTable = true;
        }
    }
}