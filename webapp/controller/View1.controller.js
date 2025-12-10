sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/export/Spreadsheet",
    "sap/m/MessageBox"
], (Controller, Spreadsheet, MessageBox) => {
    "use strict";

    return Controller.extend("com.ehs.zehssaftyv2.controller.View1", {
        onInit() {
        },

        onMainSearch01: function (oEvant) {
            var oTable = this.getView().byId("table01");
            oTable.setBusy(false);
            var oSource = oEvant.getSource();
            var filterItems = oSource.getFilterGroupItems();
            var aFilters = [];
            var oFilterFieldsFilled = {
                Risk: false,
                LocationDesc: false
            };

            filterItems.forEach(function (oFilterGroupItem) {
                var oControl = oSource.determineControlByFilterItem(oFilterGroupItem); // safer way
                var aTokens = [];
                var aFilterValues = [];

                if (oControl) {
                    if (oControl.getTokens) {
                        // For token-based controls like MultiInput
                        aTokens = oControl.getTokens();
                        if (aTokens.length) {
                            aTokens.forEach(function (oToken) {
                                var sTokenText = oToken.getKey() || oToken.getText();
                                if (sTokenText) {
                                    aFilterValues.push(sTokenText);
                                }
                            });
                        } else if(oControl.getValue()) {
                            aFilterValues.push(oControl.getValue());
                        }
                    } else if (oControl.getValue) {
                        // For simple input controls
                        var sValue = oControl.getValue();
                        if (sValue) {
                            aFilterValues.push(sValue);
                        }
                    }
                }

                if (aFilterValues.length > 0) {
                    // Create filters for each token value and combine with OR
                    var aTokenFilters = aFilterValues.map(function (sVal) {
                        oFilterFieldsFilled[oFilterGroupItem.getName()] = true;
                        return new sap.ui.model.Filter(
                            oFilterGroupItem.getName(),
                            sap.ui.model.FilterOperator.EQ,
                            sVal
                        );
                    });

                    // Combine tokens filters with OR operator because any token match should qualify
                    var oCombinedFilter = new sap.ui.model.Filter(aTokenFilters, false);
                    aFilters.push(oCombinedFilter);
                }
            });
            if (aFilters.length && (!oFilterFieldsFilled.Risk || !oFilterFieldsFilled.LocationDesc)) {
                oTable.bindRows({
                    path: "RiskService>/RiskSafeySet",
                    filters: aFilters,
                    parameters: {
                        // Optional: Add OData parameters like $expand, $select, etc.
                    }
                });
            } else {
                MessageBox.error("Please select either a Risk ID or a Location to apply the filter");
            }
        },

        onMainSearch02: function (oEvant) {
            var oTable = this.getView().byId("table02");
            oTable.setBusy(false);
            var oSource = oEvant.getSource();
            var filterItems = oSource.getFilterGroupItems();
            var aFilters = [];

            filterItems.forEach(function (oFilterGroupItem) {
                var oControl = oSource.determineControlByFilterItem(oFilterGroupItem); // safer way
                var aTokens = [];
                var aFilterValues = [];

                if (oControl) {
                    if (oControl.getTokens) {
                        // For token-based controls like MultiInput
                        aTokens = oControl.getTokens();
                        if (aTokens.length) {
                            aTokens.forEach(function (oToken) {
                                var sTokenText = oToken.getKey() || oToken.getText();
                                if (sTokenText) {
                                    aFilterValues.push(sTokenText);
                                }
                            });
                        } else if(oControl.getValue()) {
                            aFilterValues.push(oControl.getValue());
                        }

                    } else if (oControl.getValue) {
                        // For simple input controls
                        var sValue = oControl.getValue();
                        if (sValue) {
                            aFilterValues.push(sValue);
                        }
                    }
                }

                if (aFilterValues.length > 0) {
                    // Create filters for each token value and combine with OR
                    var aTokenFilters = aFilterValues.map(function (sVal) {
                        return new sap.ui.model.Filter(
                            oFilterGroupItem.getName(),
                            sap.ui.model.FilterOperator.EQ,
                            sVal
                        );
                    });

                    // Combine tokens filters with OR operator because any token match should qualify
                    var oCombinedFilter = new sap.ui.model.Filter(aTokenFilters, false);
                    aFilters.push(oCombinedFilter);
                }
            });

            oTable.bindRows({
                path: "/ZASPECT_IMPACTSet",
                filters: aFilters,
                parameters: {
                    // Optional: Add OData parameters like $expand, $select, etc.
                }
            });

        },

        onChangeRisk: function (oEvant) {
            var oTable = this.getView().byId("table02");
            oTable.setBusy(true);
        },

        onChangeLocation: function (oEvant) {
            var oTable = this.getView().byId("table02");
            oTable.setBusy(true);
        },

        onChangeRisk01: function (oEvant) {
            var oTable = this.getView().byId("table01");
            oTable.setBusy(true);
        },

        onChangeLocation01: function (oEvant) {
            var oTable = this.getView().byId("table01");
            oTable.setBusy(true);
        },

        onRiskIdValueHelp01: function () {
            if (!this._oRiskid01) {
                if (!this._oRiskid01) {
                    this._oRiskid01 = sap.ui.xmlfragment("com.ehs.zehssaftyv2.view.RiskId01", this);
                    this.getView().addDependent(this._oRiskid01);
                }
                this._oRiskid01.open();
            }
        },

        onRiskSelectAll: function(oEvent) {
            var oList = sap.ui.getCore().byId("itemList01");
            if (oEvent.getParameter("selected")) {
                oList.selectAll();
            } else {
                oList.removeSelections();
            }
        },

        onSearch01: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oList = sap.ui.getCore().byId("itemList01");
            if (oList) {
                var oBinding = oList.getBinding("items");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new sap.ui.model.Filter([
                        new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains, sQuery),
                        new sap.ui.model.Filter("type", sap.ui.model.FilterOperator.EQ, "Safety")
                    ], true)); // OR filter
                }
                oBinding.filter(aFilters);
            }
        },

        onConfirm01: function () {
            var oList = sap.ui.getCore().byId("itemList01");
            if (oList) {
                var aSelectedItems = oList.getSelectedItems();
                var aTokens = [];
                var aSelectedData = aSelectedItems.map(function (oItem) {
                    var oContext = oItem.getBindingContext();
                    var sId = oContext.getProperty("id");

                    // Create a Token for each selected item
                    var oToken = new sap.m.Token({
                        key: sId,
                        text: sId
                    });
                    aTokens.push(oToken);
                });

                var oMultiInput = this.getView().byId("idRiskId01");
                oMultiInput.removeAllTokens();
                oMultiInput.setTokens(aTokens);
            }
            this._oRiskid01.close();
            this._oRiskid01.destroy();
            this._oRiskid01 = null;
            //this.byId("selectDialog").close();
        },

        onCancel01: function () {
            //this.byId("selectDialog").close();
            this._oRiskid01.close();
            this._oRiskid01.destroy();
            this._oRiskid01 = null;
        },

        onRiskIdValueHelp02: function () {
            if (!this._oRiskid02) {
                if (!this._oRiskid02) {
                    this._oRiskid02 = sap.ui.xmlfragment("com.ehs.zehssaftyv2.view.RiskId02", this);
                    this.getView().addDependent(this._oRiskid02);
                }
                this._oRiskid02.open();
            }
        },

        onSearch02: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oList = sap.ui.getCore().byId("itemList02");
            if (oList) {
                var oBinding = oList.getBinding("items");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new sap.ui.model.Filter([
                        new sap.ui.model.Filter("id", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false)); // OR filter
                }
                oBinding.filter(aFilters);
            }
        },

        onConfirm02: function () {
            var oList = sap.ui.getCore().byId("itemList02");
            if (oList) {
                var aSelectedItems = oList.getSelectedItems();
                var aTokens = [];
                var aSelectedData = aSelectedItems.map(function (oItem) {
                    var oContext = oItem.getBindingContext();
                    var sId = oContext.getProperty("id");

                    // Create a Token for each selected item
                    var oToken = new sap.m.Token({
                        key: sId,
                        text: sId
                    });
                    aTokens.push(oToken);
                });

                var oMultiInput = this.getView().byId("idRiskId02");
                oMultiInput.removeAllTokens();
                oMultiInput.setTokens(aTokens);
            }

            this._oRiskid02.close();
            this._oRiskid02.destroy();
            this._oRiskid02 = null;
            //this.byId("selectDialog").close();
        },

        onCancel02: function () {
            //this.byId("selectDialog").close();
            this._oRiskid02.close();
            this._oRiskid02.destroy();
            this._oRiskid02 = null;
        },

        onLocKeyRefValueHelp01: function () {
            if (!this._oLocation01) {
                if (!this._oLocation01) {
                    this._oLocation01 = sap.ui.xmlfragment("com.ehs.zehssaftyv2.view.Location01", this);
                    this.getView().addDependent(this._oLocation01);
                }
                this._oLocation01.open();
            }
        },

        onSearch03: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oList = sap.ui.getCore().byId("itemList03");
            if (oList) {
                var oBinding = oList.getBinding("items");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new sap.ui.model.Filter([
                        new sap.ui.model.Filter("text", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false)); // OR filter
                }
                oBinding.filter(aFilters);
            }
        },

        onConfirm03: function () {
            var oList = sap.ui.getCore().byId("itemList03");
            if (oList) {
                var aSelectedItems = oList.getSelectedItems();
                var aTokens = [];
                var aSelectedData = aSelectedItems.map(function (oItem) {
                    var oContext = oItem.getBindingContext();
                    var sId = oContext.getProperty("text");

                    // Create a Token for each selected item
                    var oToken = new sap.m.Token({
                        key: sId,
                        text: sId
                    });
                    aTokens.push(oToken);
                });

                var oMultiInput = this.byId("idLocation01");
                oMultiInput.removeAllTokens();
                oMultiInput.setTokens(aTokens);
            }
            this._oLocation01.close();
            this._oLocation01.destroy();
            this._oLocation01 = null;
            //this.byId("selectDialog").close();
        },

        onCancel03: function () {
            //this.byId("selectDialog").close();
            this._oLocation01.close();
            this._oLocation01.destroy();
            this._oLocation01 = null;
        },

        onLocKeyRefValueHelp02: function () {
            if (!this._oLocation02) {
                if (!this._oLocation02) {
                    this._oLocation02 = sap.ui.xmlfragment("com.ehs.zehssaftyv2.view.Location02", this);
                    this.getView().addDependent(this._oLocation02);
                }
                this._oLocation02.open();
            }
        },

        onSearch04: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oList = sap.ui.getCore().byId("itemList04");
            if (oList) {
                var oBinding = oList.getBinding("items");
                var aFilters = [];

                if (sQuery && sQuery.length > 0) {
                    aFilters.push(new sap.ui.model.Filter([
                        new sap.ui.model.Filter("text", sap.ui.model.FilterOperator.Contains, sQuery)
                    ], false)); // OR filter
                }
                oBinding.filter(aFilters);
            }
        },

        onConfirm04: function () {
            var oList = sap.ui.getCore().byId("itemList04");
            if (oList) {
                var aSelectedItems = oList.getSelectedItems();
                var aTokens = [];
                var aSelectedData = aSelectedItems.map(function (oItem) {
                    var oContext = oItem.getBindingContext();
                    var sId = oContext.getProperty("text");

                    // Create a Token for each selected item
                    var oToken = new sap.m.Token({
                        key: sId,
                        text: sId
                    });
                    aTokens.push(oToken);
                });

                var oMultiInput = this.getView().byId("idLocation02");
                oMultiInput.removeAllTokens();
                oMultiInput.setTokens(aTokens);
            }
            this._oLocation02.close();
            this._oLocation02.destroy();
            this._oLocation02 = null;
            //this.byId("selectDialog").close();
        },

        onCancel04: function () {
            //this.byId("selectDialog").close();
            this._oLocation02.close();
            this._oLocation02.destroy();
            this._oLocation02 = null;
        },

        // Assuming your table is bound to /AspectImpactSet data in JSONModel or ODataModel
        onExportExcel01: function () {
            var oTable = this.getView().byId("table01");
            var oBinding = oTable.getBinding("rows");
            var aContexts = oBinding.getContexts();

            if (aContexts.length === 0) {
                sap.m.MessageToast.show("No data loaded");
                return;
            }

            // Extract data from contexts
            var aData = aContexts.map(function (oContext) {
                return oContext.getObject();
            });

            var aColumns = [
                { label: "Risk", property: "Risk", type: "string", width: 10, alignment: "Center" },
                { label: "Risk Description", property: "RiskDesc", type: "string", width: 20, alignment: "Left" },
                { label: "Location", property: "LocationDesc", type: "string", width: 20, alignment: "Left" },
                { label: "Hazard Description", property: "HazardDec", type: "string", width: 25, alignment: "Left" },
                { label: "PreLikelihood", property: "PreLikelihood", type: "string", width: 10, alignment: "Center" },
                { label: "PreSeverity", property: "PreSeverity", type: "string", width: 10, alignment: "Center" },
                { label: "PreRisklevel", property: "PreRisklevel", type: "string", width: 10, alignment: "Center" },
                { label: "ContMeasures", property: "ContMeasuresDesc", type: "string", width: 30, alignment: "Left" },
                { label: "Likelihood", property: "Likelihood", type: "string", width: 10, alignment: "Center" },
                { label: "Severity", property: "Severity", type: "string", width: 10, alignment: "Center" },
                { label: "Risklevel", property: "Risklevel", type: "string", width: 10, alignment: "Center" },
                { label: "Specific", property: "Specific", type: "string", width: 15, alignment: "Left" },
                { label: "AdequateCtrl", property: "AdequateCtrl", type: "string", width: 15, alignment: "Left" },
                { label: "IssueDate", property: "IssueDate", type: "date", width: 15, alignment: "Center" },
                { label: "Prepared", property: "Prepared", type: "string", width: 15, alignment: "Left" },
                { label: "ReviewedBy", property: "ReviewedBy", type: "string", width: 15, alignment: "Left" },
                { label: "AcceptedBy", property: "AcceptedBy", type: "string", width: 15, alignment: "Left" }
            ];



            var oSettings = {
                workbook: { columns: aColumns },
                dataSource: aData,
                fileName: "EnvironmentAspects.xlsx"
            };
            var oSpreadsheet = new Spreadsheet(oSettings);
            oSpreadsheet.build().then(() => {
                sap.m.MessageToast.show("Export successful");
            }).finally(() => {
                oSpreadsheet.destroy();
            });
        },

        // Assuming your table is bound to /AspectImpactSet data in JSONModel or ODataModel
        onExportExcel02: function () {
            var oTable = this.getView().byId("table02");
            var oBinding = oTable.getBinding("rows");
            var aContexts = oBinding.getContexts();

            if (aContexts.length === 0) {
                sap.m.MessageToast.show("No data loaded");
                return;
            }

            // Extract data from contexts
            var aData = aContexts.map(function (oContext) {
                return oContext.getObject();
            });

            var aColumns = [
                { label: "RiskId", property: "RiskId", type: "string", width: 10, alignment: "Center" },
                { label: "Location Description", property: "LocKeyRef", type: "string", width: 20, alignment: "Left" },
                { label: "Aspect", property: "Aspect", type: "string", width: 25, alignment: "Left" },
                { label: "Hazard", property: "Hazard", type: "string", width: 45, alignment: "Left" },
                { label: "Impact", property: "Impact", type: "string", width: 45, alignment: "Left" },
                { label: "Consequence", property: "Consequence", type: "string", width: 20, alignment: "Center" },
                { label: "Likelihood", property: "Likelihood", type: "string", width: 10, alignment: "Center" },
                { label: "RiskRating", property: "RiskRating", type: "string", width: 10, alignment: "Center" },
                { label: "Mitigation", property: "Mitigation", type: "string", width: 65, alignment: "Left" },
                { label: "PcrConsequence", property: "PcrConsequence", type: "string", width: 10, alignment: "Center" },
                { label: "PcrLikelihood", property: "PcrLikelihood", type: "string", width: 10, alignment: "Center" },
                { label: "PcrRiskRating", property: "PcrRiskRating", type: "string", width: 10, alignment: "Center" }
            ];


            var oSettings = {
                workbook: { columns: aColumns },
                dataSource: aData,
                fileName: "EnvironmentAspects.xlsx"
            };
            var oSpreadsheet = new Spreadsheet(oSettings);
            oSpreadsheet.build().then(() => {
                sap.m.MessageToast.show("Export successful");
            }).finally(() => {
                oSpreadsheet.destroy();
            });
        }


    });
});