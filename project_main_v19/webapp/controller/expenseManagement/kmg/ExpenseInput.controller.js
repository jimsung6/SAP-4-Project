sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function(Controller, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("ExpenseManagement.controller.expenseManagement.kmg.ExpenseInput", {

		// 테이블 안에 들어가는 정보
		onInit : function(){

			this.getView().setModel(new JSONModel({
					globalFilter: "",
					availabilityFilterOn: false,
					cellFilterOn: false,
					comboData: "",
					oPcode : [{
						PCODE : "ALL",
						PNAME : "ALL"
					}],
					tableData : ""
					
			}), "Project_MQ");
			
			this.getView().getModel("Project_MQ").setProperty("/comboData", "ALL");
			this.getView().getModel("Project_MQ").setProperty("/dateData", new Date());
			this.getView().getModel("Project_MQ").setProperty("/stcodComboData", "B");
			this.getView().getModel("Project_MQ").setProperty("/tableData", "a");

		},
		
		onAfterRendering : function(){
			//랜더링후 필터링 처리작업
			this.onFiltering();
			this.onPCodeCall();
		},
		
		onFiltering : function(){
			var oModel = this.getView().getModel("Project_MQ");
			var dateData = oModel.getProperty("/dateData");
			var comboData = oModel.getProperty("/comboData");
			var stcodComboData = oModel.getProperty("/stcodComboData");
			
			var oView = this.byId("ProjectList_MQ"); // this gives you the view
			oView.getController().onFiltering(dateData, comboData, stcodComboData);
		},
		
		onPCodeCall : function(){
			 var oModel = this.getView().getModel("Project_MQ");
			 var oPcodeData = oModel.getProperty("/oPcode");
			 
			this.getOwnerComponent().rfcCall("ZB_PCODE_97", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
		        //RFC Import 데이터
		     }).done(function(oResultData){   // RFC호출 완료
		      for(var i=0 ; i < oResultData.T_ZBMDT0030.length ; i++){
		      		oPcodeData.push(oResultData.T_ZBMDT0030[i])
		      }
		        oModel.refresh();
		        console.log(oResultData)
		     }).fail(function(sErrorMessage){// 호출 실패
		        alert(sErrorMessage);
	    	 });
		},
		
		onSave : function(){
		// console.log("aaa");
		// 	var oModel = this.getView().getModel("Project_MQ");
		// 	var sData = oModel.getProperty("/tableData");
			var oView = this.byId("ProjectList_MQ"); // this gives you the view
			oView.getController().onSave();
		},
	
		onliveChange : function(){
			var fliterData = this.getView().getModel("Project_MQ").getProperty("/SearchFieldData");
			var oView = this.byId("ProjectList_MQ");
			oView.getController().onFilterChange(fliterData);
		},
		onReject : function(){
		// console.log("aaa");
		// 	var oModel = this.getView().getModel("Project_MQ");
		// 	var sData = oModel.getProperty("/tableData");
			var oView = this.byId("ProjectList_MQ"); // this gives you the view
			oView.getController().onReject();
	}
	
	
		
	});
});