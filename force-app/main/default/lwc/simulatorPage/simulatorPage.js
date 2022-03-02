import { LightningElement, wire, track, api } from 'lwc';
import getDataMedatadaSimulator from '@salesforce/apex/SimulatorPageController.getDataMedatadaSimulator';

export default class SimulatorPage extends LightningElement {
    @api buttonText;
    @track pcklValuesType = [];
    @track pcklValuesModel = [];
    selectedType = '';
    selectedModel = '';
    selectedAmount = '';
    selectedDownPay = '';
    interest = '';
    disabledSearchButton = true;
    boolShowDataTable = false;
    disabledDownloadButton = true;

    columns = [
        { label: 'Pay Number', fieldName: 'payNumber'},
        { label: 'Unpaid Auto Balance', fieldName: 'restAmount', type: 'currency'},
        { label: 'Monthly Auto Capital Payment', fieldName: 'payMonthInterest', type: 'currency'},
        { label: 'Monthly Payment of Auto Interest', fieldName: 'payInterest', type: 'currency'},
        //{ label: 'Price', fieldName: 'price', type: 'currency' },
    ];
    dataTable = [];

    @wire(getDataMedatadaSimulator, {})
    wiredGetDataMedatadaSimulator({error, data}){
        console.log({data});    
        if(data && !this.isLoaded){
            console.log({data});
            this.pcklValuesType = data.wrpPicklist.lstPicklistType;
            this.pcklValuesModel = data.wrpPicklist.lstPicklistModel;
            this.interest = data.interest;
            this.selectedType = 'none';
            this.selectedModel = 'none';
        } else if(error) {
            console.log(JSON.stringify(error));
        }
    }

    searchKeywordModel(event) {
        console.log(event.target.value);
        if(event.target.value != 'none'){
            this.selectedModel = event.target.value;
        }
        this.refreshButtonsDisabled();
        
    }

    inputChangeDownPay(event) {
        console.log(event.target.value);
        if(event.target.value != 'none'){
            this.selectedDownPay = event.target.value;
        }
        this.refreshButtonsDisabled();
        
    }

    inputChangeAmount(event) {
        console.log(event.target.value);
        if(event.target.value != 'none'){
            this.selectedAmount = event.target.value;
        }
        this.refreshButtonsDisabled();
        
    }

    searchKeywordType(event) {
        console.log(event.target.value);
        if(event.target.value != 'none'){
            this.selectedType = event.target.value;
        }
        this.refreshButtonsDisabled();
    }

    refreshButtonsDisabled(){
        if(this.selectedType != 'none' && this.selectedModel != 'none' && this.selectedAmount != '' && this.selectedDownPay != ''){
            this.disabledSearchButton = false;
        }
    }

    deleteFilters(){
        this.dataTable = [];
        this.selectedModel = 'none';
        this.selectedType = 'none';
        this.selectedAmount = '';
        this.selectedDownPay = '';
        this.disabledSearchButton = true;
        this.boolShowDataTable = false;
        this.disabledDownloadButton = true;
    }

    calculate(){
        //rest amount
        console.log('amount '+this.selectedAmount);
        console.log('down pay '+this.selectedDownPay);
        console.log('type '+this.selectedType);
        var restAmount = Number(this.selectedAmount) - Number(this.selectedDownPay);
        console.log('restAmount '+restAmount);
        var payMonth = (Number(this.selectedAmount) - Number(this.selectedDownPay)) / Number(this.selectedType);
        console.log('payMonth '+payMonth);
        let listTableAmount = [];
        

        for (let index = 1; index <= Number(this.selectedType); index++) {
            let payInterest = restAmount * (Number(this.interest) / 100);
            let payMonthInterest = payMonth + payInterest;
            restAmount = restAmount - payMonth;
            
            let dataPerMonth = {};
            dataPerMonth.payNumber = index;
            dataPerMonth.payInterest = payInterest.toFixed(2);
            dataPerMonth.payMonthInterest = payMonthInterest.toFixed(2);
            dataPerMonth.restAmount = restAmount.toFixed(2);
            console.log(JSON.stringify(dataPerMonth));
            listTableAmount.push(dataPerMonth);
        }
        this.disabledDownloadButton = listTableAmount.length > 0 ? false : true;
        this.boolShowDataTable = listTableAmount.length > 0 ? true : false;
        console.log(JSON.stringify(listTableAmount));
        this.dataTable = listTableAmount;
    }

    downloadCSVFile() {   
        const columnDelimiter = ',';
        const lineDelimiter = '\r\n';
        const headerKey = [];
        const headerToShow = [];
        let str = '';
        const jsonObject = JSON.stringify(this.dataTable);

        this.columns.forEach(function (record) {
            console.log('record '+JSON.stringify(record));
            console.log('record.label '+JSON.stringify(record.label));
            headerToShow.push(record.label);
            headerKey.push(record.fieldName);
        });

        str+=headerToShow.join(columnDelimiter);
        str+=lineDelimiter;
        console.log('str 1 '+str)
        const data = typeof jsonObject !== 'object' ? JSON.parse(jsonObject) : jsonObject;
        console.log('data '+data)
        data.forEach(obj=>{
            let line = '';
            console.log('obj '+obj)
            headerKey.forEach(key=>{
                console.log('key '+key)
                if(line != ''){
                    line += columnDelimiter;
                }
                let strItem = obj[key]+'';
                line += strItem ? strItem.replace(/,/g, '') : strItem;
            })
            str += line + lineDelimiter;
        });
        console.log('str 1 '+str);

        const exportedFilename = 'carSimulator.csv';
        const link = window.document.createElement('a');
        link.href='data:text/csv;charset=utf-8,' + encodeURI(str);
        link.target="_blank";
        link.download=exportedFilename;
        link.click();
    }
}