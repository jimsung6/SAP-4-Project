sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel",
	 "sap/ui/model/Filter",
	 "sap/ui/model/FilterOperator"
 ], function (Controller, MessageToast, JSONModel, Filter, FilterOperator) {
	"use strict";
 
	return Controller.extend("ExpenseManagement.controller.budget.PROBUDLIST", {
	   
	   // 테이블 안에 들어가는 정보
	   onInit : function(){
		  
		var oFilter = this.getView().byId("payFilter"),
		  that = this;
			 var oData = {
				oToday:yesterday,
			 oToday2:new Date(),
			 displayFormat: "yyyy-MM-dd",
				info : [],
				   filterbar: {
						todate: "",
						fromdate: ""
					 
					 }
					 
					 
				 };
				var oModel = new JSONModel(oData);
		  this.getView().setModel(oModel, "TEST");
	// 상태별 필터      
	   //달력 초기 세팅
		  var oDRS = this.byId("DRS");
		  //모델링
		  var yesterday = (function(){this.setMonth(this.getMonth()-6); return this}).call(new Date);
		  oDRS.setDateValue(yesterday);
		  oDRS.setSecondDateValue(new Date());
	
 
 
 
 
 },
			onDetail : function(event){
				
				var pathData = event.oSource.oBindingContexts.TEST.sPath;
				
				var PCODE = this.getView().getModel("TEST").getProperty(pathData+"/PCODE");
				var STATUS = this.getView().getModel("TEST").getProperty(pathData+"/STATUS");
			
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("PROBUDDETAIL_MS", {
					DATA : PCODE+","+STATUS
				});
			
			
			},
			
	   onAfterRendering : function(){
	   //랜더링후 필터링 처리작업
	   this.onFiltering();
	   },
 
	   onFiltering : function(){
	   var oModel = this.getView().getModel("TEST"); 
		  var oFilterData = this.getView().getModel("TEST").getData().filterbar;
				
				if(oFilterData){
				   var sFromDate = oFilterData.fromdate;
				   var sToDate = oFilterData.todate;
 
 		//날짜
  
 
 
	 
	  
				   
				   
 
 
 
 
	   //날짜 데이터 원하는 정보 뽑아오기
			 var odate = this.getView().getModel("TEST").getProperty("/oToday");
					  var odate2 = this.getView().getModel("TEST").getProperty("/oToday2");
					  
 
		  
			 if(odate && odate2){
	
				var sFromDate = new Date(odate);
				var sToDate = new Date(odate2);
		  
				var sFromYear = sFromDate.getFullYear();
				var sFromMonth = sFromDate.getMonth()+1 >= 10 ? sFromDate.getMonth()+1 : "0"+(sFromDate.getMonth()+1);
				var sFromDate = sFromDate.getDate() >= 10 ? sFromDate.getDate() : "0"+sFromDate.getDate();
		  
				var sToYear = sToDate.getFullYear();
				var sToMonth = sToDate.getMonth()+1 >= 10 ? sToDate.getMonth()+1 : "0"+(sToDate.getMonth()+1);
				var sToDate = sToDate.getDate() >= 10 ? sToDate.getDate() : "0"+sToDate.getDate();
		  
				var sFromDateInfo = sFromYear.toString()+"-"+sFromMonth.toString()+"-"+sFromDate.toString();
				var sToDateInfo = sToYear.toString()+"-"+sToMonth.toString()+"-"+sToDate.toString();
			 }
 
 
	 //테이블 필드 내역 
		  this.getView().setModel(oModel, "TEST");
		   this.getOwnerComponent().rfcCall("ZB_BUDGET_PRO", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
				I_SDATE : sFromDateInfo,
				I_EDATE : sToDateInfo
				//RFC Import 데이터
			   
			}).done(function(oResultData){   // RFC호출 완료
			  console.log(oResultData);
			   oModel.setProperty("/info", oResultData.T_PROBU);
			}).fail(function(sErrorMessage){// 호출 실패
			   alert(sErrorMessage);
			}).then(function(){
				   console.log(oModel.getProperty("/info"));
			});
 
	
 
	
	}
 
 }
 
 
 });
 });