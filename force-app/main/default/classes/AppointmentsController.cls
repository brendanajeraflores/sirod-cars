public with sharing class AppointmentsController {
    public AppointmentsController() {}

    @AuraEnabled(cacheable=true)
    public static List<Lead> getLeads() {
        List<Lead> listLeads = new List<Lead>();

        listLeads = [SELECT Id, LastName, FirstName, Company, Email, State__c FROM Lead 
        WHERE CreatedDate > 2022-02-20T01:02:03Z];
        
        return listLeads;
    }
}