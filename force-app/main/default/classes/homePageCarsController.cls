public with sharing class homePageCarsController {
    public homePageCarsController() {}

    @AuraEnabled(cacheable=true)
    public static List<Product2> getProductsCarousel() {
        List<Product2> listProducts = new List<Product2>();

        listProducts = [SELECT Color__c, Brand__c, Price__c, Image__c, Name, Type__c
                        FROM Product2 
                        WHERE Is_car__c =: TRUE
                        AND In_carousel__c =: TRUE];
        //listProducts = [SELECT Color__c, Brand__c, Model__c, Price__c FROM Product2];
        
        return listProducts;
    }
}