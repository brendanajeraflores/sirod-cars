import { LightningElement, api, track } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';

import basePath from '@salesforce/community/basePath';
import SystemModstamp from '@salesforce/schema/Account.SystemModstamp';

export default class NavigationMenuItem extends NavigationMixin(LightningElement) {

    /**
     * the NavigationMenuItem from the Apex controller, 
     * contains a label and a target.
     */
    @api item = {};

    @track href = 'javascript:void(0);';

    /**
     * the PageReference object used by lightning/navigation
     */
    pageReference;

    connectedCallback() {
        const { type, target, defaultListViewId } = this.item;
        console.log('type '+type);
        console.log('target '+target);
        console.log('defaultListViewId '+defaultListViewId);
        console.log('basePath '+basePath);
        console.log('this.pageReference '+this.pageReference);
        
        // get the correct PageReference object for the menu item type
        if (type === 'SalesforceObject') {
            // aka "Salesforce Object" menu item
            this.pageReference = {
                type: 'standard__objectPage',
                attributes: { 
                    objectApiName: target
                },
                state: {
                    filterName: defaultListViewId
                }
            };
        } else if (type === 'InternalLink') {
            // aka "Site Page" menu item

            // WARNING: Normally you shouldn't use 'standard__webPage' for internal relative targets, but
            // we don't have a way of identifying the Page Reference type of an InternalLink URL
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: basePath + target
                }
            };
        } else if (type === 'ExternalLink') {
            // aka "External URL" menu item
            this.pageReference = {
                type: 'standard__webPage',
                attributes: {
                    url: target
                }
            };
        }

        // use the NavigationMixin from lightning/navigation to generate the URL for navigation. 
        if (this.pageReference) {
            this[NavigationMixin.GenerateUrl](this.pageReference)
                .then(url => {
                    this.href = url;
                });
        }
    }

    handleClick(evt) {
        // use the NavigationMixin from lightning/navigation to perform the navigation.
        evt.stopPropagation();
        evt.preventDefault();
        console.log('this.pageReference bnf '+JSON.stringify(this.pageReference));
        if (this.pageReference) {
            this[NavigationMixin.Navigate](this.pageReference);
        } else {
            console.log(`Navigation menu type "${this.item.type}" not implemented for item ${JSON.stringify(this.item)}`);
        }
    }

}