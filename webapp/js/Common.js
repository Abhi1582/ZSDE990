sap.ui.define([
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
], function(Controller, Filter, FilterOperator) {
    
    return Controller.extend('com.renesas.zsde990.js.Common', {

        getAddressData: function(ocThis, iFilterVal){
            let that = ocThis;
            let VMRef = ocThis.getOwnerComponent().getModel('VMRef');
            var aFilters = [];
            aFilters.push(new Filter("Cst", FilterOperator.EQ, iFilterVal));
            let getPromise = $.Deferred();
            VMRef.getData().AddressList = [];
            ocThis.getOwnerComponent().getModel().read("/FUZZYSet", {
                filters: aFilters,
                success: function (oData, oResponse) {
                    //sap.ui.core.BusyIndicator.hide();
                    VMRef.getData().AddressList = oData.results;
                    VMRef.refresh();
                    getPromise.resolve();
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    getPromise.reject();
                }
            });
            Promise.all(
                [
                    getPromise
                ]
            ).then($.proxy(function () {
                // this.setC();
            }, ocThis));

        }
    });
});