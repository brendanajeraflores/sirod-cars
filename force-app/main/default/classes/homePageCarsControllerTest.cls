@isTest
public with sharing class homePageCarsControllerTest {
    
    @TestSetup
    static void makeData(){
        Product2 pd = new Product2();
        pd.Name = 'test car';
        pd.Price__c = 234567;
        pd.Color__c = 'Blue';
        pd.Brand__c = 'Audi';
        pd.Type__c = 'Suv';
        pd.Model__c = '2022';
        pd.IsActive = true;
        pd.Is_car__c = true;
        pd.In_carousel__c = true;
        insert pd;

        String idFile = FileUploaderClass.uploadFile('test base64', 'testFile', pd.Id);
    }

    @isTest 
    static void getProductsCarouselTest() {
        Test.startTest();
        List<homePageCarsController.wrapperProducts> listProducts = homePageCarsController.getProductsCarousel();
            System.assertEquals(1, listProducts.size());
        Test.stopTest();
    }
}
