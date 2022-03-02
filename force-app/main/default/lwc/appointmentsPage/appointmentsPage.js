import { LightningElement, api, track } from 'lwc';
import LEAD_OBJECT from '@salesforce/schema/Lead';
import FIRST_FIELD from '@salesforce/schema/Lead.FirstName';
import LAST_FIELD from '@salesforce/schema/Lead.LastName';
import EMAIL_FIELD from '@salesforce/schema/Lead.Email';
import COMPANY_FIELD from '@salesforce/schema/Lead.Company';
import CITY_FIELD from '@salesforce/schema/Lead.City__c';
import STATE_FIELD from '@salesforce/schema/Lead.State__c';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

import basePath from '@salesforce/community/basePath';
import { NavigationMixin } from 'lightning/navigation';

export default class AppointmentsPage extends NavigationMixin(LightningElement) {
    @api buttonText;
    @track href = 'javascript:void(0);';
    pageReference;

    leadObject = LEAD_OBJECT;
    leadFields = [FIRST_FIELD, LAST_FIELD, EMAIL_FIELD, COMPANY_FIELD, CITY_FIELD, STATE_FIELD];

    handleSuccess( event ) { 
        // Navigate to a URL
        console.log(basePath)
        //window.location.assign(basePath);

        this[NavigationMixin.Navigate]({
            type: 'standard__webPage',
            attributes: {
                url: basePath + '/'
            }
        },
        true // Replaces the current page in your browser history with the URL
      );
 
    }
}