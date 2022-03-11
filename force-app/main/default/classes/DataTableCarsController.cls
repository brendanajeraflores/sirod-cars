public with sharing class DataTableCarsController {
    public DataTableCarsController() {}

    public class wrapperProducts {
        @AuraEnabled public String Id {get;set;}
        @AuraEnabled public String name {get;set;}
        @AuraEnabled public Decimal price {get;set;}
        @AuraEnabled public String image {get;set;}
        @AuraEnabled public String color {get;set;}
        @AuraEnabled public String brand {get;set;}
        @AuraEnabled public String type {get;set;}
        @AuraEnabled public String model {get;set;}
        @AuraEnabled public Boolean isActive {get;set;}
        
        
    }

    @AuraEnabled(cacheable=true)
    public static List<wrapperProducts> getProducts() {
        List<Product2> listProducts = [SELECT Id, Color__c, Brand__c, Price__c, Type__c, Image__c, Name, Model__c, IsActive 
                                        FROM Product2 
                                        WHERE Is_car__c =: TRUE];
        return getProductsWithFile(listProducts);
    }

    @AuraEnabled(cacheable=true)
    public static List<wrapperProducts> getProductsWithFile(List<Product2> listProducts) {
        List<String> listProductsSt = new List<String>();
        List<wrapperProducts> lstWrp = new List<wrapperProducts>();

        
        
        for (Product2 prod : listProducts) {
            listProductsSt.add(prod.Id);
        }

        Map<String, String> mapProductFile = FileUploaderClass.getProductsFiles(listProductsSt);
        
        for (Product2 prod : listProducts) {
            if(mapProductFile.containsKey(prod.Id)){
                wrapperProducts wrp = new wrapperProducts();
                wrp.Id = prod.Id;
                wrp.name = prod.Name;
                wrp.price = prod.Price__c;
                wrp.color = prod.Color__c;
                wrp.brand = prod.Brand__c;
                wrp.type = prod.Type__c;
                wrp.model = prod.Model__c;
                wrp.image = '/sirodcaragency/s/sfsites/c/sfc/servlet.shepherd/version/download/'+mapProductFile.get(prod.Id);
                wrp.isActive = prod.IsActive;
                lstWrp.add(wrp);

            }
        }

        return lstWrp;
    }

    @AuraEnabled(cacheable=false)
    public static List<wrapperProducts> getProductsRefresh() {
        List<Product2> listProducts = [SELECT Id, Color__c, Brand__c, Price__c, Type__c, Image__c, Name, Model__c, IsActive 
                                        FROM Product2 
                                        WHERE Is_car__c =: TRUE];
        return getProductsWithFile(listProducts);
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

        Schema.DescribeFieldResult objFieldColor = Product2.Color__c.getDescribe();
        List<Schema.PicklistEntry> lstPickListValuesColor = objFieldColor.getPickListValues();

        PicklistWrapper.wrapperListPL wrp = new PicklistWrapper.wrapperListPL();
        wrp.lstPicklistType = PicklistWrapper.createPickListFromPL(lstPickListValuesType);
        wrp.lstPicklistBrand = PicklistWrapper.createPickListFromPL(lstPickListValuesBrand);
        wrp.lstPicklistModel = PicklistWrapper.createPickListFromPL(lstPickListValuesModel);
        wrp.lstPicklistColor = PicklistWrapper.createPickListFromPL(lstPickListValuesColor);

        return wrp;
        //return 'testReturn';
    }
    
    @AuraEnabled(cacheable=true)
    public static List<wrapperProducts> searchProducts(String typeCar, String brandCar, String modelCar) {
        
        List<Product2> listProducts = new List<Product2>();
        String queryProduct = '';
        Boolean orCondition = false;
        
        if(typeCar != '' || brandCar != '' || modelCar != ''){
            queryProduct = 'SELECT Id, IsActive, Color__c, Brand__c, Type__c, Price__c, Image__c, Name, Model__c FROM Product2 WHERE Is_car__c = TRUE AND (';
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
            
            listProducts = Database.query(queryProduct);
        }
        
        
        return getProductsWithFile(listProducts);
    }
}