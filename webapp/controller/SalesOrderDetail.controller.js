sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    function (Controller) {
        "use strict";

        return Controller.extend("com.sld.managesalesorder.controller.SalesOrderDetail", {
            onInit: function () {
                sap.ui.core.UIComponent.getRouterFor(this).getRoute("RouteSalesOrderDeatil").attachPatternMatched(this.onRouteMatchSalesOrderDeatil, this);
                
            },

            onRouteMatchSalesOrderDeatil: function (oArg) {
                debugger;

                var sSalesOrderID = oArg.getParameter("arguments").salesOrderID;

                //expanded entity

                this.getSalesItems(sSalesOrderID);


            },

            getSalesItems: function (salesID) {
                var oSimpleForm = this.byId("idSimpleFormBusinessPartner");
                var oModel = this.getOwnerComponent().getModel();
                var oJsonModel = new sap.ui.model.json.JSONModel();
                var oView = this.getView();
                oView.setModel(oJsonModel, "salesDetailsModel");

                oModel.read("/SalesOrderSet('"+salesID+"')", {
                    urlParameters: {
                        $expand: "ToLineItems,ToBusinessPartner"
                    },
                    success: function(oData, oResponse) {
                        oData.itemCountVivek =  oData.ToLineItems.results.length ;
                       oJsonModel.setData(oData);

                       oSimpleForm.bindElement("salesDetailsModel>/ToBusinessPartner");
                       
                    }, error: function (oError) {
                        debugger;
                    }
                });

            },

            onPressBack: function() {
                debugger;
                sap.ui.core.UIComponent.getRouterFor(this).navTo("RouteSalesOrder");
            }
        });
    });
