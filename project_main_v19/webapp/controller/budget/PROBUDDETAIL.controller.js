sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
		"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
		"sap/ui/model/Filter",
	 "sap/ui/model/FilterOperator"
 ], function(Controller, JSONModel, Fragment ,MessageToast, MessageBox, History, Filter, FilterOperator) {
	"use strict";
 
  return Controller.extend("ExpenseManagement.controller.budget.PROBUDDETAIL", {
	  
	  onNavBack : function() {
				 window.history.go(-1);
				 this.byId("TEST").clearSelection(true);
		 },
		 
	   onInit: function() {
		   
		   this.getView().setModel(new JSONModel({
			   detailTableData : []
		   }), "detailModel");
 
		  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		  oRouter.getRoute("PROBUDDETAIL_MS").attachPatternMatched(this._onObjectMatched, this);
		  
		  
	   },
   
		   open : function(oEvent){
			 var oView = this.getView();
			 var oModel = oView.getModel("detailModel");
			 var sPath = oEvent.getSource().getBindingContext("detailModel").getPath();
			 var oSelectData = oModel.getProperty(sPath);
			 
			 oModel.setProperty("/REQUEST", oSelectData.REQUEST);
			 
			 //create dialog 
			 
			 if(!oView.byId("projectdetailDialog2")) {
				 var oFragmentController = {
						 //닫기 Event
						 onCloseDialog : function(){
							 oModel.setProperty("/REQUEST", "");
							 oView.byId("projectdetailDialog2").close();
						 
						 
						 }
						 
				 };
				 // load asynchronous XML fragment
				 Fragment.load({
					 id: oView.getId(),
					 name: "ExpenseManagement.view.budget.DetailDialog2",
					 controller : oFragmentController
				 }).then(function(oDialog){
					 oView.addDependent(oDialog);
					 oDialog.open();
							 
				 });
				 //Fragment.load().then()
			 } else{
				 oView.byId("projectdetailDialog2").open();
			 }
				 console.log(oFragmentController);
		 
		 },
				 
 
		 
		_onObjectMatched: function (oEvent) {
		  if(oEvent.mParameters){
			 var DATA = oEvent.mParameters.arguments.DATA;
			 
			 var realData = DATA.split(",");
			 this.getView().getModel("detailModel").setProperty("/pcode", realData[0]);
			 this.getView().getModel("detailModel").setProperty("/status", realData[1]);
			 this.callDetailRFC();
	 
		  }
			  
	
		},
		
		
		callDetailRFC : function(){
				var oModel = this.getView().getModel("detailModel");
				var i_pcode = oModel.getProperty("/pcode");
				var i_status = oModel.getProperty("/status");
				
			 var sumData = 0;
			
				this.getOwnerComponent().rfcCall("ZB_BUDGET_PRO_DETAIL", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
				 I_PCODE : i_pcode,
				 I_STATUS : i_status
			 //RFC Import 데이터
			 }).done(function(oResultData){   // RFC호출 완료
			   oModel.setProperty("/detailTableData", oResultData.T_PROBUDE);
			 
			 for(var i = 0 ; i < oModel.getProperty("/detailTableData").length ; i++){
				 
				sumData += parseInt(oModel.getProperty("/detailTableData/"+i+"/REBUD"));
			 }
			 
			 console.log(sumData);
			 
			 oModel.setProperty("/sumData", sumData);
			 oModel.setProperty("/currency", "KRW");
			 
			   oModel.refresh();
			 }).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			 });
				   
		}
  });
  
 });