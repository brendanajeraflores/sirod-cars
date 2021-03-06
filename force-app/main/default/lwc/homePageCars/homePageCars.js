import { LightningElement, api, track, wire } from 'lwc';
import getProductsCarousel from '@salesforce/apex/homePageCarsController.getProductsCarousel';
import communityId from '@salesforce/community/Id';
import communityBasePath from '@salesforce/community/basePath';

export default class HomePageCars extends LightningElement {
    @api buttonText;
    carsList = [];
    sfdcBaseURL = '';
    imageTest = '';
    imageTestD = '';

    @track isLoaded = false;

    @wire(getProductsCarousel, {

    })
    wiredGetProductsCarousel({error, data}){
        
        console.log('data1 '+data);
        console.log('error '+error);
        console.log('communityId '+communityId);
        console.log('communityBasePath '+communityBasePath);
        ///sfsites/c/sfc/servlet.shepherd/version/download/0688c000007XNLJAA4  ContentVersionId
        if(data && !this.loaded){
            console.log('data2 '+JSON.stringify(data));
            this.carsList = data;/*data.map((item, index) => {
                console.log('item '+item);
                var mySubString = item.Image__c.substring(
                    item.Image__c.indexOf("=") + 2, 
                    item.Image__c.lastIndexOf(" ") -1
                ).replaceAll('amp;', '');
                console.log('mySubString '+mySubString);
                var priceP = (item.Price__c).toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                });
                console.log('priceP '+priceP);
                return {
                    //image: 'imagen',
                    name: item.Name,
                    color: item.Color__c,
                    brand: item.Brand__c,
                    type: item.Type__c,
                    price: priceP,
                    src: mySubString

                }
            });*/
        }
    }

    getBaseUrl(){
        this.sfdcBaseURL = window.location.origin;
    }
}