sap.ui.define([
	"./BaseController",
	"../utils/formatter"
],
	function (BaseController, formatter ) {
		"use strict";
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
