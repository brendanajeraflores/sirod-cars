public with sharing class DataTableCarsController {
    public DataTableCarsController() {}

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProducts() {
        List<Product2> listProducts = new List<Product2>();

        listProducts = [SELECT Id, Color__c, Brand__c, Price__c, Type__c, Image__c, Name, Model__c, IsActive FROM Product2 WHERE Is_car__c =: TRUE];
        
        return listProducts;
    }

    @AuraEnabled(cacheable=false)
    public static List<Product2> getProductsRefresh() {
        List<Product2> listProducts = new List<Product2>();

        listProducts = [SELECT Id, Color__c, Brand__c, Price__c, Type__c, Image__c, Name, Model__c, IsActive FROM Product2 WHERE Is_car__c =: TRUE];
        
        return listProducts;
    }

    @AuraEnabled(cacheable=true)
    public static PicklistWrapper.wrapperListPL getValuesPicklist() {
    //public static String getValuesPicklist() {
        Schema.DescribeFieldResult objFieldBrand = Product2.Brand__c.getDescribe();
        List<Schema.PicklistEntry> lstPickListValuesBrand = objFieldBrand.getPickListValues();

        Schema.DescribeFieldResult objFieldType = Product2.Type__c.getDescribe();
        List<Schema.PicklistEntry> lstPickListValuesType = objFieldType.getPickListValues();

        Schema.DescribeFieldResult objFieldModel = Product2.Model__c.getDescribe();
        List<Schema.PicklistEntry> lstPickListValuesModel = objFieldModel.getPickListValues();

        PicklistWrapper.wrapperListPL wrp = new PicklistWrapper.wrapperListPL();
        wrp.lstPicklistType = PicklistWrapper.createPickListFromPL(lstPickListValuesType);
        wrp.lstPicklistBrand = PicklistWrapper.createPickListFromPL(lstPickListValuesBrand);
        wrp.lstPicklistModel = PicklistWrapper.createPickListFromPL(lstPickListValuesModel);

        return wrp;
        //return 'testReturn';
    }

    
    

    

    @AuraEnabled(cacheable=true)
    public static List<Product2> searchProducts(String typeCar, String brandCar, String modelCar) {
        System.debug(typeCar);
        System.debug(brandCar);
        List<Product2> listProducts = new List<Product2>();
        String queryProduct = '';
        Boolean orCondition = false;
        
        if(typeCar != '' || brandCar != '' || modelCar != ''){
            queryProduct = 'SELECT Color__c, Brand__c, Type__c, Price__c, Image__c, Name, Model__c FROM Product2 WHERE Is_car__c = TRUE AND (';
            if(typeCar != ''){
                queryProduct += ' Type__c LIKE \'%' + String.escapeSingleQuotes(typeCar) + '%\'';
                orCondition = true;
            }
            queryProduct += orCondition && brandCar != '' ? ' AND' : '';
            if(brandCar != ''){
                queryProduct += ' Brand__c LIKE \'%' + String.escapeSingleQuotes(brandCar) + '%\'';
                orCondition = true;
            }
            queryProduct += orCondition && modelCar != '' ? ' AND' : '';
            if(modelCar != ''){
                queryProduct += ' Model__c LIKE \'%' + String.escapeSingleQuotes(modelCar) + '%\'';
            }
            queryProduct += ')';
            System.debug(queryProduct);
            listProducts = Database.query(queryProduct);
        }
        
        
        return listProducts;
    }

    /*public class wrapperListPL {
        @AuraEnabled public List<wrpPickList> lstPicklistType {get;set;}
        @AuraEnabled public List<wrpPickList> lstPicklistBrand {get;set;}
        @AuraEnabled public List<wrpPickList> lstPicklistModel {get;set;}
        
    }

    public class wrpPickList{
        @AuraEnabled public String label {get;set;}
        @AuraEnabled public String value {get;set;}
    }*/
}