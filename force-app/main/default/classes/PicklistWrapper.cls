public with sharing class PicklistWrapper {
    public class wrapperListPL {
        @AuraEnabled public List<wrpPickList> lstPicklistType {get;set;}
        @AuraEnabled public List<wrpPickList> lstPicklistBrand {get;set;}
        @AuraEnabled public List<wrpPickList> lstPicklistModel {get;set;}
        
    }

    public class wrpPickList{
        @AuraEnabled public String label {get;set;}
        @AuraEnabled public String value {get;set;}
    }

    public static List<PicklistWrapper.wrpPickList> createPickListFromPL(List<Schema.PicklistEntry> lstPickListValues){
        List<PicklistWrapper.wrpPickList> lstWrpPickList = new List<PicklistWrapper.wrpPickList>();
        PicklistWrapper.wrpPickList wrpN = new PicklistWrapper.wrpPickList();
        wrpN.label = '--None--';
        wrpN.value = 'none';
        lstWrpPickList.add(wrpN);

        for (Schema.PicklistEntry objPickList : lstPickListValues) {
            PicklistWrapper.wrpPickList wrp = new PicklistWrapper.wrpPickList();
            wrp.label = objPickList.getLabel();
            wrp.value = objPickList.getValue();
            lstWrpPickList.add(wrp);
        }

        return lstWrpPickList;
    }

    public static List<PicklistWrapper.wrpPickList> createPickListFromList(List<String> lstPickListValues){
        List<PicklistWrapper.wrpPickList> lstWrpPickList = new List<PicklistWrapper.wrpPickList>();
        PicklistWrapper.wrpPickList wrpN = new PicklistWrapper.wrpPickList();
        wrpN.label = '--None--';
        wrpN.value = 'none';
        lstWrpPickList.add(wrpN);

        for (String objPickList : lstPickListValues) {
            PicklistWrapper.wrpPickList wrp = new PicklistWrapper.wrpPickList();
            wrp.label = objPickList;
            wrp.value = objPickList;
            lstWrpPickList.add(wrp);
        }

        return lstWrpPickList;
    }
}