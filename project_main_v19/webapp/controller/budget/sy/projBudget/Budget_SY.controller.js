sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	
], function(Controller, MessageToast, Fragment, UIComponent, MessageBox, History, JSONModel, Filter, FilterOperator) {
	"use strict";
	
	return Controller.extend("ExpenseManagement.controller.budget.sy.projBudget.Budget_SY", {

		onInit : function(){
			
			this.getView().setModel(new JSONModel({
				info : [],
				detail : []
			}),"projectinitsun"); 

			//rfc call
			this.viewRfc();

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.onFilter, this);
			this._oRouter.attachRouteMatched(this.viewRfc, this);
		},

		viewRfc : function(){
			//rfc call
			var oModel = this.getView().getModel("projectinitsun")
			var AUCODE = this.getOwnerComponent().getCookiy("AUCODE");
			var EMPNO = this.getOwnerComponent().getCookiy("EMPNO");

			this.getOwnerComponent().rfcCall("ZB_GET_PVIEW", {  
				I_AUCODE : AUCODE,
				I_EMPNO : EMPNO
			}).done(function(oResultData){
				// RFC호출 완료
				console.log(oResultData.ZBPTAB);
				oModel.setProperty("/info", oResultData.ZBPTAB);
			}).fail(function(sErrorMessage){
				// 호출 실패
				alert(sErrorMessage);
			});
		},
		
		onFilter : function (oEvent) {
			var oModel = this.getView().getModel("projectinitsun")
			var searchInfoPname = oModel.getProperty("/searchInfoPname");
			var searchInfoAuname = oModel.getProperty("/searchInfoAuname");
			var searchInfoPyname = oModel.getProperty("/searchInfoPyname");

			var aFilter = [];
			//프로젝트명
			if( searchInfoPname ){
				aFilter.push(new Filter("PNAME", FilterOperator.Contains, searchInfoPname));
			}
			//프로젝트 매니저
			if( searchInfoAuname ){
				aFilter.push(new Filter("AUNAME", FilterOperator.Contains, searchInfoAuname));
			}
			//담당자
			if( searchInfoPyname ){
				aFilter.push(new Filter("PYNAME", FilterOperator.Contains, searchInfoPyname));
			}
			
			//Filter
			var oList = this.byId("projectlistsun");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		
		onGoDetail : function(oEvent) {
			//col 데이터 set
			var data = oEvent.getSource().getBindingInfo("text").binding.getPath()
			console.log(data)
			var adata = data.split('-');
			var colData = adata[0].replace("__link", "");

			var oModel = this.getView().getModel("projectinitsun");
			var sPath = oEvent.getSource().getBindingContext("projectinitsun").getPath();
			var oSelectedData = oModel.getProperty(sPath);
			var PCODE = oSelectedData.PCODE
			var DetailData = [colData, PCODE]
			var aDetailData = DetailData.join();

			
			if(PCODE) {
					var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("ProjDetail", {
					aDetailData : aDetailData
				}, true);
				} 

			}
	})
})

