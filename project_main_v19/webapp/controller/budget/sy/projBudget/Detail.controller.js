sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/Fragment",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function(Controller, Fragment, History,JSONModel, MessageBox, MessageToast) {
	"use strict";
	
	return Controller.extend("ExpenseManagement.controller.budget.sy.projBudget.Detail", {
		onInit : function(){
			this.getView().setModel(new JSONModel({
				info : [],
				detail : []
			}),"projectinitsun"); 

			//라우터 세팅
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.getRoute("ProjDetail").attachPatternMatched(this._onObjectMatched, this);
		},
		 /**********************************************************************************
		 * 함수 내용 : 파라미터 값 들고오기
		 **********************************************************************************/
		_onObjectMatched: function (oEvent) {

			if(oEvent.mParameters){
			   var sDetailData = oEvent.mParameters.arguments.aDetailData;
			   this.getView().getModel("projectinitsun").setProperty("/DetailData", sDetailData)

				//RFC call
				this.onDetailRFC(sDetailData);
			}
   
		 },
		 
		 /**********************************************************************************
		 * 함수 내용 : 이전페이지로 돌아가기 Event
		 **********************************************************************************/
		onNavBack : function() {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("ProjBudget_SY");
			this.byId("productslist").clearSelection(true);
		},
		
		/**********************************************************************************
		 * 함수 내용 : rfc call
		 **********************************************************************************/
		onDetailRFC : function(sDetailData){
			var oModel = this.getView().getModel("projectinitsun");
			var cDetailData = oModel.getProperty("/DetailData");
			var colData = cDetailData.split(",")[0]
			var PCODE = cDetailData.split(",")[1]
			var AUCODE = this.getOwnerComponent().getCookiy("AUCODE");
			var EMPNO = this.getOwnerComponent().getCookiy("EMPNO");

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
			this.getOwnerComponent().rfcCall("ZB_GET_PDETAIL",{
				I_PCODE : PCODE,
				I_COLDATA : colData,
				I_AUCODE : AUCODE,
				I_EMPNO : EMPNO
			}).done(function(oResultData){
				// RFC호출 완료
					console.log(oResultData);
					oModel.setProperty("/detail", oResultData.ZBPTAB2);
				}).fail(function(sErrorMessage){
				// 호출 실패
					alert(sErrorMessage);
				}).then(function(){
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
		 * 함수 내용 : 요청사유 Button Event
		 **********************************************************************************/
		open : function(oEvent){
			var oView = this.getView();
			var oModel = oView.getModel("projectinitsun");
			var sPath = oEvent.getSource().getBindingContext("projectinitsun").getPath();
			var oSelectData = oModel.getProperty(sPath);
			oModel.setProperty("/detailData",oSelectData)
			//create dialog 
			if(!oView.byId("projectdetailDialog")) {
				var oFragmentController = {
						//닫기 Event
						onCloseDialog : function(){
							oView.byId("projectdetailDialog").close();
							oModel.setProperty("/detailData",null)
						}
				};
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.budget.sy.projBudget.DetailDialog",
					controller : oFragmentController
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
				//Fragment.load().then()
			} else{
				oView.byId("projectdetailDialog").open();
			}
		},

		/**********************************************************************************
		 * 함수 내용 : 승인rfc
		 **********************************************************************************/
		ApproveRfcFunction : function(projectModelA, PICODE){
			var oView = this.getView();
			var oModel = oView.getModel("projectinitsun");
			var oIndices = this.byId("productslist").getSelectedIndices()
			for(var i=0;  i < oIndices.length ; i++){
				var oSelectData = oModel.getProperty("/detail/"+ oIndices[i]);
				var PICODE = oSelectData.PICODE; 
				var REBUD = oSelectData.REBUD;
				var STATUS = oSelectData.STATUS;
				var PCODE = oSelectData.PCODE;
				this.getOwnerComponent().rfcCall("ZB_APRROVE_BUDGET", {  
					I_PICODE : PICODE,
					I_REBUD : REBUD,
					I_STATUS : STATUS,
					I_PCODE : PCODE
				}).done(function(oResultData2){   // RFC호출 완료
					console.log(oResultData2.ZBPTAB4)
					oModel.setProperty("/projBudgetAccept", oResultData2.ZBPTAB4);
				}).fail(function(sErrorMessage){// 호출 실패
					alert(sErrorMessage);
					})
				}
			},

		/**********************************************************************************
		 * 함수 내용 : 반려rfc
		 **********************************************************************************/
		RejectRfcFunction : function(){
			var oView = this.getView();
			var oModel = oView.getModel("projectinitsun");
			var oIndices = this.byId("productslist").getSelectedIndices()
			for(var i=0;  i < oIndices.length ; i++){
				var oSelectData = oModel.getProperty("/detail/"+ oIndices[i]);
				var PICODE = oSelectData.PICODE; 
				var RETCODE = oModel.getProperty("/comboData");
				var REJTEXT = oModel.getProperty("/inputData");
				this.getOwnerComponent().rfcCall("ZB_REJECT_BUDGET", {  
					I_PICODE : PICODE,
					I_RETCODE : RETCODE,
					I_REJTEXT : REJTEXT
				}).done(function(oResultData2){   // RFC호출 완료
					console.log(oResultData2.ZBPTAB4)
					oModel.setProperty("/projBudgetReject", oResultData2.ZBPTAB5);
				}).fail(function(sErrorMessage){// 호출 실패
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
			var oModel=oView.getModel("projectinitsun");
			var getIndex = this.byId("productslist").getSelectedIndex();
			var getIndices = this.byId("productslist").getSelectedIndices();
			var bApproveCheck = false;

			//미결상태 && SelectedIndex가 존재여부 check
			for(var i = 0; i < getIndices.length; i++){
				if(getIndex >= 0 || oModel.getProperty("/detail/"+getIndices[i]+"/STATUS") === '0'){
					bApproveCheck = true;
				}
			}

			//승인 Process
			if(bApproveCheck){
				MessageBox.confirm("승인하시겠습니까?", {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],

					//닫기 Event
					onClose: function (sAction) {
						if(sAction === "OK"){
							MessageToast.show("승인되었습니다");
							//승인 rfc
							that.ApproveRfcFunction();
							//SelectedIndex 초기화
							that.byId("productslist").removeSelectionInterval(0,oModel.getData().detail.length)
							//Detail rfc
							that.onDetailRFC();
						}
					}
				});
			}else{
				//미결 or selectedIndex가 없을 경우
				MessageBox.error("승인건을 선택해주세요")
			}
		},
		/**********************************************************************************
		 * 함수 내용 : 반려 Button Event
		 **********************************************************************************/
		rejOpen : function(oEvent){
			var oView = this.getView();
			var oModel = oView.getModel("projectinitsun");
			var that = this;
			var status = oModel.getProperty("/detail");
			var getIndex = this.byId("productslist").getSelectedIndex();
			var getIndices = this.byId("productslist").getSelectedIndices();
			var bRejectCheck = false;

			//미결상태 && SelectedIndex가 존재여부 check
			for(var i = 0; i < getIndices.length; i++){
				if(getIndex >= 0 || oModel.getProperty("/detail/"+getIndices[i]+"/STATUS") === '0'){
					bRejectCheck = true;
				}
			}

		//반려 process
		if(bRejectCheck){
			if(!oView.byId("rejectDialog")) {
				var oFragmentController = {
					//닫기 Event
				   onCloseMsg : function(rEvent){
					//반려코드랑 내역 모두 넣었는지 check
					   if(oModel.getProperty("/comboData") && oModel.getProperty("/inputData")){
						   oView.byId("rejectDialog").close();
						   //반려하기 전 confirmmessage
							MessageBox.confirm("반려하시겠습니까?" , {
							   actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
							   onClose: function (sAction) {
								   //반려
								   if(sAction === "OK"){
									   MessageToast.show("반려되었습니다");
									   //반려 rfc
									   that.RejectRfcFunction();
									   //반려 입력값 초기화
									   oModel.setProperty("/comboData", null); 
										oModel.setProperty("/inputData", null); 
										//SelectedIndex 초기화
										that.byId("productslist").removeSelectionInterval(0,oModel.getData().detail.length)
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
					//반려dialog 닫기 Event
				   onCloseDialog : function(){
						   oView.byId("rejectDialog").close();
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
				   name: "ExpenseManagement.view.budget.sy.projBudget.RejectForm",
				   controller : oFragmentController
			   }).then(function(oDialog){
				   oView.addDependent(oDialog);
				   oDialog.open();
			   });
			   //Fragment.load().then()
		   } else{
			   this.byId("rejectDialog").open();
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
		 * 함수 내용 : 반려사유 link Event
		 **********************************************************************************/
		rejView : function(oEvent){
			var oView = this.getView();
			var oModel = oView.getModel("projectinitsun");
			var sPath = oEvent.getSource().getBindingContext("projectinitsun").getPath();
			var oSelectData = oModel.getProperty(sPath);
			oModel.setProperty("/RejectViewData",oSelectData);

			if(!oView.byId("projectrejectDialog2")) {
				var oFragmentController = {
					//닫기 Event
				   onCloseDialog : function(oEvent){
						   oView.byId("projectrejectDialog2").close();
						   oModel.setProperty("/comboData", null); 
						   oModel.setProperty("/inputData", null);
					   }
			   };  
			   // load asynchronous XML fragment
			   Fragment.load({
				   id: oView.getId(),
				   name: "ExpenseManagement.view.budget.sy.projBudget.RejectView",
				   controller : oFragmentController
			   }).then(function(oDialog){
				   oView.addDependent(oDialog);
				   oDialog.open();
			   });
			   //Fragment.load().then()
		   } else{
			   this.byId("projectrejectDialog2").open();
		   }
		},

		/**********************************************************************************
		 * 함수 내용 : 프로젝트 link Event
		 **********************************************************************************/
		proOpen : function(oEvent){
			var oView = this.getView();
			var oModel = oView.getModel("projectinitsun");
			var sPath = oEvent.getSource().getBindingContext("projectinitsun").getPath();
			var oSelectData = oModel.getProperty(sPath);
			oModel.setProperty("/projectData",oSelectData)
			//create dialog 
			if(!oView.byId("ProjectForm")) {
				var oFragmentController = {
						onCloseDialog : function(){
							oView.byId("ProjectForm").close();
							 oModel.setProperty("/projectData",null) 
						}
				};
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.budget.sy.projBudget.ProjectForm",
					controller : oFragmentController
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
				//Fragment.load().then()
			} else{
				oView.byId("ProjectForm").open();
			}
			var PNAME = oSelectData.PNAME
				this.getOwnerComponent().rfcCall("ZB_GET_DETAIL_PROJECT",{
					I_PNAME : PNAME
				}).done(function(oResultData){
					// RFC호출 완료
					console.log(oResultData.ZBPTAB3);
					oModel.setProperty("/projectData", oResultData.ZBPTAB3);
				}).fail(function(sErrorMessage){
					// 호출 실패
					alert(sErrorMessage);
				})

		},

		/**********************************************************************************
		 * 함수 내용 : 프로젝트매니저 link Event
		 **********************************************************************************/
		pmOpen : function(oEvent){
			var oView = this.getView();
			var oModel = oView.getModel("projectinitsun");
			var sPath = oEvent.getSource().getBindingContext("projectinitsun").getPath();
			var oSelectData = oModel.getProperty(sPath);
			oModel.setProperty("/pmData",oSelectData)
			//create dialog 
			if(!oView.byId("PMForm")) {
				var oFragmentController = {
						//닫기 Event
						onCloseDialog : function(){
							oView.byId("PMForm").close();
							oModel.setProperty("/pmData",null)
						},
						//mail보내기 Event
						openemail  : function (oEvent) {
							var oEmail = oModel.getProperty("/pmData")[0].EMAIL
							sap.m.URLHelper.triggerEmail(oEmail);
						 }
				};
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.budget.sy.projBudget.PMForm",
					controller : oFragmentController
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
				//Fragment.load().then()
			} else{
				oView.byId("PMForm").open();
			}

			//rfc call
			var AUNAME = oSelectData.AUNAME
			this.getOwnerComponent().rfcCall("ZB_GET_PM",{
				I_ENAME : AUNAME
			}).done(function(oResultData)
				{	// RFC호출 완료
					console.log(oResultData.ZBTTAB3);
					oModel.setProperty("/pmData", oResultData.ZBTTAB3);
				}).fail(function(sErrorMessage){// 호출 실패
					alert(sErrorMessage);
				})
		},

	})
})