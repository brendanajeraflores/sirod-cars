@isTest
public with sharing class PicklistWrapperTest {
    
    @isTest 
    static void createPickListFromPLTest() {
        Schema.DescribeFieldResult objFieldType = Product2.Type__c.getDescribe();
        List<Schema.PicklistEntry> lstPickListValuesType = objFieldType.getPickListValues();
        Test.startTest();
            List<PicklistWrapper.wrpPickList> listWrp = PicklistWrapper.createPickListFromPL(lstPickListValuesType);
            System.assertEquals(3, listWrp.size());
        Test.stopTest();
    }

    @isTest 
    static void createPickListFromListTest() {
        List<String> lstValuesString = new List<String>{'test1', 'test2'};
        Test.startTest();
            List<PicklistWrapper.wrpPickList> listWrp = PicklistWrapper.createPickListFromList(lstValuesString);
            System.assertEquals(3, listWrp.size());
        Test.stopTest();
    }

}