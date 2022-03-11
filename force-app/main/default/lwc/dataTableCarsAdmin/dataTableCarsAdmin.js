import { LightningElement, wire, api, track } from 'lwc';
import getValuesPicklist from '@salesforce/apex/DataTableCarsController.getValuesPicklist';
import getProducts from '@salesforce/apex/DataTableCarsController.getProducts';
import getProductsRefresh from '@salesforce/apex/DataTableCarsController.getProductsRefresh';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import PRODUCT_OBJECT from '@salesforce/schema/Product2';
import NAME_FIELD from '@salesforce/schema/Product2.Name';
import COLOR_FIELD from '@salesforce/schema/Product2.Color__c';
import BRAND_FIELD from '@salesforce/schema/Product2.Brand__c';
import TYPE_FIELD from '@salesforce/schema/Product2.Type__c';
import PRICE_FIELD from '@salesforce/schema/Product2.Price__c';
import IMAGE_FIELD from '@salesforce/schema/Product2.Image__c';
import MODEL_FIELD from '@salesforce/schema/Product2.Model__c';
import ISACTIVE_FIELD from '@salesforce/schema/Product2.IsActive';
import ISCAR_FIELD from '@salesforce/schema/Product2.Is_car__c';
import INCAROUSEL_FIELD from '@salesforce/schema/Product2.In_carousel__c';



import uploadFile from '@salesforce/apex/FileUploaderClass.uploadFile'
import ACCOUNT_OBJECT from "@salesforce/schema/Account";
import { createRecord } from "lightning/uiRecordApi";

export default class DataTableCarsAdmin extends LightningElement {
    @api buttonText;
    @track isLoaded = false;
    @track isModalOpen = false;
    @track showToast = false;
    @track messageSuccess = '';
    @track showToastUpdated = false;
    @track pcklValuesBrand = [];
    @track pcklValuesType = [];
    @track pcklValuesModel = [];
    @track pcklValuesColor = [];
    productRecord = {"Is_car__c" : true};
    fileData

    tableData = [];
    draftValues  = [];

    //Columns to data table
    columns = [
        { label: 'Color', fieldName: 'color', editable: true, fieldNameObj: 'Color__c'},
        { label: 'Brand', fieldName: 'brand', editable: true, fieldNameObj: 'Brand__c'},
        { label: 'Type', fieldName: 'type', editable: true, fieldNameObj: 'Type__c'},
        { label: 'Model', fieldName: 'model', editable: true, fieldNameObj: 'Model__c'},
        { label: 'Price', fieldName: 'price', type: 'currency', editable: true , fieldNameObj: 'Price__c'},
        { label: 'Is Active?', fieldName: 'isActive', editable: true, type: 'boolean', fieldNameObj: 'IsActive'},
        { label: "Image", fieldName: "image", type: "image" }
        // custom richText column
       //{ label: "Image", fieldName: "image", type: "richText", wrapText: true }
    ];

    //Field to lightning-record-form 
    productObject = PRODUCT_OBJECT;
    productFields = [ NAME_FIELD, BRAND_FIELD, TYPE_FIELD, MODEL_FIELD, COLOR_FIELD, PRICE_FIELD, ISACTIVE_FIELD, ISCAR_FIELD, INCAROUSEL_FIELD, IMAGE_FIELD];

    @wire(getProducts, {})
    wiredGetProducts({error, data}){
        if(data && !this.isLoaded){
            console.log({data});
            this.tableData = data;
            /*this.tableData = data.map((item, index) => {
                return {
                    //image: 'imagen',
                    Id: item.Id,
                    color: item.Color__c,
                    brand: item.Brand__c,
                    type: item.Type__c,
                    price: item.Price__c,
                    image: item.Image__c,
                    model: item.Model__c,
                    isActive: item.IsActive

                }
            });*/
            
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
            this.pcklValuesColor = data.lstPicklistColor;

            
        } else if(error) {
            console.log(JSON.stringify(error));
        }
    }

    //Function to create record in modal
    handleSuccess( event ) { 
        this.showToast = true;
        this.messageSuccess = 'Product created successfully.';
    }

    refreshTable(){
        getProductsRefresh({})
            .then(result => {
                console.log(JSON.stringify(result));
                this.tableData = result;
                /*this.tableData = result.map((item, index) => {
                    return {
                        //image: 'imagen',
                        Id : item.Id,
                        color: item.Color__c,
                        brand: item.Brand__c,
                        type: item.Type__c,
                        price: item.Price__c,
                        image: item.Image__c,
                        model: item.Model__c,
                        isActive: item.IsActive
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
            });
    }
    
    openModal() {
        // to open modal set isModalOpen tarck value as true
        this.isModalOpen = true;
    }
    closeModal() {
        // to close modal set isModalOpen tarck value as false
        this.isModalOpen = false;
        this.showToast = false;
        this.refreshTable();
    }

    //Function to edit record in data table
    handleSave(event){
        console.log('bnf draftValues '+JSON.stringify(event.detail.draftValues));
        let draftValuesString = JSON.stringify(event.detail.draftValues);
        draftValuesString = draftValuesString.replaceAll('[','');
        draftValuesString = draftValuesString.replaceAll(']','');
        console.log('bnf draftValuesString 1 '+draftValuesString);
        this.columns.forEach(column => {
            draftValuesString = draftValuesString.replaceAll(column.fieldName, column.fieldNameObj);
        });
        console.log('bnf draftValuesString 2 '+draftValuesString);
        let draftValuesArray = JSON.parse("[" + draftValuesString + "]");
        console.log('bnf draftValuesArray  '+draftValuesArray);

        const recordInputs = draftValuesArray.slice().map(draft => {
            console.log('bnf draft '+JSON.stringify(draft));
            const fields = Object.assign({}, draft);
            console.log('bnf fields '+JSON.stringify(fields));
            return { fields };
        });
        console.log('RECORDINPUTS', JSON.stringify(recordInputs));

        const promises = recordInputs.map(recordInput => updateRecord(recordInput));
        Promise.all(promises).then(res => {
            this.showToastUpdated = true;
            this.messageSuccess = 'Records updated successfully';
            this.refreshTable();
            this.draftValues = [];
        }).catch(error => {
            this.showToastUpdated = true;
            this.messageSuccess = 'An Error Occured!!';
        });
    }

    openfileUpload(event) {
        const file = event.target.files[0]
        var reader = new FileReader()
        reader.onload = () => {
            var base64 = reader.result.split(',')[1]
            this.fileData = {
                'filename': file.name,
                'base64': base64,
                'recordId': this.recordId
            }
            console.log(this.fileData)
        }
        reader.readAsDataURL(file)
    }

    handleChange(event) {
        console.log(JSON.stringify(event.target.value));
        this.productRecord[event.target.name] = event.target.value;
    }

    handleChangeCheck(event) {
        console.log(JSON.stringify(event.target.checked));
        this.productRecord[event.target.name] = event.target.checked;
    }

    createProduct() {
        this.isLoading = true;
        const fields = this.productRecord;
        const recordInput = { apiName: PRODUCT_OBJECT.objectApiName, fields };
        
        console.log('fields '+JSON.stringify(fields));
        console.log('fileData '+JSON.stringify(this.fileData));

        createRecord(recordInput).then((product) => {
            const productId = product.id;
            console.log('product '+product.id);

            const {base64, filename, recordId} = this.fileData
            uploadFile({ base64, filename, productId }).then(result=>{
                this.fileData = null
                let title = `${filename} uploaded successfully!!`
                console.log('result '+JSON.stringify(result));
            })

            this.productRecord = {};
        })
        .catch((error) => {
            console.log('Error '+JSON.stringify(error));
        })
        .finally(() => {
            this.isLoading = false;
        });
    }
}