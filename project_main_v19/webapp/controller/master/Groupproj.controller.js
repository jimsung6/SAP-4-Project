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
 
	var TableController= Controller.extend("ExpenseManagement.controller.master.Groupproj", {
		
		
	   onInit : function() {
		  
		  var oModel = new JSONModel({currency: "KRW"});
		  this.getView().setModel(oModel, "group");
		  
		  this.getOwnerComponent().rfcCall("ZB_GET_GCODE", {   
 
		  }).done(function(oResultData){   // RFC호출 완료
			 for (var i=0; i<oResultData.T_TAB1.length; i++) {
			 //    if (oResultData.T_TAB1[i].SDATE === "0000-00-00") {
			 //       oResultData.T_TAB1[i].SDATE = "0";
			 //    }
				   oModel.setData(oResultData);
			 }   
		  }).fail(function(sErrorMessage){
			 alert(sErrorMessage);
		  });
		  
		  
		 this.oTable = this.byId("Groupproj");
		 
		 this.oReadOnlyTemplate = this.byId("Groupproj").removeItem(0);
		 
		 this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		 
		 this.oEditableTemplate = new ColumnListItem({
			 cells: [
				 new Text({
					 text: "{group>GCODE}"
				 }),	new Input({
					 value: "{group>GNAME}"
				 }), new Input({
					 value: "{group>AUEMP}",
					 type: "Number"
				 }),	new Input({
					 value: "{group>AUTNM}"
				 }), new Input({
					 value: "{group>SDATE}"
				 }), new Input({
					 value: "{group>EDATE}"
				 }), new Input({
					 value: "{group>PYEMP}",
					 type: "Number"
				 }),	new Input({
					 value: "{group>PAYNM}"
				 })
				 ]
		  
			 });
		 
		  
		 },
		 
		   rebindTable: function(oTemplate, sKeyboardMode) {
			   
			   
			 this.oTable.bindItems({
				 path: "group>/T_TAB1",
				 template: oTemplate,
				 templateShareable: true
				 // key: "accounts>CACNR",
			 }).setKeyboardMode(sKeyboardMode);
			 },
	   
	   
		 onCreateDialog : function() {
				if (!this.byId("CreateGroup")) {
				  var oView = this.getView();
				  Fragment.load({
						 id: oView.getId(),
						 name: "ExpenseManagement.view.master.CreateGroupDialog",
						 controller : this
				 }).then(function (oDialog) {
						 oView.addDependent(oDialog);
						 oDialog.open();
				 });
				}
				var oMM = Core.getMessageManager();
				oMM.registerObject(this.byId("ngcode"), true);
			 
		  },
 
 
		 _validateInput: function (oInput) {
			 var sValueState = "None";
			 var bValidationError = false;
			 var oRex = /[A-Z]/;
			 var oTab = this.getView().getModel("group").getData().T_TAB1;
			 var bDupl = false;
			 
			 for (var i=0; i<oTab.length; i++) {
				 if (oInput.getValue() === oTab[i].GCODE) {
					 bDupl = true;
					 break;
				 }
			 }
			 
			 try {
				 if (!oInput.getValue()) {
					 throw new ValidateException();
				 // }else if (!oRex.test(oInput.getValue())) {
				 // 	throw new ValidateException();
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
				 oInput.setValueStateText("3자리의 부서코드를 입력하세요. 부서코드는 중복될 수 없습니다.");
			 // }else if (!oRex.test(oInput.getValue())) {
			 // 	oInput.setValueStateText("알파벳과 숫자 조합으로만 입력 가능합니다!");
			 }else if (oInput.getValue().length > 3) {
				 oInput.setValueStateText("부서코드는 3자리를 초과할수 없습니다!");
			 }else if (bDupl) {
				 oInput.setValueStateText("부서코드가 중복됩니다! 다른 부서코드를 입력하세요");
			 }
			 
			 
			 return bValidationError;
		 },
		 
		 
		 onGcodeChange : function(oEvent) {
			 var oInput = oEvent.getSource();
			 oInput.setValue(oInput.getValue().toUpperCase());
			 this._validateInput(oInput);
		 },
		 
		 onCreateGroup : function(oEvent) {
			 
			 var aInput = this.byId("ngcode"),
				 bValidationError = this._validateInput(aInput);
 
			 
			 if (bValidationError) {
				 MessageBox.alert("입력값을 다시 확인하세요.");
			 }else {
				 var oModel = this.getView().getModel("group");
				 var NewGroup = {
					 MANDT : "230",
					 GCODE : "",
					 GNAME : "",
					 AUEMP : "",
					 AUTNM : "",
					 SDATE : "",
					 EDATE : "",
					 PYEMP : "",
					 PAYNM : ""
				 };
				 
				 NewGroup.GCODE = this.byId("ngcode").getProperty("value");
				 NewGroup.GNAME = this.byId("ngname").getProperty("value");
				 NewGroup.AUEMP = this.byId("nauemp").getProperty("value");
				 NewGroup.AUTNM = this.byId("nautnm").getProperty("value");
				 NewGroup.SDATE = this.byId("nsdate").getProperty("value");
				 NewGroup.EDATE = this.byId("nedate").getProperty("value");
				 NewGroup.PYEMP = this.byId("npyemp").getProperty("value");
				 NewGroup.PAYNM = this.byId("npaynm").getProperty("value");
				 
			 
				 this.getOwnerComponent().rfcCall("ZB_CREATE_GROUP", {
				 I_GROUP: NewGroup
				  }).done(function(oResultData){   // RFC호출 완료
					 for (var j=0; j<oResultData.T_TAB1.length; j++) {
					 //   if (oResultData.T_TAB1[j].SDATE === "0000-00-00") {
					 //       oResultData.T_TAB1[j].SDATE = "0";
					 //   }
						   
					 }
					 oModel.setData(oResultData);
				  }).fail(function(sErrorMessage){
					 alert(sErrorMessage);
				  });
				 
				 
				 
				 //다이얼로그창 닫기
				 this.byId("CreateGroup").close();
				 this.byId("CreateGroup").destroy();
				 MessageToast.show("새로운 조직이 생성되었습니다.");   //메세지 생성
				 
				 
				 this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			 }
			 
			 
			 },
		 
		 onEditGroup : function() {
			 this.aTab = deepExtend([], this.getView().getModel("group").getData());
			 this.byId("Groupproj").setMode("None");                
			 this.byId("createButton").setVisible(false);
			 this.byId("editButton").setVisible(false);
			 this.byId("deleteButton").setVisible(false);
			 this.byId("saveButton").setVisible(true);
			 this.byId("cancelButton").setVisible(true);
			 this.rebindTable(this.oEditableTemplate, "Edit");
		 },
		 
		 onDeleteGroup : function() {
 
			 var oModel = this.getView().getModel("group");
			 var aTab = oModel.getData().T_TAB1;
			 var oTable = this.byId("Groupproj");
			 var aSelectedPaths = oTable._aSelectedPaths;
			 var aSelectedGroup = new Array();
			 var that = this;
			 if (aSelectedPaths.length === 0) {
				 MessageBox.error("부서를 선택하세요");
			 }else {
				 MessageBox.confirm("삭제하시겠습니까?", {
				 actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				 onClose: function(sAction){
				 if(sAction ===  "YES") {
					 for (var i=0; i<aSelectedPaths.length; i++) {
						 var aIndex = parseInt(aSelectedPaths[i].replace("/T_TAB1/",""));
						 aSelectedGroup.push(that.getView().getModel("group").getData().T_TAB1[aIndex]);         
					 }
					 aSelectedPaths.length = 0;
					 
					 for(var k = 0; k < aTab.length ; k++ ){
						 var splitData = aTab[k].SDATE.split('-');
						 aTab[k].SDATE = splitData[0] + splitData[1] + splitData[2];
			 
						 if(aTab[k].SDATE === "0") {
							 aTab[k].SDATE = "";
						 }
					 }
					 
					 
					 that.getOwnerComponent().rfcCall("ZB_DELETE_GROUP", {
					 T_TAB1: aSelectedGroup
					  }).done(function(oResultData){   // RFC호출 완료
						  for (var j=0; j<oResultData.T_TAB1.length; j++) {
						 //   if (oResultData.T_TAB1[j].SDATE === "0000-00-00") {
						 //       oResultData.T_TAB1[j].SDATE = "0";
						 //   }
							   
						  }
						 oModel.setData(oResultData);
					  }).fail(function(sErrorMessage){
						 alert(sErrorMessage);
					  });
					  
					 that.rebindTable(that.oReadOnlyTemplate, "Navigation");
					 MessageToast.show("부서정보가 삭제되었습니다.");
					 
				 }else {
					 MessageToast.show("작업이 취소되었습니다.");
				 }
				 }
			 });
			 }
		 },
			 
		 
		 
		 onSave: function() {
			 this.byId("Groupproj").setMode("MultiSelect"); 
			 this.byId("createButton").setVisible(true);
			 this.byId("saveButton").setVisible(false);
			 this.byId("cancelButton").setVisible(false);
			 this.byId("editButton").setVisible(true);
			 this.byId("deleteButton").setVisible(true);
			 
			 var oModel = this.getView().getModel("group");
			 var tab = oModel.getData().T_TAB1;
			 
			 for(var i = 0; i < tab.length ; i++ ){
				 var splitData = tab[i].SDATE.split('-');
				 tab[i].SDATE = splitData[0] + splitData[1] + splitData[2];
	 
				 if(tab[i].SDATE === "0") {
					 tab[i].SDATE = "";
				 }
			 }
 
			 
			 
			 this.getOwnerComponent().rfcCall("ZB_SAVE_GROUP", {
			 T_TAB1: tab
			  }).done(function(oResultData){   // RFC호출 완료
				 for (var j=0; j<oResultData.T_TAB1.length; j++) {
				 //    if (oResultData.T_TAB1[j].SDATE === "0000-00-00") {
				 //       oResultData.T_TAB1[j].SDATE = "0";
				 //    }
					   oModel.setData(oResultData);
				 }   
				 
			  }).fail(function(sErrorMessage){
				 alert(sErrorMessage);
			  });
			  
			  
			  this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			  MessageToast.show("변경된 정보가 저장되었습니다.");
		 },
 
		 onCancel: function() {
			 this.byId("Groupproj").setMode("MultiSelect"); 
			 this.byId("createButton").setVisible(true);
			 this.byId("cancelButton").setVisible(false);
			 this.byId("saveButton").setVisible(false);
			 this.byId("editButton").setVisible(true);
			 this.byId("deleteButton").setVisible(true);
			   
			   this.getView().getModel("group").setData(this.aTab);
			 this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		 },
		 
		 
		 onCloseDialog : function () {
				 
			 if(this.byId("CreateGroup")) {
				 this.byId("CreateGroup").destroy();
			 }else if(this.byId("DeleteGroup")) {
				 this.byId("DeleteGroup").destroy();
			 }
				 
		 }
	});
	return TableController;
	
 });