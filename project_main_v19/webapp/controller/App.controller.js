
sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/Popover",
	"sap/m/library",
	"sap/m/MessageToast"
], function(Controller, JSONModel, Popover, library, MessageToast) {
	"use strict";

	return Controller.extend("ExpenseManagement.controller.App", {

		/*******************************************************
		 * function : 초기세팅 함수
		 * *****************************************************/
		onInit : function(){
		},

		onAfterRendering : function(){
			//menuSetting 함수 콜
			this.getOwnerComponent().menuSetting();
		},

		onExit : function(){
		},
		
		/*******************************************************
		 * function : 홈 화면으로
		 * 작성자 : 김성진
		 * *****************************************************/
		onHomePress: function (){
			//log 정보 확인

			var logData = this.getOwnerComponent().getCookiy("EMPNO");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			if(logData){
				oRouter.navTo("mainBoard"); 
			}else{
				oRouter.navTo("login"); //회계부서 승인권한자
			}
		},

		/*******************************************************
		 * function : 로그아웃
		 * *****************************************************/
		onLogOut: function (){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var logModel = this.getView().getModel("employeeLog");
			
			this.getOwnerComponent().setCookiy("EMPNO", "", -1);
			this.getOwnerComponent().setCookiy("ENAME", "", -1);
			this.getOwnerComponent().setCookiy("PWORD", "", -1);
			this.getOwnerComponent().setCookiy("JOB", "", -1);
			this.getOwnerComponent().setCookiy("GCODE", "", -1);
			this.getOwnerComponent().setCookiy("BANKL", "", -1);
			this.getOwnerComponent().setCookiy("CACCT", "", -1);
			this.getOwnerComponent().setCookiy("AUCODE", "", -1);
			this.getOwnerComponent().setCookiy("PNUM", "", -1);
			this.getOwnerComponent().setCookiy("EMAIL", "", -1);

			console.log(document.cookie);

			logModel.setProperty("/loginName", "");
			logModel.setProperty("/loginAuth", "");
			logModel.setProperty("/ButtonSetting/MasterSearch", false);
			logModel.setProperty("/ButtonSetting/ExpenseManagement", false);
			logModel.setProperty("/ButtonSetting/BTripManagement", false);
			logModel.setProperty("/ButtonSetting/BudgetSearch", false);
			logModel.setProperty("/ButtonSetting/BudgetRequest", false);
			logModel.setProperty("/ButtonSetting/BudgetRequestCanc", false);
			logModel.setProperty("/ButtonSetting/LogInfo", false);
			logModel.setProperty("/ButtonSetting/BTripPayment", false);
			logModel.setProperty("/ButtonSetting/Expense", false);

			oRouter.navTo("login"); //회계부서 승인권한자

			
		},
		
		/*******************************************************
		* 메뉴 : 마스터 조회
		*******************************************************/
		 //function : 사원정보 조회 
		 onGoEmp: function(){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("EmpTableKJE"); //사원정보 조회 
		 },	
		 //function : 조직정보 조회
		 onGoDep: function(){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("Groupprj"); //조직정보 조회
		 },
		 //function : 프로젝트 조회
		 onGoProject: function(){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("Projectprj"); //프로젝트 조회
		 },
		 //function : 계좌정보 조회
		 onGoAccount: function(){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("CompanyAccounts"); //계좌정보 조회
		 },

		 /*******************************************************
		   출장 관리
		*******************************************************/
		 // function : 출장비 입력
		onGoKJE: function (){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("WorktimeKJE"); //출장비 입력
		 },		

		// function : 출장비 승인
		 onGoConfirm: function (){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("Confirm_Home"); //출장비 승인
		 },
		 // function : 출장비 지급 
		 onGoPay_YJ: function(){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("PdiemYJ"); //출장비 지급
		 },
		// function : 출장비 조회 
		onGoPerdiemprj: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Perdiemprj"); //출장비 조회
		},

		 /*******************************************************
		   예산 조회
		*******************************************************/	
		//function : 부서 별 예산 
		 onGoBudget_EH: function(){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("DepartmentBudgetList"); //부서별 예산
		 },		 
		//function : 프로젝트 별 예산 
			onGoPROBUDLIST: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("PROBUDLIST"); //프로젝트 별 예산
		},		 

		 /*******************************************************
		 * function : 프로젝트 예산 증액 및 승인 반려
		 * *****************************************************/
		//function : 부서별 별 예산 증액
		onGoDepBudget_YS: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("DepBudget_YS"); //프로젝트 예산 증액
		},
		//function : 프로젝트 별 예산 증액
		onGoProBudget_YS: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ProjBudget_YS"); //프로젝트 예산 증액
		},
		//function : 부서 별 예산 증액 승인/반려
		onGoDepBudget_SY: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("DepBudget_SY"); //부서 별 예산 증액
		},
		//function : 프로젝트 별 예산 증액 승인/반려
		onGoProjBudget_SY: function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ProjBudget_SY"); //프로젝트 예산 증액
		},

		 /*******************************************************
		 * function : 경비지급 
		 * *****************************************************/
		 onGoPay_HS: function(){
		 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		 	oRouter.navTo("List26"); //경비지급
		 },

		 /*******************************************************
		 * function : 경비입력
		 * *****************************************************/
		 onGoExpenseInput : function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("Approyj"); //경비입력
		 },

		 /*******************************************************
		 * function : 경비 승인/반려
		 * *****************************************************/
		 onGoExpenseManagement : function(){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ExpenseManagement"); //경비 승인/반려
		 }



	});
});