sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
],
    function (Controller, Fragment, JSONModel, MessageBox) {
        "use strict";

        return Controller.extend("com.sld.managesalesorder.controller.SalesOrder", {
            onInit: function () {

                this.i18nModel = this.getOwnerComponent().getModel("i18n");

                this.getRouter().getRoute("RouteSalesOrder").attachPatternMatched(this.onRouteMatchSalesOrder, this);

                // var aData ={"results": [{
                //     SalesOrderID: "101",
                //     CustomerName: "Vikas Singh",
                //     LifeCycleStatusDescription: "jjj",
                //     LifeCylceStatus: "Success",
                //     GrossAmount: 123.44,
                //     CurrencyCode: "INR"
                // },
                // {
                //     SalesOrderID: "102",
                //     CustomerName: "Vivek Singh",
                //     LifeCycleStatusDescription: "XYZ",
                //     LifeCylceStatus: "Success",
                //     GrossAmount: 16565.44,
                //     CurrencyCode: "USD"
                // }
                // ]};

                // var oModel = new sap.ui.model.json.JSONModel(aData);

                // var oView = this.getView();
                // oView.setModel(oModel, "salesModel");

                //var oTable = this.byId("idSalesOrders");
                //oTable.setModel(oModel);
                this.getSalesData();

            },

            getSalesData: function () {
                var oResourceBundle = this.i18nModel.getResourceBundle();
                var oModel = this.getOwnerComponent().getModel();
                var oJsonModel = new JSONModel();
                var oView = this.getView();
                oView.setModel(oJsonModel, "salesModel");

                oModel.read("/SalesOrderSet", {
                    success: function (oData, oResponse) {
                        oJsonModel.setData(oData);
                        oJsonModel.setProperty("/salesCount", oResourceBundle.getText("tableHeaderText", [oData.results.length]))

                    }, error: function (oError) {

                    }
                });
            },

            onRouteMatchSalesOrder: function (oArg) {
            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },

            onPressItem: function (oEvent) {
                var oSource = oEvent.getSource();
                var oBindingContext = oSource.getBindingContext("salesModel");
                var sSalesOrderID = oBindingContext.getProperty("SalesOrderID");

                this.getRouter().navTo("RouteSalesOrderDeatil", {
                    salesOrderID: sSalesOrderID
                });
            },

            onPressDeleteRow: function (oEvent) {
                debugger;
                let oBindingContext = oEvent.getSource().getBindingContext("salesModel"),
                    sSalesOrderID = oBindingContext.getProperty("SalesOrderID"),
                     oDataModel = this.getOwnerComponent().getModel();
                oDataModel.remove(`/SalesOrderSet('${sSalesOrderID}')`, {
                    success: function (oData, oResponse) {
                            sap.m.MessageToast.show(`Sales Odrer - ${sSalesOrderID} is deleted`); //template literal
                            this.getSalesData();
                        }.bind(this), error: function (oError) {
                            var sMessage = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(sMessage);
                        }
                })
                
            },

            onPresCreateSalesOrder: function () {
                var oView = this.getView();
                if (!this.createSales) {
                    this.createSales = Fragment.load({
                        name: "com.sld.managesalesorder.view.fragment.CreateSalesOrder",
                        type: "XML",
                        id: oView.getId(),
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                var oModel = new JSONModel({
                    salesID: "",
                    custID: "",
                    custName: "",
                    grossAmount: "",
                    netAmount: "",
                    currCode: ""
                });
                oView.setModel(oModel, 'salesOrderCreate');

                this.createSales.then(function (oDialog) {
                    oDialog.open();
                }).catch(function (oError) {

                });
            },

            onPressCancel: function () {
                this.createSales.then(function (oDialog) {
                    oDialog.close();
                });
            },

            onSaveSalesOrder: function () {
                let oModel = this.getView().getModel("salesOrderCreate"),
                    oData = oModel.getData(),
                    oPayload,
                    oDataModel = this.getOwnerComponent().getModel();

                if (!oData.salesID || !oData.custID) {
                    MessageBox.error("Mandatory field can't be black");
                } else {
                    oPayload = {
                        SalesOrderID: oData.salesID,
                        CustomerID: oData.custID,
                        CustomerName: oData.custName,
                        //GrossAmount: parseFloat(oData.grossAmount),
                        //NetAmount: parseFloat(oData.netAmount),
                        CurrencyCode: oData.currCode
                    };
                    oDataModel.create("/SalesOrderSet", oPayload, {
                        success: function (oData, oResponse) {
                            let sSalesID = oResponse['data'].SalesOrderID;
                            //MessageBox.success("Sales odrer -" + oResponse['data'].SalesOrderID + "is created");
                            MessageBox.success(`Sales Odrer - ${sSalesID} is created`); //template literal

                            this.onPressCancel();
                            this.getSalesData();
                        }.bind(this), error: function (oError) {
                            var sMessage = JSON.parse(oError.responseText).error.message.value;
                            MessageBox.error(sMessage);
                        }
                    })
                }
            }
        });
    });
