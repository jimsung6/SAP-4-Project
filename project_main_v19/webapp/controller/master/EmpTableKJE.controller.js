//김지언 : 사원정보 마스터
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
 
	 return Controller.extend("ExpenseManagement.controller.master.EmpTableKJE", {
		 
		 onInit : function() {
			 
			 var oModel = new JSONModel();
			 this.getView().setModel(oModel, "employeeKJE");
			 
			 this.getOwnerComponent().rfcCall("ZB_GET_EMP", {
				 //RFC Import 데이터
			 }).done(function(oResultData){	// RFC호출 완료
				 console.log(oResultData);
				 oModel.setData(oResultData);
			 }).fail(function(sErrorMessage){// 호출 실패
				 alert(sErrorMessage);
			 });
		 
		 this.oTable = this.byId("emptable");
        
		 this.oReadOnlyTemplate = this.byId("emptable").removeItem(0);
		 
		 this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		 
		 this.oEditableTemplate = new ColumnListItem({
			 cells: [
				 new Text({
					 text: "{employeeKJE>EMPNO}"
				 }), new Input({
					 value: "{employeeKJE>ENAME}"
				 }), new Input({
					 value: "{employeeKJE>JOB}",
				 }), new Input({
					 value: "{employeeKJE>GCODE}",
					 type: "Number"
				 }), new Input({
					 value: "{employeeKJE>BANKL}"
				 }), new Input({
					 value: "{employeeKJE>ECACCT}"
				 }), new Input({
					 value: "{employeeKJE>PNUM}",
				 }),	new Input({
					 value: "{employeeKJE>EMAIL}"
				 })
				 ]
		  
			 });
		 
		  
		 },
		 
		   rebindTable : function(oTemplate, sKeyboardMode) {
			   
			   
			 this.oTable.bindItems({
				 path: "employeeKJE>/T_TAB1",
				 template: oTemplate,
				 templateShareable: true
			 }).setKeyboardMode(sKeyboardMode);
			 },
	   
	   
		 onCreateDialog : function() {
				if (!this.byId("CreateEmployee")) {
				  var oView = this.getView();
				  Fragment.load({
						 id: oView.getId(),
						 name: "ExpenseManagement.view.master.CreateEmpDialog",
						 controller : this
				 }).then(function (oDialog) {
						 oView.addDependent(oDialog);
						 oDialog.open();
				 });
				}
				var oMM = Core.getMessageManager();
				oMM.registerObject(this.byId("nempno"), true);
			 
		  },
 
 
		 _validateInput: function (oInput) {
			 var sValueState = "None";
			 var bValidationError = false;
			 var oTab = this.getView().getModel("employeeKJE").getData().T_TAB1;
			 var bDupl = false;
			 
			 for (var i=0; i<oTab.length; i++) {
				 if (oInput.getValue() === oTab[i].EMPNO) {
					 bDupl = true;
					 break;
				 }
			 }
			 
			 try {
				 if (!oInput.getValue()) {
					 throw new ValidateException();
				 }else if (oInput.getValue().length > 11) {
					 throw new ValidateException();
				 }else if (oInput.getValue().length < 11) {
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
				 oInput.setValueStateText("11자리의 사원번호를 입력하세요. 사원번호는 중복될 수 없습니다.");
			 // }else if (!oRex.test(oInput.getValue())) {
			 // 	oInput.setValueStateText("알파벳과 숫자 조합으로만 입력 가능합니다!");
			 }else if (oInput.getValue().length > 11) {
				 oInput.setValueStateText("사원번호는 11자리를 초과할수 없습니다.");
			 }else if (bDupl) {
				 oInput.setValueStateText("사원번호가 중복됩니다. 입력값을 확인해주세요.");
			 }
			 
			 
			 return bValidationError;
		 },
		 
		 
		 onEmployeeChange : function(oEvent) {
			 var oInput = oEvent.getSource();
			 oInput.setValue(oInput.getValue().toUpperCase());
			 this._validateInput(oInput);
		 },
		 
		 onCreateEmployee : function(oEvent) {
			 
			 var aInput = this.byId("nempno"),
				 bValidationError = this._validateInput(aInput);
 
			 
			 if (bValidationError) {
				 MessageBox.alert("입력값을 다시 확인하세요.");
			 }else {
				 var oModel = this.getView().getModel("employeeKJE");
				 var NewEmployee = {
					 MANDT : "230",
					 EMPNO : "",
					 ENAME : "",
					 PWORD : "",
					 JOB : "",
					 GCODE : "",
					 BANKL : "",
					 ECACCT : "",
					 AUCODE : "",
					 PNUM : "",
					 EMAIL : ""
				 };
				 
				 NewEmployee.EMPNO = this.byId("nempno").getProperty("value");
				 NewEmployee.ENAME = this.byId("nename").getProperty("value");
				 NewEmployee.PWORD = this.byId("npword").getProperty("value");
				 NewEmployee.JOB = this.byId("njob").getProperty("value");
				 NewEmployee.GCODE = this.byId("ngcode").getProperty("value");
				 NewEmployee.BANKL = this.byId("nbankl").getProperty("value");
				 NewEmployee.ECACCT = this.byId("necacct").getProperty("value");
				 NewEmployee.AUCODE = this.byId("naucode").getProperty("value");
				 NewEmployee.PNUM = this.byId("npnum").getProperty("value");
				 NewEmployee.EMAIL = this.byId("nemail").getProperty("value");
				 
			 
				 this.getOwnerComponent().rfcCall("ZB_CREATE_EMP", {
				 I_EMP: NewEmployee
				  }).done(function(oResultData){   // RFC호출 완료
					 oModel.setData(oResultData);
				  }).fail(function(sErrorMessage){
					 alert(sErrorMessage);
				  });
				 
				 
				 
				 //다이얼로그창 닫기
				 this.byId("CreateEmployee").close();
				 this.byId("CreateEmployee").destroy();
				 MessageToast.show("새로운 사원 정보가 생성되었습니다.");   //메세지 생성
				 
				 
				 this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			 }
			 
			 
			 },
		 
		 onEditEmployee : function() {
			 this.aTab = deepExtend([], this.getView().getModel("employeeKJE").getData());
			 this.byId("emptable").setMode("None");                
			 this.byId("createButton").setVisible(false);
			 this.byId("editButton").setVisible(false);
			 this.byId("deleteButton").setVisible(false);
			 this.byId("saveButton").setVisible(true);
			 this.byId("cancelButton").setVisible(true);
			 this.rebindTable(this.oEditableTemplate, "Edit");
		 },
		 
		 onDeleteEmployee : function() {
 
			 var oModel = this.getView().getModel("employeeKJE");
			 var oTable = this.byId("emptable");
			 var aSelectedPaths = oTable._aSelectedPaths;
			 var aSelectedEmployee = new Array();
			 var that = this;
			 if (aSelectedPaths.length === 0) {
				 MessageBox.error("데이터를 선택하세요");
			 }else {
				 MessageBox.confirm("삭제하시겠습니까?", {
				 actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				 onClose: function(sAction){
				 if(sAction ===  "YES") {
					 for (var i=0; i<aSelectedPaths.length; i++) {
						 var aIndex = parseInt(aSelectedPaths[i].replace("/T_TAB1/",""));
						 aSelectedEmployee.push(that.getView().getModel("employeeKJE").getData().T_TAB1[aIndex]);         
					 }
					 aSelectedPaths.length = 0;
					 
					 that.getOwnerComponent().rfcCall("ZB_DELETE_EMP", {
					 T_TAB2: aSelectedEmployee
					  }).done(function(oResultData){   // RFC호출 완료
						  
						 oModel.setData(oResultData);
					  }).fail(function(sErrorMessage){
						 alert(sErrorMessage);
					  });
					  
					 that.rebindTable(that.oReadOnlyTemplate, "Navigation");
					 MessageToast.show("사원 정보가 삭제되었습니다.");
				 }else {
					 MessageToast.show("작업이 취소되었습니다.");
				 }
				 }
			 });
			 }
		 },
			 
		 
		 
		 onSave: function() {
			 this.byId("emptable").setMode("MultiSelect"); 
			 this.byId("createButton").setVisible(true);
			 this.byId("saveButton").setVisible(false);
			 this.byId("cancelButton").setVisible(false);
			 this.byId("editButton").setVisible(true);
			 this.byId("deleteButton").setVisible(true);
			 
			 var oModel = this.getView().getModel("employeeKJE");
			 var tab = oModel.getData().T_TAB2;
 
			 
			 
			 this.getOwnerComponent().rfcCall("ZB_EDIT_EMP", {
			 T_TAB2: tab
			  }).done(function(oResultData){   // RFC호출 완료   
			  }).fail(function(sErrorMessage){
				 alert(sErrorMessage);
			  });
			  
			  
			  this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			  MessageToast.show("변경된 정보가 저장되었습니다.");
		 },
 
		 onCancel: function() {
			 this.byId("emptable").setMode("MultiSelect"); 
			 this.byId("createButton").setVisible(true);
			 this.byId("cancelButton").setVisible(false);
			 this.byId("saveButton").setVisible(false);
			 this.byId("editButton").setVisible(true);
			 this.byId("deleteButton").setVisible(true);
			   
			   this.getView().getModel("employeeKJE").setData(this.aTab);
			 this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		 },
		 
		 
		 onCloseDialog : function () {
				 
			 if(this.byId("CreateEmployee")) {
				 this.byId("CreateEmployee").destroy();
			 }else if(this.byId("DeleteEmployee")) {
				 this.byId("DeleteEmployee").destroy();
			 }
				 
		 }
	});
	return TableController;
	
 });