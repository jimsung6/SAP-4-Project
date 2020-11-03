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


		return Controller.extend("ExpenseManagement.controller.budget.ys.depBudget.TBudgetList_YS", {
		/******************************************************************************************************************************************************
		 * 함수 이름 : 초기 기능 세팅
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onInit : function() {
			sap.ui.getCore().getEventBus().subscribe(
				"SomeChannel",
				"SomeEvent",
				this.onFilterSearch ,
				this
			);
			sap.ui.getCore().getEventBus().subscribe(
				"SomeChannel2",
				"SomeEvent2",
				this.onFilterSearch ,
				this
			); 
			var oView = this.getView();
			var sModel = oView.setModel(new JSONModel({
					 teamBudgetList : [],
					 teamBudgetRequest : {},
					 request: "",
					 budget: "",
					 tpicode: "",
					 name: "",
					 email: "",
					 GCODE: ""
			}));
			//콤보박스 초기 세팅
		//	this.getView().getModel().setProperty("/comboData", "All"); // comboData에 All로 초기값 set
			//캘린더 초기 세팅
			var nMS = 1000 * 60 * 60 * 24; //milliseconds in a day
			var today = new Date(); //오늘 날짜 불러오기
			var oDay = new Date(today.getTime() - nMS*365); //오늘 날짜 - 365일 -> 최근 1년 이내의 데이터를 불러오기
			this.getView().getModel().setProperty("/startDate", oDay); // startDate에 oDay를 초기값 set해준다.
			this.getView().getModel().setProperty("/endDate", today);  // endDate에 today를 초기값 set해준다.
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("DepBudget_YS").attachPatternMatched(this.getRouteParamse, this);
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 라우트 파라미터 얻기 함수
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		getRouteParamse : function(oEvent){
			if(oEvent.mParameters){
				var statusData = oEvent.mParameters.arguments.status;
				console.log(statusData);
				//콤보박스 초기 세팅
				this.getView().getModel().setProperty("/comboData", statusData); // comboData에 All로 초기값 set

				this.onFilterSearch(); //this(controller)안에 있는 onFilterSearch 함수를 작동한다.
				var projectModel2 = this.getView().getModel();
				var projectModel3 = this.getView().getModel();	
				this.fragmentRfcFunction(projectModel2);
				this.listRfcFunction(projectModel3, "", "", statusData);
			 }
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 첫 뷰가 그려진 후 작동까지 하는 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onAfterRendering : function(){
			this.onFilterSearch(); //this(controller)안에 있는 onFilterSearch 함수를 작동한다.
			var projectModel2 = this.getView().getModel();
			var projectModel3 = this.getView().getModel();	
			this.fragmentRfcFunction(projectModel2);
			this.listRfcFunction(projectModel3);
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
	 	* 함수 이름 : 예산증액 요청 리스트 rfc
	 	* 작성자 : 노용석
	 	******************************************************************************************************************************************************/
		listRfcFunction : function(projectModel3, sStartDateInfo, sEndDateInfo, comboData, sData){
			var ZVEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			this.getOwnerComponent().rfcCall("ZB_GET_TREQUEST_01", {	// 본인이 호출하고 싶은 RFC명 입력.
				//RFC Import 데이터
				I_STATUS : comboData,
				I_DTDATE1 : sStartDateInfo,
				I_DTDATE2 : sEndDateInfo,
				I_GCODE : sData,
				I_AUEMP : ZVEMPNO
			}).done(function(oResultData3){	// RFC호출 완료
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
			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			});
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산증액 요청 Fragment rfc
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		fragmentRfcFunction : function(projectModel4, RTREQ, TREBUD, DEPEM, GCODE, TPICODE, REQDATE){
			var ZVEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			var projectModel4 = this.getView().getModel();
			this.getOwnerComponent().rfcCall("ZB_REQUEST_TBUDGET_03", {	// 본인이 호출하고 싶은 RFC명 입력.
				//RFC Import 데이터
				I_RTREQ : RTREQ,
				I_TREBUD : TREBUD,
				I_DEPEM : DEPEM,
				I_GCODE : GCODE,
				I_TPICODE : TPICODE,
				I_REQDATE : REQDATE,
				I_AUEMP : ZVEMPNO
				// I_STATUS : "0", 반려상태에서 미결상태로 바꾸기 위함.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
			}).done(function(oResultData){	// RFC호출 완료
				projectModel4.setProperty("/teamBudgetRequest", oResultData.TEAMTAB2[0]);
			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
            })
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 필터바 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onFilterSearch : function(sChannelId, sEventId, sData) {
			//캘린더 데이터 불러오기
			var startDate = this.getView().getModel().getProperty("/startDate"); //startDate
			var endDate = this.getView().getModel().getProperty("/endDate");
			// 캘린더 데이터 원하는 구조로 만들기 yyyy-MM-dd
			if(startDate && endDate){
				var sFromDate = new Date(startDate);
				var sToDate = new Date(endDate);
 
				var sFromYear = sFromDate.getFullYear();
				var sFromMonth = sFromDate.getMonth()+1 >= 10 ? sFromDate.getMonth()+1 : "0"+(sFromDate.getMonth()+1); //시스템 상 month는 0부터 시작하기 때문에 1을 더해준다.
				var sFromDate = sFromDate.getDate() >= 10 ? sFromDate.getDate() : "0"+sFromDate.getDate();
	
				var sToYear = sToDate.getFullYear();
				var sToMonth = sToDate.getMonth()+1 >= 10 ? sToDate.getMonth()+1 : "0"+(sToDate.getMonth()+1);
				var sToDate = sToDate.getDate() >= 10 ? sToDate.getDate() : "0"+sToDate.getDate();
	
				var sStartDateInfo = sFromYear.toString()+sFromMonth.toString()+sFromDate.toString();
				var sEndDateInfo = sToYear.toString()+sToMonth.toString()+sToDate.toString();			 
			 }
			// 콤보박스 데이터 불러오기
			var comboData = this.getView().getModel().getProperty("/comboData");
			if(comboData === "All"){
				comboData = "";
			};
			//프로젝트 코드 데이터 불러오기
			var projectModel3 = this.getView().getModel();
			if (sData){
				this.listRfcFunction(projectModel3, sStartDateInfo, sEndDateInfo, comboData, sData.text);
			}else{
				this.listRfcFunction(projectModel3, sStartDateInfo, sEndDateInfo, comboData);
			}		
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 요청 사유 팝오버 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onShowRequest: function (oEvent) {
			var oButton = oEvent.getSource();
			var gPath = oButton.oPropagatedProperties.oBindingContexts.undefined.sPath;
			var requestData = this.getView().getModel().getProperty(gPath+"/RTREQ");
			this.getView().getModel().setProperty("/requestData", requestData);
			// create popover
			if (!this._oPopover) {
				Fragment.load({
					name: "ExpenseManagement.view.budget.ys.depBudget.PopOver",
					controller: this
				}).then(function(pPopover) {
					this._oPopover = pPopover;
					this.getView().addDependent(this._oPopover);
					this._oPopover.openBy(oButton);
				}.bind(this));
			} else {
				this._oPopover.openBy(oButton);
			}
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 요청 사유 팝오버 닫기 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		handleActionPress: function () {
			this._oPopover.close();
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산 증액 요청 FRAGMENT 열기 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onOpenDialog : function (oEvent) {
			var oView = this.getView();
			var gPath = oEvent.getSource().oPropagatedProperties.oBindingContexts.undefined.sPath;
			var tpicodeData = this.getView().getModel().getProperty(gPath+"/TPICODE");
			this.getView().getModel().setProperty("/tpicode", tpicodeData);
			var oEventData = gPath.replace("/teamBudgetList/", "");
			parseInt(oEventData);
			var tableData = this.getView().getModel().getProperty("/teamBudgetList");
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
		 * 함수 이름 : 예산 증액 요청 FRAGMENT 닫기 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onCloseDialog : function (sData) {
			this.byId("openDialog1").close();
			// window.location.reload();
			var projectModel3 = this.getView().getModel();
			this.listRfcFunction(projectModel3);
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 예산 증액 요청 FRAGMENT 요청 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onSaveDialog : function (oEvent) {
			// collect input controls
			var oModel = this.getView().getModel();
			var gPath = oModel.oData.teamBudgetRequest;
			// 데이터 불러오기
			var RTREQ = gPath.RTREQ;
			var TREBUD = gPath.TREBUD;
			var REQDATE = gPath.REQDATE;
			var GCODE = gPath.GCODE;
			var check = this.byId("check1").getSelected();
			if (check == true){
				var DEPEM = "X";
			}else{
				var DEPEM = "";
			};
			var TPICODE = this.getView().getModel().getProperty("/tpicode");
			var oView = this.getView(),
				aInputs = [
				oView.byId("budgetInput2"),
				oView.byId("requestInput2"),
				oView.byId("dateInput"),
			],
				bValidationError = false;
			// Check that inputs are not empty.
			// Validation does not happen during data binding as this is only triggered by user actions.
			if(REQDATE){
			var REQDATEYEAR = REQDATE.toString().slice(0, 4);
			}
			var toDay = this.getView().getModel().getProperty("/today");
			var thisYear = new Date(toDay).getFullYear().toString();
			if(REQDATEYEAR !== thisYear){
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
								var projectModel4 = this.getView().getModel();
								this.fragmentRfcFunction(projectModel4, RTREQ, TREBUD, DEPEM, GCODE, TPICODE, REQDATE);
								MessageToast.show("접수 완료");
								this.oApproveDialog.close();
								this.oApproveDialog.destroy();
								delete this.oApproveDialog;
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
				MessageBox.error("양식에 맞게 작성 바랍니다.");
			}
		}
		},
		/******************************************************************************************************************************************************
		 * 함수 이름 : 재무 담당자에게 이메일 보내기 메소드
		 * 작성자 : 노용석
		 ******************************************************************************************************************************************************/
		onSendEmail : function (oEvent) {
			var oEmail = oEvent.getSource();
			var gPath = oEmail.oPropagatedProperties.oBindingContexts.undefined.sPath;
			var oEmailSend = this.getView().getModel().getProperty(gPath+"/EMAIL");
			sap.m.URLHelper.triggerEmail(oEmailSend);
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