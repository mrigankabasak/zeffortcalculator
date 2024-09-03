sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/routing/History",
	"../utils/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, History, formatter, Filter, FilterOperator) {
	"use strict";
	return Controller.extend("com.zeffortcalculator.controller.BaseController", {
		formatter: formatter,
		getRouter: function () {
			return this.getOwnerComponent().getRouter();
		},

		getOwnerModel: function (sName) {
			return this.getOwnerComponent().getModel(sName);
		},

		setOwnerModel: function (oModel, sName) {
			return this.getOwnerComponent().setModel(oModel, sName);
		},

		getResourceBundle: function () {
			return this.getOwnerComponent().getModel("i18n").getResourceBundle();
		},

		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();

			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("Home", {}, false);
			}
		},

		createFilter: function (path, value) {
			return new Filter({
				path: path,
				operator: FilterOperator.EQ,
				value1: value
			});
		},

		callBackEnd: function (sEntitySet, sAction, aFilter, oPayLoad, oUrlParameters) {
			switch (sAction) {
				case "GET":
					return new Promise((resolve, reject) => {
						this.getOwnerModel().read(sEntitySet, {
							filters: aFilter,
							urlParameters: oUrlParameters,
							success: function (oData, oResponse) {
								resolve(oResponse);
							},
							error: function (error) {
								reject(error);
							}
						});

					});
					break;
				case "POST":
					return new Promise((resolve, reject) => {
						this.getOwnerModel().create(sEntitySet, oPayLoad, {
							success: function (oData, oResponse) {
								resolve(oResponse);
							},
							error: function (e, oResponse) {
								reject(e);
							}
						});

					});
					break;
				default:
					break;
			}
		},

		onHome: function () {
			this.getRouter().navTo("Home", {}, false);
		}
	});
});