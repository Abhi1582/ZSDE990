sap.ui.define([
    'com/renesas/zsde990/js/Common',
    "sap/ui/core/mvc/Controller",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/m/MessageBox",

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Common, Controller, Filter, FilterOperator, MessageBox) {
        "use strict";

        return Controller.extend("com.renesas.zsde990.controller.editInvice", {
            onInit: function () {
                this.Common = new Common();
                this.VMRef = this.getOwnerComponent().getModel('VMRef');
                this.VMRef.getData().aa = {
                    editEnable: false
                };
                this.ea = this.VMRef.getData().ea;
                this.VMRef.refresh();

            },

            onBRTEdit: function (e) {
                let bp = e.getParameter('bindingParams');
                let st = this.byId('editSTId');
                let table = st.getTable();
                let aCols = table.getColumns();
                for (var i = 0; i < aCols.length; i++) {
                    let oCol = aCols[i];
                    oCol.getLabel().setWrapping(true);
                    let colId = oCol.getId().split('-').pop();
                    switch (colId) {
                        case 'Company1':
                            oCol.setWidth('4rem');
                            break;
                        case 'Street':
                            oCol.setWidth('8rem');
                            break;
                        default:
                            oCol.setWidth('10rem');
                            break;
                    }
                }
                let aDefaultFilters = [], oFilters;
                aDefaultFilters.push(new Filter({ filters: [new Filter('Cst', FilterOperator.EQ, '*')], and: true }));
                oFilters = new Filter({ filters: aDefaultFilters, and: true });
                bp.filters.push(oFilters);

            },

            onAddressSearch: function (e) {
                console.log('test');
                let query = e.getParameter('query');
                this.Common.getAddressData(this, query);
            },

            onAddSelection: function (e) {
                this.aIndex = e.getParameter('rowContext').sPath.split('/').pop();
                var oData = this.getOwnerComponent().getModel('VMRef').getData()['AddressList'][this.aIndex];
                this.VMRef.getData().rowData = [];
                this.VMRef.getData().rowData = oData;
                this.VMRef.refresh();

            },

            onAddUpdate: function (e) { 
                this.VMRef.getData().EditData.city = this.VMRef.getData().rowData.City;
                this.VMRef.getData().EditData.company = this.VMRef.getData().rowData.Company;
                this.VMRef.getData().EditData.company1 = this.VMRef.getData().rowData.Company1;
                this.VMRef.getData().EditData.country = this.VMRef.getData().rowData.Country;
                this.VMRef.getData().EditData.street = this.VMRef.getData().rowData.Street;
                this.VMRef.getData().EditData.disti_name = this.VMRef.getData().rowData.DistiName;
                this.VMRef.getData().EditData.person_cd = this.VMRef.getData().rowData.PersonCd;
                this.VMRef.getData().EditData.Person_name = this.VMRef.getData().rowData.PersonName;
                this.VMRef.getData().EditData.person_department = this.VMRef.getData().rowData.PersonDepartment;
                this.VMRef.getData().EditData.person_email = this.VMRef.getData().rowData.PersonEmail;
                this.VMRef.getData().EditData.person_tel = this.VMRef.getData().rowData.PersonTel;
                this.VMRef.getData().EditData.cst_Aaddr = this.VMRef.getData().rowData.Cst;
               // this.VMRef.getData().EditData.cre_date2 = this.VMRef.getData().rowData.CreatedOn1;
                this.VMRef.getData().EditData.zip_Cd = this.VMRef.getData().rowData.ZipCd;
               // this.VMRef.getData().EditData.description = this.VMRef.getData().rowData.SapDescription;
               // this.VMRef.getData().EditData.CreatedOn1 = this.VMRef.getData().rowData.CreatedOn1;
                this.VMRef.refresh();
                
            },

            onCBO: function (e) {
                var oCrossAppNavigator = sap.ushell.Container.getService("CrossApplicationNavigation"); // get a handle on the global XAppNav service
                var hash = (oCrossAppNavigator && oCrossAppNavigator.hrefForExternal({
                    target: {
                        semanticObject: "ZZ1_CSTADR_CDS",
                        action: "create"
                    },
                    params: {
                    }
                })) || "";
                oCrossAppNavigator.toExternal({
                    target: {
                        shellHash: hash
                    }
                });
            },

            onCBO2: function () {
                var ip = null;
                if (location.origin.includes('workspaces')) {
                    ip = "https://sapvs4ap1dev.erp.renesas.com:8443";
                } else {
                    ip = location.origin;
                }
                let furl = ip + "/sap/bc/ui2/flp#ZZ1_CSTADR_CDS-create&/ZZ1_CSTADR(-)/";
                window.open(furl);
            },

            onCancel: function () {
                this.getOwnerComponent().getRouter().navTo('RouteMain');
            },

            onSubmit: function () {
                sap.ui.core.BusyIndicator.show(0);
                var sObj = {
                    Ckey: this.VMRef.getData().EditData.ckey,
                    Archive1: this.VMRef.getData().EditData.archive1,
                    Material: this.VMRef.getData().EditData.material,
                    FirstRel1: this.VMRef.getData().EditData.first_Rel1,
                    LastUpdt1: this.VMRef.getData().EditData.last_updt1,
                    ActualVer: this.VMRef.getData().EditData.actual_ver,
                    Description: this.VMRef.getData().EditData.description,
                    PurchaseVer: this.VMRef.getData().EditData.purchase_ver,
                    CstType: '7X', //this.VMRef.getData().EditData.CstType,
                    CstAaddr: this.VMRef.getData().EditData.cst_Aaddr,
                    Company: this.VMRef.getData().EditData.company,
                    Company1: this.VMRef.getData().EditData.company1,
                    Street: this.VMRef.getData().EditData.street,
                    ZipCd: this.VMRef.getData().EditData.zip_Cd,
                    City: this.VMRef.getData().EditData.city,
                    Country: this.VMRef.getData().EditData.country,
                    PersonCd: this.VMRef.getData().EditData.person_cd,
                    PersonName: this.VMRef.getData().EditData.Person_name,
                    PersonEmail: this.VMRef.getData().EditData.person_email,
                    PersonTel: this.VMRef.getData().EditData.person_tel,
                    PersonDepartement: this.VMRef.getData().EditData.person_department,
                    DistiName: this.VMRef.getData().EditData.disti_name,
                    CreDate2: this.VMRef.getData().EditData.cre_date2,
                    InvDate2: this.VMRef.getData().EditData.inv_date2,
                    InvNo: this.VMRef.getData().EditData.inv_no,
                    InvItm: this.VMRef.getData().EditData.inv_itm,
                    DnNo: this.VMRef.getData().EditData.dn_no,
                    DnItm: this.VMRef.getData().EditData.dn_itm,
                    Qty: this.VMRef.getData().EditData.qty,
                    Comments: this.VMRef.getData().EditData.comments,
                    StartWarrenty1: this.VMRef.getData().EditData.start_warrenty1,
                    LicenseNo1: this.VMRef.getData().EditData.license_no1,
                    LicenseNo2: this.VMRef.getData().EditData.license_no2,
                    LicenseNo3: this.VMRef.getData().EditData.license_no3
                };
                var that = this;
                let model = this.getOwnerComponent().getModel();
                //let sUrl = model.sServiceUrl + '/VendorRequestSet';
                model.create('/TOOLDBSet', sObj, {
                    method: "POST",
                    //url: sUrl,
                    success: function (oData, oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        MessageBox.success("Invoice details updated.", {
                            actions: [MessageBox.Action.OK],
                            emphasizedAction: MessageBox.Action.OK,
                            onClose: function (sAction) {
                                that.getOwnerComponent().getRouter().navTo("RouteMain");
                            }
                        });

                    },
                    error: function (error, oResponse) {
                        sap.ui.core.BusyIndicator.hide();
                        sap.m.MessageToast.show(JSON.parse(error.responseText).error.message.value);
                    }
                });
            }


        });
    });
