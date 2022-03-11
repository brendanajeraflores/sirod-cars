@isTest
public with sharing class SimulatorPageControllerTest {
    @isTest 
    static void getProductsCarouselTest() {
        Test.startTest();
        SimulatorPageController.wrapperListSimulator wrpSim = SimulatorPageController.getDataMedatadaSimulator();
            System.assert(wrpSim != null);
        Test.stopTest();
    }
}
