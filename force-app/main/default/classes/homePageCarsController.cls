public with sharing class homePageCarsController {
    public homePageCarsController() {}

    @AuraEnabled(cacheable=true)
    public static List<wrapperProducts> getProductsCarousel() {

        List<String> listProductsSt = new List<String>();
        List<wrapperProducts> lstWrp = new List<wrapperProducts>();

        List<Product2> listProducts = [SELECT Id, Color__c, Brand__c, Price__c, Image__c, Name, Type__c
                        FROM Product2 
                        WHERE Is_car__c =: TRUE
                        AND In_carousel__c =: TRUE];
        //listProducts = [SELECT Color__c, Brand__c, Model__c, Price__c FROM Product2];

        for (Product2 prod : listProducts) {
            listProductsSt.add(prod.Id);
        }

        Map<String, String> mapProductFile = FileUploaderClass.getProductsFiles(listProductsSt);
        
        for (Product2 prod : listProducts) {
            if(mapProductFile.containsKey(prod.Id)){
                wrapperProducts wrp = new wrapperProducts();
                wrp.name = prod.Name;
                wrp.price = prod.Price__c;
                wrp.srcImge = '/sirodcaragency/s/sfsites/c/sfc/servlet.shepherd/version/download/'+mapProductFile.get(prod.Id);
                lstWrp.add(wrp);

            }
        }


        return lstWrp;
    }

    public class wrapperProducts {
        @AuraEnabled public String name {get;set;}
        @AuraEnabled public Decimal price {get;set;}
        @AuraEnabled public String srcImge {get;set;}

        
    }

}