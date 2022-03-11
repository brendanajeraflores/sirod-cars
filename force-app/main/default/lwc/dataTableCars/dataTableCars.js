import { LightningElement, wire, track, api } from 'lwc';

import getProducts from '@salesforce/apex/DataTableCarsController.getProducts';
import getValuesPicklist from '@salesforce/apex/DataTableCarsController.getValuesPicklist';
import searchProducts from '@salesforce/apex/DataTableCarsController.searchProducts';

/**
 * A component that uses new datatable
 */
export default class dataTableCars extends LightningElement {
    @api buttonText;
    tableData = [];
    tableDataAll = [];
    columns = [
        { label: 'Color', fieldName: 'color'},
        { label: 'Brand', fieldName: 'brand'},
        { label: 'Type', fieldName: 'type'},
        { label: 'Model', fieldName: 'model'},
        { label: 'Price', fieldName: 'price', type: 'currency' },
        { label: "Image", fieldName: "image", type: "image" }
        
        // custom richText column
       //{ label: "Image", fieldName: "image", type: "richText", wrapText: true }
    ];
    @track pcklValuesBrand = [];
    @track pcklValuesType = [];
    @track pcklValuesModel = [];

    searchValueType = '';
    searchValueBrand = '';
    searchValueModel = '';

    selectedBrand = '';
    selectedType = '';
    selectedModel = '';

    disabledSearchButton = true;
    disabledDeleteFiltersButton = true;


    @track isLoaded = false;

    @wire(getProducts, {})
    wiredGetProducts({error, data}){
        if(data && !this.isLoaded){
            console.log(JSON.stringify(data));
            this.tableData = data;
            /*this.tableData = data.map((item, index) => {
                return {
                    //image: 'imagen',
                    color: item.Color__c,
                    brand: item.Brand__c,
                    type: item.Type__c,
                    price: item.Price__c,
                    image: item.Image__c,
                    model: item.Model__c

                }
            });*/
            this.tableDataAll = this.tableData;
        }
    }

    @wire(getValuesPicklist, {})
    wiredGetValuesPicklist({error, data}){
        console.log({data});    
        if(data && !this.isLoaded){
            console.log({data});
            this.pcklValuesBrand = data.lstPicklistBrand;
            this.pcklValuesType = data.lstPicklistType;
            this.pcklValuesModel = data.lstPicklistModel;

            this.selectedBrand = 'none';
            this.selectedType = 'none';
            this.selectedModel = 'none';
        } else if(error) {
            console.log(JSON.stringify(error));
        }
    }

    searchKeywordType(event) {
        console.log(event.target.value);
        if(event.target.value != 'none'){
            this.searchValueType = event.target.value;
            this.disabledSearchButton = false;
        } else {
            this.disabledSearchButton = true;
        }
    }

    searchKeywordBrand(event) {
        console.log(event.target.value);
        if(event.target.value != 'none'){
            this.searchValueBrand = event.target.value;
            this.disabledSearchButton = false;
        } else {
            this.disabledSearchButton = true;
        }
    }

    searchKeywordModel(event) {
        console.log(event.target.value);
        if(event.target.value != 'none'){
            this.searchValueModel = event.target.value;
            this.disabledSearchButton = false;
        } else {
            this.disabledSearchButton = true;
        }
    }

    handleSearchKeyword() {
        console.log(this.searchValueType);
        console.log(this.searchValueBrand);
        console.log(this.searchValueModel);
        searchProducts({
            typeCar: this.searchValueType,
            brandCar: this.searchValueBrand,
            modelCar: this.searchValueModel
        })
        .then(result => {
            console.log({result});
            this.tableData = result;
            /*this.tableData = result.map((item, index) => {
                return {
                    //image: 'imagen',
                    color: item.Color__c,
                    brand: item.Brand__c,
                    type: item.Type__c,
                    price: item.Price__c,
                    image: item.Image__c,
                    model: item.Model__c
                }
            });*/
            
        })
        .catch(error => {
           
            const event = new ShowToastEvent({
                title: 'Error',
                variant: 'error',
                message: error.body.message,
            });
            this.dispatchEvent(event);
            // reset contacts var with null   
            this.contactsRecord = null;
        });
    }

    deleteFilters(){
        this.tableData = this.tableDataAll;
        this.selectedBrand = 'none';
        this.selectedType = 'none';
        this.disabledSearchButton = true;
    }
}