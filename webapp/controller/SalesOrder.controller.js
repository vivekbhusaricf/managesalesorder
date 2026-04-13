sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/Fragment"
],
    function (Controller, Fragment) {
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
                var oJsonModel = new sap.ui.model.json.JSONModel();
                var oView = this.getView();
                oView.setModel(oJsonModel, "salesModel");

                oModel.read("/SalesOrderSet", {
                    success: function(oData, oResponse) {
                        oJsonModel.setData(oData);
                        oJsonModel.setProperty("/salesCount",  oResourceBundle.getText("tableHeaderText", [oData.results.length]))
                       
                    }, error: function (oError) {

                    }
                });
            },

            onRouteMatchSalesOrder: function (oArg) {
            },

            getRouter: function () {
                return sap.ui.core.UIComponent.getRouterFor(this);
            },

            onPressItem: function(oEvent) {
                var oSource = oEvent.getSource();
                var oBindingContext = oSource.getBindingContext("salesModel");
                var sSalesOrderID = oBindingContext.getProperty("SalesOrderID");

                this.getRouter().navTo("RouteSalesOrderDeatil", {
                    salesOrderID: sSalesOrderID
                });
            },

            onPressButton: function (oEvent) {
                debugger;
            },

            onPresCreateSalesOrder: function() {
                var oView = this.getView();
                if(!this.crateSales) {
                    this.crateSales = Fragment.load({
                    name:"com.sld.managesalesorder.view.fragment.CreateSalesOrder",
                    type:"XML",
                    id:oView.getId(),
                    controller: this 
                    }).then(function(oDialog) {
                        return oDialog;
                    });
                }
               
                this.crateSales.then(function(oDialog) {
                    oDialog.open();
                }).catch( function(oError) {

                });
            },

            onPressCancel: function () {
                this.crateSales.then(function(oDialog) {
                    oDialog.close();
                });
            }
        });
    });
