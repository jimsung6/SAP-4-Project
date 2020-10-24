sap.ui.define([
	"sap/ui/core/UIComponent"
], function(UIComponent) {
	"use strict";
	return UIComponent.extend("ExpenseManagement.Component", {

		metadata: {
			manifest: "json"
		},
		init: function () {
			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// create the views based on the url/hash
			this.getRouter().initialize();
		},
		/********************************************************************
		 * 함수 내용 : RFC함수 콜
		 * 작성자 : 김성진
		 ********************************************************************/

		// rfcCall : function(sRfcName, oParameter) {
		// 	var oDeferred = jQuery.Deferred(),
		// 	   oRfcParameter = {
		// 		  FunctionName: sRfcName,
		// 		  ImportData: JSON.stringify(oParameter)
		// 	   };
		// 	$.ajax({
		// 	   type: 'POST',
		// 	   url: 'https://rfcprojectkm5k1z9rxq.eu2.hana.ondemand.com/rfcProject/RFCManager',
		// 	   data: oRfcParameter,
		// 	   success : function(oResultData){
		// 		  oDeferred.resolve(oResultData);
   
		// 		},
		// 		error : function(){
		// 			oDeferred.resolve('오류발생');
		// 		}
		// 	});
		// 	return oDeferred;
		// },

		rfcCall : function (sRfcName, oParameter){
			var oDeferred = jQuery.Deferred(), oRfcParameter = oParameter || {};
			oRfcParameter['format'] = 'json';
			$.ajax({
				type : 'POST',
				url : 'http://52.231.207.124:8100/sap/bc/zrest/' + sRfcName,
				data : oRfcParameter,
				dataType : 'jsonp',
				success : function(oResultData){
					oDeferred.resolve(oResultData);
				},
				error : function(){
					oDeferred.resolve('오류발생');
				}
			});
			return oDeferred;
		},

		// rfcCall : function (sRfcName, oParameter){
		// 	var oDeferred = jQuery.Deferred(), oRfcParameter = oParameter || {};
		// 	oRfcParameter['format'] = 'json';
		// 	$.ajax({
		// 		type : 'POST',
		// 		url : 'http://52.231.207.124:8100/fmcall/' + sRfcName,
		// 		data : oRfcParameter,
		// 		dataType : 'jsonp',
		// 		success : function(oResultData){
		// 			oDeferred.resolve(oResultData);
		// 		},
		// 		error : function(){
		// 			oDeferred.resolve('오류발생');
		// 		}
		// 	});
		// 	return oDeferred;
		// },

		/********************************************************************
		 * 함수 내용 : cookiy set function
		 * 작성자 : 김성진
		 ********************************************************************/
		setCookiy : function(cname, cvalue, exdays){
			var oDate = new Date();
			oDate.setTime(oDate.getTime() + (exdays*24*60*60*1000));
			var expires = "expires="+ oDate.toString();
			document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
		},

		/********************************************************************
		 * 함수 내용 : cookiy get function
		 * 작성자 : 김성진
		 ********************************************************************/
		getCookiy : function(cname){
			var name = cname + "=";
			var decodedCookie = decodeURIComponent(document.cookie);
			var ca = decodedCookie.split(';');
			for(var i = 0; i <ca.length; i++) {
			  var c = ca[i];
			  while (c.charAt(0) == ' ') {
				c = c.substring(1);
			  }
			  if (c.indexOf(name) == 0) {
				return c.substring(name.length, c.length);
			  }
			}
			return "";
		},

		/********************************************************************
		 * 함수 내용 : 메뉴 세팅 함수
		 * 작성자 : 김성진
		 ********************************************************************/
		menuSetting : function(){
			var jobData = this.getCookiy("AUCODE");
			var oEmployeeLog = this.getModel("employeeLog");

			if(jobData){
				switch (jobData) {
					case "A0":
						oEmployeeLog.setProperty("/loginAuth", "재무팀 : ");
						oEmployeeLog.setProperty("/ButtonSetting/MasterSearch", true);
						oEmployeeLog.setProperty("/ButtonSetting/ExpenseManagement", true);
						oEmployeeLog.setProperty("/ButtonSetting/BTripManagement", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetSearch", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetRequest", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetRequestCanc", true);
						oEmployeeLog.setProperty("/ButtonSetting/LogInfo", true);
						oEmployeeLog.setProperty("/ButtonSetting/BTripPayment", true);
						oEmployeeLog.setProperty("/ButtonSetting/Expense", true);
						break;

					case "A1":
						oEmployeeLog.setProperty("/loginAuth", "재무팀(승인) : ");
						oEmployeeLog.setProperty("/ButtonSetting/MasterSearch", true);
						oEmployeeLog.setProperty("/ButtonSetting/ExpenseManagement", true);
						oEmployeeLog.setProperty("/ButtonSetting/BTripManagement", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetSearch", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetRequest", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetRequestCanc", true);
						oEmployeeLog.setProperty("/ButtonSetting/LogInfo", true);
						oEmployeeLog.setProperty("/ButtonSetting/BTripPayment", true);
						oEmployeeLog.setProperty("/ButtonSetting/Expense", true);
						break;

					case "J0":
						oEmployeeLog.setProperty("/loginAuth", "사원 : ");
						oEmployeeLog.setProperty("/ButtonSetting/MasterSearch", true);
						oEmployeeLog.setProperty("/ButtonSetting/ExpenseManagement", false);
						oEmployeeLog.setProperty("/ButtonSetting/BTripManagement", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetSearch", false);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetRequest", false);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetRequestCanc", false);
						oEmployeeLog.setProperty("/ButtonSetting/LogInfo", true);
						oEmployeeLog.setProperty("/ButtonSetting/Expense", true);
						break;

					case "J1":
						oEmployeeLog.setProperty("/loginAuth", "사원(승인) : ");
						oEmployeeLog.setProperty("/ButtonSetting/MasterSearch", true);
						oEmployeeLog.setProperty("/ButtonSetting/ExpenseManagement", true);
						oEmployeeLog.setProperty("/ButtonSetting/BTripManagement", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetSearch", false);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetRequest", true);
						oEmployeeLog.setProperty("/ButtonSetting/BudgetRequestCanc", false);
						oEmployeeLog.setProperty("/ButtonSetting/LogInfo", true);
						oEmployeeLog.setProperty("/ButtonSetting/Expense", true);
						break;
				
					default:
				break;
				}
			}
		}

	});
});