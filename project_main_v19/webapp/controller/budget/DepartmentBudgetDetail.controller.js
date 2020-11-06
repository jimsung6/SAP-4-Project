//정은혜 : 부서별 예산 조회 디테일 뷰 컨트롤러
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
  
   return Controller.extend("ExpenseManagement.controller.budget.DepartmentBudgetDetail", {
	  
	//Back Button 
	  onNavBack : function() {
			  window.history.go(-1);
			  this.byId("BUDGET").clearSelection(true);
		},
	
	//Initialization    
	   onInit: function() {
		  // Model Setting 
		  this.getView().setModel(new JSONModel({
			 depdetailTableData : []
		  }), "depdetailModel");
	   
		  //Detail View 호출
		 var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 oRouter.getRoute("DEPBUDDETAIL_EH").attachPatternMatched(this._onObjectMatched, this);
	   },
	
	//Detail Dialog Open 
	   open : function(oEvent){
			var oView = this.getView();
		 var oModel = oView.getModel("depdetailModel");
		 var sPath = oEvent.getSource().getBindingContext("depdetailModel").getPath();
		 var oSelectData = oModel.getProperty(sPath);
	   
		 //요청사유    
		 oModel.setProperty("/RTREQ", oSelectData.RTREQ);
		   
		   //Create Dialog 
		   if(!oView.byId("departmentbudgetdialog")) {
			  var oFragmentController = {
					//닫기 Event
					onCloseDialog : function(){
					   oModel.setProperty("/RTREQ", "");
					   oView.byId("departmentbudgetdialog").close();
					}
			  };
			  //Load XML Fragment
			  Fragment.load({
				 id: oView.getId(),
				 name: "ExpenseManagement.view.budget.DepartmentBudgetDialog",
				 controller : oFragmentController
			  }).then(function(oDialog){
				 oView.addDependent(oDialog);
				 oDialog.open();
					   
			  });
			  Fragment.load().then();
		   } else {
			  oView.byId("departmentbudgetdialog").open();
		   }
		},
		
	   _onObjectMatched: function (oEvent) {
		 if(oEvent.mParameters){
		   var DATA = oEvent.mParameters.arguments.DATA;
		   var realData = DATA.split(",");
		   this.getView().getModel("depdetailModel").setProperty("/GCODE", realData[0]);
		   this.getView().getModel("depdetailModel").setProperty("/STATUS", realData[1]);
		   this.callDetailRFC();
		 }
	   },
	   
	//RFC 호출   
	   callDetailRFC : function() {
			var oModel = this.getView().getModel("depdetailModel");
			var i_gcode = oModel.getProperty("/GCODE");
			var i_status = oModel.getProperty("/STATUS");
			var sumData = 0;
			//호출하고 싶은 RFC명 입력   
			this.getOwnerComponent().rfcCall("ZB_BUDGET_DEPA_DETAIL", {   
			   //RFC Import Parameter
			  I_GCODE : i_gcode,
			  I_STATUS : i_status
		   }).done(function(oResultData){   
			  // RFC호출 완료
			  oModel.setProperty("/depdetailTableData", oResultData.T_DEPBUDDE);
		   
		  for(var i = 0 ; i < oModel.getProperty("/depdetailTableData").length ; i++){
			 if(oModel.getProperty("/depdetailTableData/" + i + "/DEPEM") === 'X') {
				//긴급여부 체크 시 빨간색 
				oModel.setProperty("/depdetailTableData/" + i + "/Depembtn", "#dc1313");
			 } else {
				oModel.setProperty("/depdetailTableData/" + i + "/Depembtn", "#1C4C98");
			 }
				sumData += parseInt(oModel.getProperty("/depdetailTableData/" + i + "/TREBUD"));
		   }
		   
		   oModel.setProperty("/sumData", sumData);
		   oModel.setProperty("/currency", "KRW");
		   oModel.refresh();
			  
		   }).fail(function(sErrorMessage) {
			  // 호출 실패
			 alert(sErrorMessage);
		   });
		 }
	 });
  });