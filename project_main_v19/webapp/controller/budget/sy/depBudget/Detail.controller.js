sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
 ], function(Controller, Fragment, History,JSONModel, MessageBox, MessageToast) {
	"use strict";
	
	return Controller.extend("ExpenseManagement.controller.budget.sy.depBudget.Detail", {
	   
	   onInit : function(){
		  this.getView().setModel(new JSONModel({
			 info : [],
			 detail : []
		  }),"teaminitsun"); 
 
		  //라우터 세팅
		  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		  oRouter.getRoute("DepDetail").attachPatternMatched(this._onObjectMatched, this);
		  
		  
	   },
		 /**********************************************************************************
		* 함수 내용 : 파라미터 값 들고오기
		**********************************************************************************/
	   _onObjectMatched: function (oEvent) {
 
		  if(oEvent.mParameters){
			 var sDetailData = oEvent.mParameters.arguments.aDetailData;
			 this.getView().getModel("teaminitsun").setProperty("/DetailData", sDetailData)
 
			 //RFC call
			 this.onDetailRFC(sDetailData);
		  }
	
		},
		/**********************************************************************************
		* 함수 내용 : 이전페이지로 돌아가기 Event
		**********************************************************************************/
	   onNavBack : function() {
		  var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			 oRouter.navTo("DepBudget_SY");
			 this.byId("teamspecificlist").clearSelection(true);
	   },
 
		 /**********************************************************************************
		* 함수 내용 : rfc call
		**********************************************************************************/
	   onDetailRFC : function(sDetailData){
		  var oModel = this.getView().getModel("teaminitsun");
		  var cDetailData = oModel.getProperty("/DetailData");
		  var colData = cDetailData.split(",")[0]
		  var  GCODE = cDetailData.split(",")[1],
			  startYear = cDetailData.split(",")[2],
			 startMonth = cDetailData.split(",")[3],
			  endYear = cDetailData.split(",")[4],
			 endMonth = cDetailData.split(",")[5]
 
		  // 테이블 세팅
 
		  //미결건수 클릭시
		  if(colData === "REMAIN"){
			 oModel.setProperty("/info/Toggle", "MultiToggle");
			 oModel.setProperty("/info/Approvebtn", true);
			 oModel.setProperty("/info/Rejectbtn", true);
			 oModel.setProperty("/info/Approve", false);
			 oModel.setProperty("/info/Reject", false); 
			 oModel.setProperty("/info/RejectReason", false);
 
		  //반려건수 클릭시
		  }else if(colData === "REJECT"){
			 oModel.setProperty("/info/Toggle", "None");
			 oModel.setProperty("/info/Approvebtn", false);
			 oModel.setProperty("/info/Rejectbtn", false);
			 oModel.setProperty("/info/Approve", false);
			 oModel.setProperty("/info/Reject", true); 
			 oModel.setProperty("/info/RejectReason", true);
 
		  //완결건수 클릭시
		  }else if(colData === "COMPLETE"){
			 oModel.setProperty("/info/Toggle", "None");
			 oModel.setProperty("/info/Approvebtn", false);
			 oModel.setProperty("/info/Rejectbtn", false);
			 oModel.setProperty("/info/Approve", true);
			 oModel.setProperty("/info/Reject", false); 
			 oModel.setProperty("/info/RejectReason", false);
 
		  //총건수 클릭시
		  }else{
			 oModel.setProperty("/info/Toggle", "MultiToggle");
			 oModel.setProperty("/info/Approvebtn", true);
			 oModel.setProperty("/info/Rejectbtn", true);
			 oModel.setProperty("/info/Approve", true);
			 oModel.setProperty("/info/Reject", true); 
			 oModel.setProperty("/info/RejectReason", true);
		  }
 
		  //rfc call
		  var AUCODE = this.getOwnerComponent().getCookiy("AUCODE");
		  var EMPNO = this.getOwnerComponent().getCookiy("EMPNO");
 
		  this.getOwnerComponent().rfcCall("ZB_GET_TDETAIL",{
			 I_GCODE : GCODE,
			 I_COLDATA : colData,
			 I_SFROMYEAR : startYear,
			 I_SFROMMONTH : startMonth,
			 I_STOYEAR : endYear,
			 I_STOMONTH : endMonth,
			 I_AUCODE : AUCODE,
			 I_EMPNO : EMPNO
		  }).done(function(oResultData){
			 // RFC호출 완료
				console.log(oResultData);
				oModel.setProperty("/detail", oResultData.ZBTTAB2);
			 }).fail(function(sErrorMessage){
			 // 호출 실패
				alert(sErrorMessage);
			 }).then(function(){
			 //긴급여부, 링크set
				for(var i = 0; i < oModel.getProperty("/detail").length+1; i++) {
				   if(oModel.getProperty("/detail/"+i+"/DEPEM") === 'X'){
					  oModel.setProperty("/detail/"+i+"/Depembtn", "#dc1313")
				   }else{
					  oModel.setProperty("/detail/"+i+"/Depembtn", "#1C4C98")
				   }
				   if(oModel.getProperty("/detail/"+i+"/STATUS") != '1'){
					   oModel.setProperty("/detail/"+i+"/ReReasonlink", false)
				   }
				}
			 });
	   },
 
		
		/**********************************************************************************
		* 함수 내용 : 승인rfc
		**********************************************************************************/
	   ApproveRfcFunction : function(projectModelA, PICODE){
		  var oView = this.getView();
		  var oModel = oView.getModel("teaminitsun");
		  var oIndices = this.byId("teamspecificlist").getSelectedIndices()
		  for(var i=0;  i < oIndices.length ; i++){
			 var oSelectData = oModel.getProperty("/detail/"+ oIndices[i]);
			 var TPICODE = oSelectData.TPICODE; 
			 var TREBUD = oSelectData.TREBUD;
			 var REMONTH = oSelectData.REQDATE.slice(4,6)
			 var REYEAR = oSelectData.REQDATE.slice(0,4);
			 var STATUS = oSelectData.STATUS
			 this.getOwnerComponent().rfcCall("ZB_TAPRROVE_BUDGET", {  
				I_TPICODE : TPICODE,
				I_TREBUD : TREBUD,
				I_REMONTH : REMONTH,
				I_REYEAR : REYEAR,
				I_STATUS : STATUS
			 }).done(function(oResultData2){  
				 // RFC호출 완료
				console.log(oResultData2.ZBDTAB4)
				oModel.setProperty("/teamBudgetAccept", oResultData2.ZBDTAB4);
			 }).fail(function(sErrorMessage){
				// 호출 실패
				alert(sErrorMessage);
				})
			 }
		  },
 
		/**********************************************************************************
		* 함수 내용 : 반려rfc
		**********************************************************************************/
	   RejectRfcFunction : function(){
		  var oView = this.getView();
		  var oModel = oView.getModel("teaminitsun");
		  var oIndices = this.byId("teamspecificlist").getSelectedIndices()
 
		  //선택한 row 반려
		  for(var i=0;  i < oIndices.length ; i++){
			 var oSelectData = oModel.getProperty("/detail/"+ oIndices[i]);
			 var TPICODE = oSelectData.TPICODE; 
			 var RETCODE = oModel.getProperty("/comboData");
			 var TNOTE = oModel.getProperty("/inputData");
 
			 //rfc call
			 this.getOwnerComponent().rfcCall("ZB_TREJECT_BUDGET", {  
				I_TPICODE : TPICODE,
				I_RETCODE : RETCODE,
				I_TNOTE : TNOTE
			 }).done(function(oResultData2){   
				// RFC호출 완료
				console.log(oResultData2.ZBTTAB5)
				oModel.setProperty("/teamBudgetReject", oResultData2.ZBPTAB5);
			 }).fail(function(sErrorMessage){
				// 호출 실패
				alert(sErrorMessage);
				})
			 }
		  },
		/**********************************************************************************
		* 함수 내용 : 승인버튼 Event
		**********************************************************************************/
	   aConfirmMsg : function () {
		  var that = this;
		  var oView = this.getView();
		  var oModel=oView.getModel("teaminitsun");
		  var getIndex = this.byId("teamspecificlist").getSelectedIndex();
		  var getIndices = this.byId("teamspecificlist").getSelectedIndices();
		  var bApproveCheck = false;
 
		  //미결상태 && SelectedIndex가 존재여부 check
		  for(var i = 0; i < getIndices.length; i++){
			 if(getIndex >= 0 || oModel.getProperty("/detail/"+getIndices[i]+"/STATUS") === '0'){
				bApproveCheck = true;
			 }
		  }
 
		  //승인process
			 if(bApproveCheck){
				MessageBox.confirm("승인하시겠습니까?", {
				   actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
				   onClose: function (sAction) {
					  if(sAction === "OK"){
						 MessageToast.show("승인되었습니다");
						 //승인 rfc
						 that.ApproveRfcFunction();
						 //SelectedIndex 초기화
						 that.byId("teamspecificlist").removeSelectionInterval(0,oModel.getData().detail.length)
						 //Detail rfc
						 that.onDetailRFC();
					  }
				   }
				});
			 } else{
			 //승인건을 클릭하지 않을시
				MessageBox.error("승인건을 선택해주세요") 
			 }
		  
	   },
 
		/**********************************************************************************
		* 함수 내용 : 반려 Button Event
		**********************************************************************************/
	   rejOpen : function(oEvent){
		  var oView = this.getView();
		  var oModel= oView.getModel("teaminitsun");
		  var that = this;
		  var status = oModel.getProperty("/detail");
		  var getIndex = this.byId("teamspecificlist").getSelectedIndex();
		  var getIndices = this.byId("teamspecificlist").getSelectedIndices();
		  var bRejectCheck = false;
 
		  //미결상태 && SelectedIndex가 존재여부 check
		  for(var i = 0; i < getIndices.length; i++){
			 if(getIndex >= 0 && oModel.getProperty("/detail/"+getIndices[i]+"/STATUS") === '0'){
				bRejectCheck = true;
			 }
		  }
 
	   //반려process
	   if(bRejectCheck){
		  if(!oView.byId("teamrejectDialog")) {
			 var oFragmentController = {
				//닫기 Event
				onCloseMsg : function(rEvent){
				   //반려코드랑 내역 모두 넣었는지 check
				   if(oModel.getProperty("/comboData") && oModel.getProperty("/inputData")){
					  oView.byId("teamrejectDialog").close();
					  //반려하기 전 confirmmessage
					   MessageBox.confirm("반려하시겠습니까?" , {
						 actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
						 onClose: function (sAction) {
							//반려
							if(sAction === "OK"){
							   MessageToast.show("반려되었습니다");
							   //반려rfc
							   that.RejectRfcFunction();
							   //반려 입력값 초기화
							   oModel.setProperty("/comboData", null); 
							   oModel.setProperty("/inputData", null); 
							   //SelectedIndex 초기화
							   that.byId("teamspecificlist").removeSelectionInterval(0,oModel.getData().detail.length)
							   //Detail rfc
							   that.onDetailRFC();
							}
						 }
					  });
				   }else{
 
				//반려코드랑 내역 모두 넣지 않았을 경우
					  MessageBox.error("값을 넣어주세요!")
				   }
				   
				   },
				//닫기 Event
				   onCloseDialog : function(oEvent){
					  oView.byId("teamrejectDialog").close();
					  oModel.setProperty("/comboData", null); 
					  oModel.setProperty("/inputData", null);
				   },
 
				// 반려코드 클릭시, 반려내역 자동완성(반려코드 : 기타 제외)
				 RettextChange : function(){
					var oSelectCombo = oModel.getProperty("/comboData").slice(2,3);
					var oSelectReject = oModel.getProperty("/rejectCode");
					if(oSelectCombo != "4" ){
					   oModel.setProperty("/inputData", oSelectReject[oSelectCombo].RETTEXT);
					   oModel.setProperty("/inputEdit", false);
					}else{
					   oModel.setProperty("/inputData", "");
					   oModel.setProperty("/inputEdit", true);
					}
				 },
			 };  
 
			 // load asynchronous XML fragment
			 Fragment.load({
				id: oView.getId(),
				name: "ExpenseManagement.view.budget.sy.depBudget.RejectForm",
				controller : oFragmentController
			 }).then(function(oDialog){
				oView.addDependent(oDialog);
				oDialog.open();
			 });
 
			 //Fragment.load().then()
		  } else{
			 this.byId("teamrejectDialog").open();
		  }
  
		  this.getOwnerComponent().rfcCall("ZB_RETCODE_99B").done(function(oResultData){
			 // RFC호출 완료
			 console.log(oResultData.T_ZBBUT0001);
			 oModel.setProperty("/rejectCode", oResultData.T_ZBBUT0001);
		  }).fail(function(sErrorMessage){
			 // 호출 실패
			 alert(sErrorMessage);
		  })
		  }else{
			 //미결 or selectedIndex가 없을 경우
			 MessageBox.error("반려건을 선택해주세요")
		  }
		},
 /**********************************************************************************
		* 함수 내용 : 요청사유 Button Event
		**********************************************************************************/
	   open : function(oEvent){
		  var oView = this.getView()
		  var sPath=oEvent.getSource().getBindingContext('teaminitsun').sPath
		  var oModel=oView.getModel("teaminitsun");
		  var oSelectData = oModel.getProperty(sPath);
		  oModel.setProperty("/detailData",oSelectData)
		  //create dialog 
		  if(!oView.byId("teamdetailDialog")) {
			 var oFragmentController = {
				   onCloseDialog : function(){
					  oView.byId("teamdetailDialog").close();
					  oModel.setProperty("/detailData",null)
				   }
			 };
			 // load asynchronous XML fragment
			 Fragment.load({
				id: oView.getId(),
				name: "ExpenseManagement.view.budget.sy.depBudget.DetailDialog",
				controller : oFragmentController
			 }).then(function(oDialog){
				oView.addDependent(oDialog);
				oDialog.open();
			 });
			 //Fragment.load().then()
		  } else{
			 oView.byId("teamdetailDialog").open();
		  }
 
	   },
 
		/**********************************************************************************
		* 함수 내용 : 반려사유 link Event
		**********************************************************************************/
	   rejView : function(oEvent){
		  var oView = this.getView();
		  var oModel=oView.getModel("teaminitsun");
		  var sPath=oEvent.getSource().getBindingContext('teaminitsun').sPath
		  var oSelectData = oModel.getProperty(sPath);
		  oModel.setProperty("/RejectViewData",oSelectData);
		  
		  if(!oView.byId("teamrejectDialog2")) {
			 var oFragmentController = {
				//닫기 Event
				onCloseDialog : function(oEvent){
					  oView.byId("teamrejectDialog2").close();
					  oModel.setProperty("/comboData", null); 
					  oModel.setProperty("/inputData", null);
				   }
			 };  
			 // load asynchronous XML fragment
			 Fragment.load({
				id: oView.getId(),
				name: "ExpenseManagement.view.budget.sy.depBudget.RejectView",
				controller : oFragmentController
			 }).then(function(oDialog){
				oView.addDependent(oDialog);
				oDialog.open();
			 });
			 //Fragment.load().then()
		  } else{
			 this.byId("teamrejectDialog2").open();
		  }
	   },
 
		/**********************************************************************************
		* 함수 내용 : 부서매니저 link Event
		**********************************************************************************/
	   pmOpen : function(oEvent){
		  var oView = this.getView();
		  var oModel=oView.getModel("teaminitsun");
		  var sPath=oEvent.getSource().getBindingContext('teaminitsun').sPath
		  var oSelectData = oModel.getProperty(sPath);
		  //rfc 
		  var GNAME = oSelectData.GNAME
		  var AUNAME = oSelectData.AUNAME
		  this.getOwnerComponent().rfcCall("ZB_GET_PM",{
			 I_GNAME : GNAME,
			 I_ENAME : AUNAME
		  }).done(function(oResultData){   
			 // RFC호출 완료
			 console.log(oResultData.ZBTTAB3);
			 oModel.setProperty("/pmData", oResultData.ZBTTAB3);
		  }).fail(function(sErrorMessage){
			 // 호출 실패
			 alert(sErrorMessage);
		  })
		  //create dialog 
		  if(!oView.byId("TMForm")) {
			 var oFragmentController = {
				   onCloseDialog : function(){
					  oView.byId("TMForm").close();
					  oModel.setProperty("/pmData",null)
				   }
			 };
			 // load asynchronous XML fragment
			 Fragment.load({
				id: oView.getId(),
				name: "ExpenseManagement.view.budget.sy.depBudget.TMForm",
				controller : oFragmentController
			 }).then(function(oDialog){
				oView.addDependent(oDialog);
				oDialog.open();
			 });
			 //Fragment.load().then()
		  } else{
			 oView.byId("TMForm").open();
		  }
	   },
 
 
	})
 })