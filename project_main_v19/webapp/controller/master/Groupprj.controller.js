// 성훈 행님 : 조직정보 마스터
sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/thirdparty/jquery",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Log, Controller, JSONModel, MessageToast, DateFormat, jQuery, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("ExpenseManagement.controller.KSH.Groupprj", {
		onInit : function() {
			
			var oModel = new JSONModel({currency: "KRW"});
			this.getView().setModel(oModel, "GROUP");
			
			this.getOwnerComponent().rfcCall("ZB_GET_GCODE", {	// 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
				//RFC Import 데이터

			}).done(function(oResultData){	// RFC호출 완료
				for (var i=0; i<oResultData.T_TAB1.length; i++) {
					if (oResultData.T_TAB1[i].MDATE === "0000-00-00") {
						oResultData.T_TAB1[i].MDATE = "0";
					}
						oModel.setData(oResultData);
				}	
			}).fail(function(sErrorMessage){
				alert(sErrorMessage)
			});
		}
		
		
	});
	
});