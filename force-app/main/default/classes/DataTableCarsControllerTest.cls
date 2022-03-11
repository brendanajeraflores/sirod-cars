@isTest
public with sharing class DataTableCarsControllerTest {

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
        insert pd;

        String idFile = FileUploaderClass.uploadFile('test base64', 'testFile', pd.Id);
    }

    @isTest 
    static void getProductsTest() {
        Test.startTest();
            List<DataTableCarsController.wrapperProducts> listProducts = DataTableCarsController.getProducts();
            System.assertEquals(1, listProducts.size());
        Test.stopTest();
    }

    @isTest 
    static void getProductsWithFileTest() {
        List<Product2> lstProd = [SELECT Id, Color__c, Brand__c, Price__c, Type__c, Image__c, Name, Model__c, IsActive 
                                    FROM Product2 
                                    WHERE Is_car__c =: TRUE ];
        Test.startTest();
            List<DataTableCarsController.wrapperProducts> listProducts = DataTableCarsController.getProductsWithFile(lstProd);
            System.assertEquals(1, listProducts.size());
        Test.stopTest();
    }

    @isTest 
    static void getProductsRefreshTest() {
        Test.startTest();
            List<DataTableCarsController.wrapperProducts> listProducts = DataTableCarsController.getProductsRefresh();
            System.assertEquals(1, listProducts.size());
        Test.stopTest();
    }

    @isTest 
    static void getValuesPicklistTest(){
        Test.startTest();
            PicklistWrapper.wrapperListPL wrpPickList = DataTableCarsController.getValuesPicklist();
            System.assert(wrpPickList != null);
        Test.stopTest();
    }

    @isTest 
    static void searchProductsTest() {
        Test.startTest();
            List<DataTableCarsController.wrapperProducts> listProducts = DataTableCarsController.searchProducts('Suv','Audi','2022');
            System.assertEquals(1, listProducts.size());
        Test.stopTest();
    }
}