public with sharing class SimulatorPageController {
    public SimulatorPageController() {}

    @AuraEnabled(cacheable=true)
    public static wrapperListSimulator getDataMedatadaSimulator() {
        wrapperListSimulator wrpSim = new wrapperListSimulator();
        PicklistWrapper.wrapperListPL wrp = new PicklistWrapper.wrapperListPL();
        List<Cars_simulator__mdt> listCarsSimulator = new List<Cars_simulator__mdt>();

        listCarsSimulator = [SELECT Id, Model_Values__c, Term_values__c, Interest__c FROM Cars_simulator__mdt WHERE Label = 'Default'];
        if(listCarsSimulator.size() > 0){
            wrp.lstPicklistType = PicklistWrapper.createPickListFromList(listCarsSimulator[0].Term_values__c.split(','));
            wrp.lstPicklistModel = PicklistWrapper.createPickListFromList(listCarsSimulator[0].Model_Values__c.split(','));

            wrpSim.wrpPicklist = wrp;
            wrpSim.interest = listCarsSimulator[0].Interest__c;
        }
         
        return wrpSim;
    }

    public class wrapperListSimulator {
        @AuraEnabled public PicklistWrapper.wrapperListPL wrpPicklist {get;set;}
        @AuraEnabled public String interest {get;set;}
    }
}