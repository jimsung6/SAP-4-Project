sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/ui/core/Fragment",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/ui/core/Core",
	"sap/m/MessageBox",
	"sap/ui/model/SimpleType",
], function (Controller, JSONModel, MessageToast, Dialog, DialogType, Fragment, Button, ButtonType, Text, Core, MessageBox, SimpleType) {
	"use strict";
	return Controller.extend("ExpenseManagement.controller.budget.ys.depBudget.TProjectList_YS", {
		/******************************************************************************************************************************************************
		 * 함수 이름 : 초기 세팅 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onInit: function() {
			
		var oView = this.getView();
		oView.setModel(new JSONModel({
			teamTableData : [],
			teamBudgetRequest : {},
			teamBudgetList : [],
            request : "",
			budget : "",
			name: "",
			email: "",
			GCODE: "",			 
		}));
		var today = new Date();
		this.getView().getModel().setProperty("/today", today);
		this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		this._oRouter.attachRouteMatched(this.onAfterRendering, this);
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 첫 뷰가 그려진 후 작동까지 하는 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/ 
        onAfterRendering : function(){
			this.onProjectCall();
			this.listRfcFunction(this.getView().getModel());
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산증액 요청 프로젝트 정보 Fragment rfc
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		fragmentDataCall : function(GCODE){
			var oModel = this.getView().getModel();
			var ZVEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			this.getOwnerComponent().rfcCall("ZB_REQUEST_TBUDGET_01", {	// 본인이 호출하고 싶은 RFC명 입력.
				//RFC Import 데이터
				I_GCODE : GCODE,
				I_AUEMP : ZVEMPNO
			}).done(function(oResultData){	// RFC호출 완료
				oModel.setProperty("/teamBudgetRequest", oResultData.TEAMTAB2[0])
			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
            })  
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산증액 요청 확인 Fragment rfc
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		fragmentRfcFunction : function(GCODE, RTREQ, TREBUD, DEPEM, AUEMP, REQDATE){
			var projectModel4 = this.getView().getModel();
			this.getOwnerComponent().rfcCall("ZB_REQUEST_TBUDGET_02", {	// 본인이 호출하고 싶은 RFC명 입력.
				//RFC Import 데이터
				I_GCODE : GCODE,
				I_RTREQ : RTREQ,
				I_TREBUD : TREBUD,
				I_DEPEM : DEPEM,
				I_AUEMP : AUEMP,
				I_REQDATE : REQDATE
			}).done(function(oResultData){	// RFC호출 완료)
				projectModel4.setProperty("/teamBudgetRequest", oResultData.TEAMTAB2[0]);
				console.log(oResultData)
			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
            })
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 프로젝트 매니저 RFC
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/     
		onProjectCall : function(){
			var projectModel = this.getView().getModel();
			var ZVEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
            this.getOwnerComponent().rfcCall("ZB_GET_TM_01", {	// 본인이 호출하고 싶은 RFC명 입력.
				//RFC Import 데이터
				I_AUEMP : ZVEMPNO
			}).done(function(oResultData){	// RFC호출 완료
                projectModel.setProperty("/teamTableData", oResultData.TEAMTAB1)
			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
            });   
		},
		/******************************************************************************************************************************************************
	 	* 함수 이름 : 예산증액 요청 리스트 rfc
	 	* 작성자 : 노용석
	 	******************************************************************************************************************************************************/
		 listRfcFunction : function(projectModel3, GCODE, AUEMP){
			var ZVEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			this.getOwnerComponent().rfcCall("ZB_GET_TREQUEST_01", {	// 본인이 호출하고 싶은 RFC명 입력.
				//RFC Import 데이터
				I_GCODE : GCODE,
				I_AUEMP : ZVEMPNO
			}).done(function(oResultData3){	// RFC호출 완료	
					// console.log(oResultData3.TAB3)
			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			}).then(function(oResultData3){
				var resultData3 = oResultData3.TEAMTAB3;
				for(var i=0 ; i<resultData3.length ; i++) {
					if(resultData3[i].STATUS === "0"){
						resultData3[i].STATUS = "미결";
					}else if(resultData3[i].STATUS === "1"){
						resultData3[i].STATUS = "반려";
					}else{
						resultData3[i].STATUS = "완결"
					};
					if(resultData3[i].DEPEM === "X"){
						resultData3[i].DEPEM = "Y";
					}else if(resultData3[i].DEPEM === ""){
						resultData3[i].DEPEM = "N";
					};
					if(resultData3[i].RDATE === "0000-00-00"){
						resultData3[i].RDATE = " ";
					}
				}
				projectModel3.setProperty("/teamBudgetList", oResultData3.TEAMTAB3)
			});
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산 증액 요청 fragment 열기
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/   		
		onOpenDialog : function (oEvent) {
			var oEventData = oEvent.oSource.oPropagatedProperties.oBindingContexts.undefined.sPath;
			oEventData = oEventData.replace("/teamTableData/", "");
			var oView = this.getView();
			var tableData = this.getView().getModel().getProperty("/teamTableData");
			this.fragmentDataCall(tableData[oEventData].GCODE);
			// create dialog lazily
			if (!this.byId("openDialog1")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.budget.ys.depBudget.OpenDialog",
					controller: this
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("openDialog1").open();
			}
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산 증액 요청 fragment 닫기
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/ 			
		onCloseDialog : function (oEvent, sChannelId, sEventId, sData) {
			sap.ui.getCore().getEventBus().publish(
				"SomeChannel2",
				"SomeEvent2",
				{text : this.getView().getModel().getProperty("/teamBudgetRequest/GCODE")}
			);
			this.byId("openDialog1").close();
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산 증액 요청 확인
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/ 		
		onSaveDialog : function () {
			var oModel = this.getView().getModel();
			var sPath = oModel.getProperty("/teamBudgetRequest");
			// console.log(this.onCheckSelect());
			// // 데이터 불러오기
			var GCODE = sPath.GCODE;
			var RTREQ = sPath.RTREQ;
			var TREBUD = sPath.TREBUD;
			var REQDATE = sPath.REQDATE;
			var check = this.byId("check1").getSelected();
			if (check == true){
				var DEPEM = "X";
			}else{
				var DEPEM = "";
			};	
			var AUEMP = this.getOwnerComponent().getCookiy("EMPNO");
			var oView = this.getView(),
				aInputs = [
				oView.byId("budgetInput"),
				oView.byId("requestInput"),
				oView.byId("dateInput")
			],
				bValidationError = false;

			// Check that inputs are not empty.
			// Validation does not happen during data binding as this is only triggered by user actions.
			if(REQDATE){
			var REQDATEYEAR = REQDATE.toString().slice(0, 4);
			};
			var toDay = this.getView().getModel().getProperty("/today");
			var thisYear = new Date(toDay).getFullYear().toString();
			if(REQDATEYEAR !== thisYear){
				console.log(REQDATEYEAR)
				MessageBox.error("요청 년월을 확인하세요.");
			}else{
				aInputs.forEach(function (oInput) {
					bValidationError = this._validateInput(oInput) || bValidationError;
				}, this);
				if (!bValidationError) {
					if (!this.oApproveDialog) {
						this.oApproveDialog = new Dialog({
							type: DialogType.Message,
							title: "Confirm",
							content: new Text({ text: "예산 증액 요청 하시겠습니까?" }),
							beginButton: new Button({
								type: ButtonType.Emphasized,
								text: "요청",
								press: function () {
									this.fragmentRfcFunction(GCODE, RTREQ, TREBUD, DEPEM, AUEMP, REQDATE)
									MessageToast.show("접수 완료");
									this.oApproveDialog.close();
									this.oApproveDialog.destroy();
									delete this.oApproveDialog;
									this.onCloseDialog();
								}.bind(this)
							}),
							endButton: new Button({
								text: "취소",
								press: function () {
									this.oApproveDialog.close();
								}.bind(this)
							})
						});
					}
					this.oApproveDialog.open();
				} else {
					MessageBox.alert("양식에 맞게 작성 바랍니다.");
				}
			}
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : Table 리스트 선택 시 해당 프로젝트에 연결된 기안 문서만 보이게 하기. (기안 문서 앞에 두글자를 포함하는 프로젝트 )
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onSelectionChange : function (oEvent, sChannelId, sEventId, sData) {			
			var sPath = oEvent.mParameters.rowContext.sPath ;  //선택된 레코드의 경로 찾기
			var selectChange = this.getView().getModel().getProperty(sPath+"/GCODE");
			this.getView().getModel().setProperty("/GCODE" ,selectChange)
			sap.ui.getCore().getEventBus().publish(
				"SomeChannel",
				"SomeEvent",
				{text: selectChange}
			);
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산 증액 요청 FRAGMENT 인풋 유효값 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		_validateInput: function (oInput) {
			var sValueState = "None";
			var bValidationError = false;
			var oBinding = oInput.getBinding("value");
			try {
				oBinding.getType().validateValue(oInput.getValue());
			} catch (oException) {
				sValueState = "Error";
				bValidationError = true;
			}
			oInput.setValueState(sValueState);
			return bValidationError;
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산 증액 요청 FRAGMENT 인풋 이벤트 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onChange: function(oEvent) {
			var oInput = oEvent.getSource();
			this._validateInput(oInput);
		},
	});
});