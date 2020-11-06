//정은혜 : 부서별 예산 조회
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
	
	return Controller.extend("ExpenseManagement.controller.budget.DepartmentBudgetList", {
	   
	//Initialization
	   onInit : function() {
		  var oData = {
			 DepartmentBudget : [],
			 DepartmentInfo : [{
				GCODE : "ALL",
				GNAME : "ALL"
			 }],
			 filterbar : {
				gname : "",
				gcode : "",
				empno : "",
				ename : ""
			 }
		  };
		  //Model Setting
		  var oModel = new JSONModel(oData);
		  this.getView().setModel(oModel, "BUDGET");
		  //RFC Call
		   this.depComboDataCall();
		   //Date Setting
		  var sTearDate = new Date();
		  
		  this.getView().getModel("BUDGET").setProperty("/filterbar/GCODE", "ALL");
		  this.getView().getModel("BUDGET").setProperty("/dateData", sTearDate);
		  this.getView().getModel("BUDGET").setProperty("/filterbar/ename", "");
		  //Route 
		  this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.onAfterRendering, this);
	   },
 
	   onAfterRendering : function(){
		  this.onFilterSearch();
	   },
	
	//Filtering 
	   onFilterSearch : function(oEvent) {
		  //날짜 변수 / rfc 변수 
		  var BModel = this.getView().getModel("BUDGET");
		  var dateData = BModel.getProperty("/dateData");
		  var yearyyyy = dateData.getFullYear();
		  var monthmm = dateData.getMonth()+1 >= 10 ? dateData.getMonth()+1 : "0"+(dateData.getMonth()+1);
		  var ymyyyymm = yearyyyy+monthmm.toString();
		  var that = this;
			 
		  var GcodeData = this.getView().getModel("BUDGET").getProperty("/filterbar/gname");
		  if(GcodeData === "ALL"){
			 GcodeData = "";
		  }
		  
		  //Budget RFC Call 
		  this.getOwnerComponent().rfcCall("ZB_BUDGET_DEPA", {  
			 // 본인이 호출하고 싶은 RFC명 입력. 
			 I_BUDYM : ymyyyymm,
			 I_GCODE : GcodeData                                                       
		   }).done(function(oResultData) {   
			  // RFC 호출 완료
			 console.log(oResultData);
			 BModel.setProperty("/DepartmentBudget", oResultData.T_DEPBU);
		   }).fail(function(sErrorMessage) { 
			  // 호출 실패
			 alert(sErrorMessage);
		   }).then(function() {
			 // RFC 호출 후 작업코딩
			 BModel.refresh();
			 that.getView().byId("ToolbarId").setVisible(true);
			 that.getView().byId("dbudgetlist").removeSelections();
			 var DepartmentBudget = BModel.getProperty("/DepartmentBudget");
			 
			 //Date Format
			 for(var i=0; i<DepartmentBudget.length; i++){
				var budym = DepartmentBudget[i].BUDYM;
				var yyyy = budym.substring(0,4);
				var mm = budym.substring(4);
				BModel.setProperty("/DepartmentBudget/" + i + "/BUDYM", yyyy + "-" + mm);
			 }
			 
			 //예산 합계 
			 var sumData = 0;
			 for(var i = 0 ; i < DepartmentBudget.length ; i++){
				sumData += parseInt(DepartmentBudget[i].DEPPR);
			 }
			 BModel.setProperty("/sumData", sumData);
			 BModel.setProperty("/currency", "KRW");
		   });
	   },
			 
	//Department Info RFC Call         
	   depComboDataCall : function(){
		  var oModel = this.getView().getModel("BUDGET");
		  var DepartmentInfo = oModel.getProperty("/DepartmentInfo");
		  // 호출하고 싶은 RFC명 입력
		  this.getOwnerComponent().rfcCall("ZB_GCODE_96", {  
		   }).done(function(oResultData) {   
			  // RFC 호출 완료
			 for(var i=0 ;  i < oResultData.T_ZBMDT0020.length ; i++){
			  DepartmentInfo.push(oResultData.T_ZBMDT0020[i]);
			 }
		   }).fail(function(sErrorMessage){
			  // 호출 실패
			 alert(sErrorMessage);
		   }).then(function(){
			 oModel.refresh();
		   });
	   },
	
	//Search Filter   
	   onLiveChange : function() {
		  var searchData = this.getView().getModel("BUDGET").getProperty("/filterbar/eName");
			 var aFilter = [];
			 
		  if (searchData) {
			 aFilter.push(new Filter("ENAME", FilterOperator.Contains, searchData));
		  }
 
		  //Filter Binding
		  var oList = this.byId("dbudgetlist");
		  var oBinding = oList.getBinding("items");
		  oBinding.filter(aFilter);
		  var DepartmentBudget = this.getView().getModel("BUDGET").getProperty("/DepartmentBudget");
		  var sumData = 0;
		  
		  for(var i=0 ; i < DepartmentBudget.length ; i++){
			 if(DepartmentBudget[i].ENAME.
			 indexOf(searchData)!== -1){
				sumData += parseInt(DepartmentBudget[i].DEPPR);
			 }
		  }
		  this.getView().getModel("BUDGET").setProperty("/sumData", sumData);
	   },
	
	//Detail View로 이동   
	   onDetail : function(event) {
		  var pathData = event.oSource.oBindingContexts.BUDGET.sPath;
		  var GCODE = this.getView().getModel("BUDGET").getProperty(pathData+"/GCODE");
		  var STATUS = this.getView().getModel("BUDGET").getProperty(pathData+"/STATUS");
		  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		  
		  oRouter.navTo("DEPBUDDETAIL_EH", {
			 DATA : GCODE+","+STATUS
		  });
		}
	});
 });