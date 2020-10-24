// 성훈행님 : 출장비 조회
sap.ui.define([
	"sap/base/Log",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/ui/core/format/DateFormat",
	"sap/ui/thirdparty/jquery"
], function(Log, Controller, JSONModel, MessageToast, DateFormat, jQuery) {
	"use strict";

	return Controller.extend("ExpenseManagement.controller.businessTrip.Perdiemprj", {
		onInit : function() {
			
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "Perdiem");
			
			this.getOwnerComponent().rfcCall("ZB_GET_POSNR", {	// 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
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