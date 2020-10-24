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
	
	return Controller.extend("ExpenseManagement.controller.budget.sy.depBudget.Budget_SY", {
		
		onInit : function(){
			this.getView().setModel(new JSONModel({
				info : []
			}),"teaminitsun");  

			//날짜 모델세팅함수 call
			this.onDateSetting();

			//필터작업
			this.onFilter();

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.onFilter, this);
		},

		/*********************************************
		 * 함수이름 : Date model setting
		 * *******************************************/
		onDateSetting: function(){
			var oComponent = this.getOwnerComponent();
			oComponent.getModel("teaminitsun");

			//초기날짜 세팅
			var oToday = new Date();
			var endDate = (function(){this.setFullYear(this.getFullYear()-1); return this}).call(new Date);
			this.getView().getModel("teaminitsun").setProperty("/startDate", endDate);
			this.getView().getModel("teaminitsun").setProperty("/endDate", oToday);

			},

		/*********************************************
		 * 함수이름 : Datechange event function
		 * *******************************************/
		DateChange : function (oEvent) {
			this.onFilter();
		}, 
		/*********************************************
		 * 함수이름 : Filtering function
		 * *******************************************/
		onFilter : function(){
			//날짜데이터 핸들링
			var oModel = this.getView().getModel("teaminitsun");
			var startDate = oModel.getProperty("/startDate");
			var endDate = oModel.getProperty("/endDate");
			
			var startYear = startDate.getFullYear();
			var startMonth = startDate.getMonth()+1 >= 10 ? startDate.getMonth()+1 : "0"+(startDate.getMonth()+1);

			var endYear = endDate.getFullYear();
			var endMonth = endDate.getMonth()+1 >= 10 ? endDate.getMonth()+1 : "0"+(endDate.getMonth()+1);

			//rfc호출
			var AUCODE = this.getOwnerComponent().getCookiy("AUCODE");
			var EMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			
			this.getOwnerComponent().rfcCall("ZB_GET_TVIEW",{
				I_SFROMYEAR : startYear,
				I_SFROMMONTH : startMonth,
				I_STOYEAR : endYear,
				I_STOMONTH : endMonth,
				I_AUCODE : AUCODE,
				I_EMPNO : EMPNO
			}).done(function(oResultData){
				// RFC호출 완료
				console.log(oResultData.ZBTTAB);
				oModel.setProperty("/info", oResultData.ZBTTAB);
			}).fail(function(sErrorMessage){
				// 호출 실패
				alert(sErrorMessage);
			});

		},

		onGoDetail : function(oEvent) {
			//col 데이터 set
			var data = oEvent.getSource().getBindingInfo("text").binding.getPath()
			console.log(data)
			var adata = data.split('-');
			var colData = adata[0].replace("__link", "");


			var oModel = this.getView().getModel("teaminitsun"),
			 	sPath = oEvent.getSource().getBindingContext('teaminitsun').sPath,
				oSelectedData = oModel.getProperty(sPath),
				GCODE = oSelectedData.GCODE;
				 
			var	that = this

			var startDate = oModel.getProperty("/startDate");
			var endDate = oModel.getProperty("/endDate");
			
			var startYear = startDate.getFullYear();
			var startMonth = startDate.getMonth()+1 >= 10 ? startDate.getMonth()+1 : "0"+(startDate.getMonth()+1);

			var endYear = endDate.getFullYear();
			var endMonth = endDate.getMonth()+1 >= 10 ? endDate.getMonth()+1 : "0"+(endDate.getMonth()+1);

			var DetailData = [colData, GCODE, startYear, startMonth, endYear, endMonth]
			var aDetailData = DetailData.join();
			if(GCODE) {
				var oRouter = UIComponent.getRouterFor(this);
				oRouter.navTo("DepDetail", {
					aDetailData : aDetailData
				}, true);
			}
			},


	})
})