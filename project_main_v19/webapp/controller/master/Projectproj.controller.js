sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/Fragment",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/base/util/deepExtend",
	"sap/m/ColumnListItem",
	"sap/m/Input",
	"sap/m/Text",
	"sap/ui/core/UIComponent",
	"sap/ui/model/ValidateException",
	"sap/ui/core/Core"
  ], function(Controller, JSONModel, Fragment, MessageToast, MessageBox, deepExtend, ColumnListItem, Input, Text, UIComponent,
		   ValidateException, Core) {
			  
	"use strict";
  
	var TableController= Controller.extend("ExpenseManagement.controller.master.Projectproj", {
	   
	   
	   onInit : function() {
		 
		  var oModel = new JSONModel({currency: "KRW"});
		  this.getView().setModel(oModel, "project");
		  
		  this.getOwnerComponent().rfcCall("ZB_GET_PCODE", {   
	 
		  }).done(function(oResultData){   // RFC호출 완료
		   console.log(oResultData)
		  //   for (var i=0; i<oResultData.T_TAB1.length; i++) {
		  //    var aaa = oResultData.T_TAB1[i].PMONEY.toString().split("");
		  //    var bbb = "";
		  //    var cnt = 0;
	
		  //    for(var j = aaa.length-1 ; j >= 0 ; j--){
		  //       cnt++
		  //       bbb = aaa[j] + bbb;
		  //       if(cnt % 3 === 0 && cnt !== aaa.length ){
		  //         bbb = "," + bbb;
		  //       }
		  //    }
		  //    oResultData.T_TAB1[i].PMONEY = bbb;
	
		  //    // if (oResultData.T_TAB1[i].SDATE === "0000-00-00") {
		  //    //    oResultData.T_TAB1[i].SDATE = "0";
		  //    // }
		  //       oModel.setData(oResultData);
		  //   }   
		  oModel.setData(oResultData);
		  }).fail(function(sErrorMessage){
			alert(sErrorMessage);
		  });
		 
		this.oTable = this.byId("Projectproj");
		
		this.oReadOnlyTemplate = this.byId("Projectproj").removeItem(0);
		
		this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		
		this.oEditableTemplate = new ColumnListItem({
		   cells: [
			  new Text({
				 text: "{project>PCODE}"
			  }),   new Input({
				 value: "{project>PNAME}"
			  }), new Input({
				 value: "{project>AUEMP}"
				 // ,
				 // type: "Number"
			  }),   new Input({
				 value: "{project>AUTNM}"
			  }),   new Input({
				 value: "{project>PMONEY}"
				 // ,
				 // type: "Number"
			  }), new Input({
				 value: "{project>SDATE}"
				 // ,
				 // type: "Number"
			  }), new Input({
				 value: "{project>EDATE}"
				 // ,
				 // type: "Number"
			  }), new Input({
				 value: "{project>PTEXP}"
			  }), new Input({
				 value: "{project>ZCLNT}"
			  }), new Input({
				 value: "{project>PYEMP}"
				 // ,
				 // type: "Number"
			  }),   new Input({
				 value: "{project>PAYNM}"
			  })
			  ]
		   });
		},
 
		setComma : function (sText) {
			 var bbb = "";
			 var cnt = 0;
 
		  if( sText ) {
			 sText = "" + sText;
			 for(var j = sText.length-1 ; j >= 0 ; j--){
				cnt++
				bbb = sText[j] + bbb;
				if(cnt % 3 === 0 && cnt !== sText.length ){
				   bbb = "," + bbb;
				}
			  }
		  }
			
			 return bbb;
		},
 
		
		
		  rebindTable: function(oTemplate, sKeyboardMode) {
		   this.oTable.bindItems({
			  path: "project>/T_TAB1",
			  template: oTemplate,
			  templateShareable: true
			  // key: "accounts>CACNR",
		   }).setKeyboardMode(sKeyboardMode);
		   },
	   
		onCreateDialog : function() {
			 if (!this.byId("CreateProject")) {
			   var oView = this.getView();
			   Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.master.CreateProjectDialog",
					controller : this
			  }).then(function (oDialog) {
					oView.addDependent(oDialog);
					oDialog.open();
			  });
			 }
			 var oMM = Core.getMessageManager();
			 oMM.registerObject(this.byId("npcode"), true);
		 },
  
		_validateInput: function (oInput) {
		   var sValueState = "None";
		   var bValidationError = false;
		   var oRex = /[A-Z]/;
		   var oTab = this.getView().getModel("project").getData().T_TAB1;
		   var bDupl = false;
		   
		   for (var i=0; i<oTab.length; i++) {
			  if (oInput.getValue() === oTab[i].PCODE) {
				 bDupl = true;
				 break;
			  }
		   }
		   
		   try {
			  if (!oInput.getValue()) {
				 throw new ValidateException();
			  }else if (!oRex.test(oInput.getValue())) {
				 throw new ValidateException();
			  }else if (oInput.getValue().length > 3) {
				 throw new ValidateException();
			  }else if (bDupl) {
				 throw new ValidateException();
			  }
		   } catch (oException) {
			  sValueState = "Error";
			  bValidationError = true;
		   }
		   
		   oInput.setValueState(sValueState);
		   
		   if (!oInput.getValue()) {
			  oInput.setValueStateText("3자리의 프로젝트 코드를 입력하세요. 프로젝트 코드는 중복될 수 없습니다.");
		   }else if (!oRex.test(oInput.getValue())) {
			  oInput.setValueStateText("알파벳과 숫자 조합으로만 입력 가능합니다!");
		   }else if (oInput.getValue().length > 3) {
			  oInput.setValueStateText("프로젝트 코드는 3자리를 초과할수 없습니다!");
		   }else if (bDupl) {
			  oInput.setValueStateText("프로젝트 코드가 중복됩니다! 다른 프로젝트 코드를 입력하세요");
		   }   
		   return bValidationError;
		},      
		
		onPcodeChange : function(oEvent) {
		   var oInput = oEvent.getSource();
		   oInput.setValue(oInput.getValue().toUpperCase());
		   this._validateInput(oInput);
		},
		
		onCreateProject : function(oEvent) {
		   
		   var aInput = this.byId("npcode"),
			  bValidationError = this._validateInput(aInput);
		   
		   if (bValidationError) {
			  MessageBox.alert("입력값을 다시 확인하세요.");
		   }else {
			  var oModel = this.getView().getModel("project");
			  var Newproject = {
				 MANDT : "230",
				 PCODE : "",
				 PNAME : "",
				 AUEMP : "",
				 AUTNM : "",
				 PMONEY : "",
				 SDATE : "",
				 EDATE : "",
				 PTEXP : "",
				 ZCLNT : "",
				 PYEMP : "",
				 PAYNM : ""
			  };
			  
			  Newproject.PCODE = this.byId("npcode").getProperty("value");
			  Newproject.PNAME = this.byId("npname").getProperty("value");
			  Newproject.AUEMP = this.byId("nauemp").getProperty("value");
			  Newproject.AUTNM = this.byId("nautnm").getProperty("value");
			  Newproject.PMONEY = this.byId("npmoney").getProperty("value");
			  Newproject.SDATE = this.byId("nsdate").getProperty("value");
			  Newproject.EDATE = this.byId("nedate").getProperty("value");
			  Newproject.PTEXP = this.byId("nptexp").getProperty("value");
			  Newproject.ZCLNT = this.byId("nzclnt").getProperty("value");
			  Newproject.PYEMP = this.byId("npyemp").getProperty("value");
			  Newproject.PAYNM = this.byId("npaynm").getProperty("value");
					   
			  this.getOwnerComponent().rfcCall("ZB_CREATE_PROJECT", {
			  I_PROJECT: Newproject
			   }).done(function(oResultData){   // RFC호출 완료
				 for (var j=0; j<oResultData.T_TAB1.length; j++) {
				//    if (oResultData.T_TAB1[j].SDATE === "0000-00-00") {
				//       oResultData.T_TAB1[j].SDATE = "0";
				//    }     
				 }
				 oModel.setData(oResultData);
			   }).fail(function(sErrorMessage){
				 alert(sErrorMessage);
			   });
				 
			  //다이얼로그창 닫기
			  this.byId("CreateProject").close();
			  this.byId("CreateProject").destroy();
			  MessageToast.show("새로운 프로젝트가 생성되었습니다.");   //메세지 생성
						  
			  this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		   }
		},
		
		onEditProject : function() {
		   
		  //  var oModel = this.getView().getModel("project");
		  //  var tab = oModel.getData().T_TAB1;
		  //  var oTable = this.byId("Projectproj");
		  //  var aSelectedPaths = oTable._aSelectedPaths;
				 
		  
		   this.aTab = deepExtend([], this.getView().getModel("project").getData());
		   this.byId("Projectproj").setMode("None");                
		   this.byId("createButton").setVisible(false);
		   this.byId("editButton").setVisible(false);
		   this.byId("deleteButton").setVisible(false);
		   this.byId("saveButton").setVisible(true);
		   this.byId("cancelButton").setVisible(true);
		   this.rebindTable(this.oEditableTemplate, "Edit");
		   
		},
		
		onDeleteProject : function() {
  
		   var oModel = this.getView().getModel("project");
		   var aTab = oModel.getData().T_TAB1;
		   var oTable = this.byId("Projectproj");
		   var aSelectedPaths = oTable._aSelectedPaths;
		   var aSelectedProject = new Array();
		   var that = this;
		   if (aSelectedPaths.length === 0) {
			  MessageBox.error("프로젝트를 선택하세요");
		   }else {
			  MessageBox.confirm("삭제하시겠습니까?", {
			  actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
			  onClose: function(sAction){
			  if(sAction ===  "YES") {
				 for (var i=0; i<aSelectedPaths.length; i++) {
					var aIndex = parseInt(aSelectedPaths[i].replace("/T_TAB1/",""));
					aSelectedProject.push(that.getView().getModel("project").getData().T_TAB1[aIndex]);         
				 }
				 aSelectedPaths.length = 0;
				 
				 for(var k = 0; k < aTab.length ; k++ ){
					var splitData = aTab[k].SDATE.split('-');
					aTab[k].SDATE = splitData[0] + splitData[1] + splitData[2];
		   
					if(aTab[k].SDATE === "0") {
					   aTab[k].SDATE = "";
					}
				 }
				 
				 
				 that.getOwnerComponent().rfcCall("ZB_DELETE_PROJECT", {
				 T_TAB1: aSelectedProject
				  }).done(function(oResultData){   // RFC호출 완료
				   console.log(oResultData)
					 for (var j=0; j<oResultData.T_TAB1.length; j++) {
				   //    if (oResultData.T_TAB1[j].SDATE === "0000-00-00") {
				   //       oResultData.T_TAB1[j].SDATE = "0";
				   //    }
						 
					 }
					oModel.setData(oResultData);
				  }).fail(function(sErrorMessage){
					alert(sErrorMessage);
				  });
				  
				 that.rebindTable(that.oReadOnlyTemplate, "Navigation");
				 MessageToast.show("프로젝트 정보가 삭제되었습니다.");
				 
			  }else {
				 MessageToast.show("작업이 취소되었습니다.");
			  }
			  }
		   });
		   }
		},
		
		onSave: function() {
		   this.byId("Projectproj").setMode("MultiSelect"); 
		   this.byId("createButton").setVisible(true);
		   this.byId("saveButton").setVisible(false);
		   this.byId("cancelButton").setVisible(false);
		   this.byId("editButton").setVisible(true);
		   this.byId("deleteButton").setVisible(true);
		   
		   var oModel = this.getView().getModel("project");
		   var tab = oModel.getData().T_TAB1;
		   var oTable = this.byId("Projectproj");
		   var aSelectedPaths = oTable._aSelectedPaths;
					
				//  for(var i = 0; i < tab.length ; i++ ){
				//     var splitData = tab[i].SDATE.split('-');
				//     tab[i].SDATE = splitData[0] + splitData[1] + splitData[2];
		   
				//     if(tab[i].SDATE === "0") {
				//        tab[i].SDATE = "";
				//     }
				//  }
			  
			  this.getOwnerComponent().rfcCall2("ZB_SAVE_PROJECT", {
			  T_TAB1: tab
			   }).done(function(oResultData){   // RFC호출 완료
				 for (var j=0; j<oResultData.T_TAB1.length; j++) {
				   // if (oResultData.T_TAB1[j].SDATE === "0000-00-00") {
				   //    oResultData.T_TAB1[j].SDATE = "0";
				   // }
					  oModel.setData(oResultData);
				 }   
				 
				 
			   }).fail(function(sErrorMessage){
				 MessageToast.show("입력값을 다시 확인하세요.");
			   });
			   this.rebindTable(this.oReadOnlyTemplate, "Navigation");
				 MessageToast.show("변경된 정보가 저장되었습니다.");   
		},
  
		onCancel: function() {
		   this.byId("Projectproj").setMode("MultiSelect"); 
		   this.byId("createButton").setVisible(true);
		   this.byId("cancelButton").setVisible(false);
		   this.byId("saveButton").setVisible(false);
		   this.byId("editButton").setVisible(true);
		   this.byId("deleteButton").setVisible(true);
			 
		   this.getView().getModel("project").setData(this.aTab);
		   this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},
		
		onCloseDialog : function () {
			
		   if(this.byId("CreateProject")) {
			  this.byId("CreateProject").destroy();
		   }else if(this.byId("DeleteProject")) {
			  this.byId("DeleteProject").destroy();
		   }
		}
	});
	return TableController;
	
  });