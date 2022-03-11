@isTest
public with sharing class FileUploaderClassTest {
    
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

        ContentVersion cv = new ContentVersion();
        cv.VersionData = EncodingUtil.base64Decode('test base64');
        cv.Title = 'testFile';
        cv.PathOnClient = 'testFile';
        insert cv;

        ContentDocumentLink cdl = new ContentDocumentLink();
        cdl.ContentDocumentId = [SELECT ContentDocumentId 
                                FROM ContentVersion 
                                WHERE Id =: cv.Id].ContentDocumentId;
        cdl.LinkedEntityId = pd.Id;
        cdl.Visibility = 'AllUsers';
        cdl.ShareType = 'V';
        insert cdl;

        //String idFile = FileUploaderClass.uploadFile('test base64', 'testFile', pd.Id);
    }

    @isTest 
    static void uploadFileTest() {
        List<Product2> pd = [SELECT Id FROM Product2 LIMIT 1];
        Test.startTest();
            String strFile = FileUploaderClass.uploadFile('test base64', 'testFile', pd[0].Id);
            System.assert(strFile != '');
        Test.stopTest();
    }

    @isTest 
    static void getProductsFilesTest() {
        List<Product2> pd = [SELECT Id FROM Product2 LIMIT 1];
        List<String> lstStr = new List<String>();
        for (Product2 prod : pd) {
            lstStr.add(prod.Id);
        }
        Test.startTest();
            Map<String, String> mapProductFile = FileUploaderClass.getProductsFiles(lstStr);
            System.assert(mapProductFile != null);
        Test.stopTest();
    }
}