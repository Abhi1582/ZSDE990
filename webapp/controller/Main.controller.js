sap.ui.define([
    'com/renesas/zsde990/js/Common',
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator'

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Common, Controller, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("com.renesas.zsde990.controller.Main", {
            onInit: function () {
                this.Common = new Common();
                this.VMRef = this.getOwnerComponent().getModel('VMRef');
                this.VMRef.setSizeLimit('5000000');
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
                var dateFormatted = dateFormat.format(new Date());
                this.VMRef.getData().oa = {
                    InvNo: '',
                    Material: '',
                    LiscNo1: '',
                    ValidFrom: '',
                    ValidTo: '',
                    EmpNo: null,
                    selTab: 'list',
                    ITBExpanded: true,
                    listTblIdx: -1,
                    assign_Enabled: false,
                    addressFilterVal: null,
                    editEnable: false
                };
                this.oa = this.VMRef.getData().oa;
                this.Common.getAddressData(this, '*');

            },
            onSearch: function (oEvent) {
                this.getData();
            },

            getData: function () {
                let that = this;
                var aFilters = this.getFBFilters();
                let getPromise = $.Deferred();
                this.VMRef.getData().EmpList = [];
                this.getOwnerComponent().getModel('mainService').read("/TOOLDBSet", {
                    filters: aFilters,
                    success: function (oData, oResponse) {
                        that.VMRef.getData().EmpList = oData.results;
                        that.VMRef.refresh();
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
                }, this));
            },
            handleChange: function (oEvent) {
                var sFrom = oEvent.getParameter("from"),
                    sTo = oEvent.getParameter("to");
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyy/MM/dd" });
                var dateFormattedsFrom = dateFormat.format(sFrom);
                var dateFormattedsTo = dateFormat.format(sTo);
                this.VMRef.getData().oa.ValidFrom = dateFormattedsFrom;
                this.VMRef.getData().oa.ValidTo = dateFormattedsTo;
                this.VMRef.refresh();


            },
            getFBFilters: function () {
                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("InvNo", sap.ui.model.FilterOperator.EQ, this.oa.InvNo));
                aFilters.push(new sap.ui.model.Filter("Material", sap.ui.model.FilterOperator.EQ, this.oa.Material));
                aFilters.push(new sap.ui.model.Filter("LicenseNo1", sap.ui.model.FilterOperator.EQ, this.oa.LiscNo1));
                aFilters.push(new sap.ui.model.Filter("InvDate2", sap.ui.model.FilterOperator.BT, this.VMRef.getData().oa.ValidFrom, this.VMRef.getData().oa.ValidTo));
                return aFilters;
            },

            onRC: function (e) {
                this.mIndex = e.getParameter('rowContext').sPath.split('/').pop();
                var oData = this.VMRef.getData()['EmpList'][this.mIndex];
                if (e.getSource().getSelectedIndex() > '0' || e.getSource().getSelectedIndex() == '0') {
                    this.VMRef.getData().oa.editEnable = true;
                } else {
                    this.VMRef.getData().oa.editEnable = false;
                }
                this.VMRef.getData().EditData = [];
                this.VMRef.getData().EditData = oData;
                this.VMRef.refresh();
            },

            onDataEdit: function () {
                this.getOwnerComponent().getRouter().navTo("editInv");

            },

            getAddressData: function (iFilterVal) {
                let that = this;
                var aFilters = [];
                aFilters.push(new sap.ui.model.Filter("Cst", sap.ui.model.FilterOperator.EQ, iFilterVal));
                let getPromise = $.Deferred();
                this.VMRef.getData().AddressList = [];
                this.getOwnerComponent().getModel().read("/FUZZYSet", {
                    filters: aFilters,
                    success: function (oData, oResponse) {
                        that.VMRef.getData().AddressList = oData.results;
                        that.VMRef.refresh();
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
                }, this));
            },

            onBRT: function(){
                let st = this.byId('stToolDBId');
                let table = st.getTable();
                let aCols = table.getColumns();
                for (var i = 0; i < aCols.length; i++) {
                    let oCol = aCols[i];
                    oCol.getLabel().setWrapping(true);
                    let colId = oCol.getId().split('-').pop();
                    switch (colId) {
                        case 'InvNo':
                            oCol.setLabel('Invoice');
                            break;
                        case 'Material':
                            oCol.setLabel('Material');
                            break;
                        case 'ActualVer':
                            oCol.setLabel('Actual Version');
                            break;

                        default:
                            oCol.setWidth('10rem');
                            break;
                    }
                }
            },

            /**
             * let path = st.getTable().getContextByIndex(2).getPath();
             * let xData = st.getModel().getProperty(path);
             * @param {*} e 
             */
            onNewEdit: function(e){
                let st = this.byId('stToolDBId');
                let si = st.getTable().getSelectedIndices();
                if(si.length == 0){
                    sap.m.MessageToast.show('Select a row');
                }else{
                    let index = st.getTable().getSelectedIndices()[0];
                    let data = st.getTable().getContextByIndex(index).getObject();
                    this.VMRef.getData().EditData = data;
                    if(this.VMRef.getData().EditData.archive1){
                        this.VMRef.getData().oa.editEnable= false;
                    }else{
                        this.VMRef.getData().oa.editEnable= true;
                    }
                    this.Common.getAddressData(this, '*');
                    this.VMRef.refresh();
                    this.getOwnerComponent().getRouter().navTo("editInv");
                    console.log('test');
                }
                
            },

        });
    });
