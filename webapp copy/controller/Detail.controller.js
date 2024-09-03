sap.ui.define([
	"./BaseController",
	"com/zeffortcalculator/model/models",
	"sap/ui/core/routing/History",
	"../utils/formatter",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/Button",
	"sap/m/TextArea",
	"sap/ui/layout/HorizontalLayout",
	"sap/ui/layout/VerticalLayout",
	"sap/m/library",
	"sap/m/Text",
	"sap/m/VBox",
	"sap/m/Label"
],
	function (BaseController, models, History, formatter, MessageBox, Dialog, Button, TextArea, HorizontalLayout, VerticalLayout, mobileLibrary, Text, VBox, Label) {
		"use strict";
		let ButtonType = mobileLibrary.ButtonType;
		let DialogType = mobileLibrary.DialogType;
		return BaseController.extend("com.zeffortcalculator.controller.Detail", {
			formatter: formatter,
			onInit: function () {
				this.getRouter().getRoute("Detail").attachPatternMatched(this.onDetailMatched, this);
				this.getView().byId("detailEdit").setVisible(true);
			},
			onEdit: function (sSaveorEdit) {
				this.getOwnerModel("oModelEstCal").setProperty("/SaveOrEdit", sSaveorEdit);
				this.getRouter().navTo("Calculate", {}, false);
			},
			onSearchCust: function () {
				this.getRouter().navTo("Search", {
					OpportunityId: this.getOwnerModel("oModelEstCal").getProperty("/OpportunityId")
				},false);
			},

			onDetailMatched: function (oEvent) {
				if (this.getView().byId("detailSave"))
					this.getView().byId("detailSave").setVisible(true);
	
				if (oEvent.getParameter("arguments").CustId && oEvent.getParameter("arguments").OpportunityId && oEvent.getParameter("arguments").Version) {
					if (this.getView().byId("detailSave"))
						this.getView().byId("detailSave").setVisible(false);
	
					let filters = [this.createFilter("CustId", oEvent.getParameter("arguments").CustId),
					this.createFilter("OpportunityId", oEvent.getParameter("arguments").OpportunityId),
					this.createFilter("Version", oEvent.getParameter("arguments").Version)
					];
					sap.ui.core.BusyIndicator.show();
					let oDetailData = this.callBackEnd("/zi_hcl_header", "GET", filters, {}, {});
	
					oDetailData.then((oResponse) => {
						let response = oResponse.data;
						this.getOwnerModel("oModelEstCal").setData({});
						this.getOwnerModel("oModelEstCal").setData(response.results[0]);
						sap.ui.core.BusyIndicator.hide();
					}).catch((error) => {
						sap.ui.core.BusyIndicator.hide();
						console.log(error);
					});
				}
			}
			
		});
	});
