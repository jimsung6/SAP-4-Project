
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

   var TableController= Controller.extend("ExpenseManagement.controller.master.CompanyAccounts", {
   	
   	
      onInit : function() {
         
         var oModel = new JSONModel();
         this.getView().setModel(oModel, "accounts");
         
         this.getOwnerComponent().rfcCall("ZB_GET_COMPANY_ACCOUNT", {   

         }).done(function(oResultData){   // RFC호출 완료
            for (var i=0; i<oResultData.T_TAB1.length; i++) {
               if (oResultData.T_TAB1[i].MDATE === "0000-00-00") {
                  oResultData.T_TAB1[i].MDATE = "0";
               }
                  oModel.setData(oResultData);
            }   
         }).fail(function(sErrorMessage){
            alert(sErrorMessage);
         });
         
         
        this.oTable = this.byId("CompanyAccounts");
        
		this.oReadOnlyTemplate = this.byId("CompanyAccounts").removeItem(0);
		
		this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		
		this.oEditableTemplate = new ColumnListItem({
			cells: [
				new Text({
					text: "{accounts>CACNR}"
				}),	new Input({
					value: "{accounts>BANKL}"
				}), new Input({
					value: "{accounts>CACCT}",
					type: "Number"
				}), new Text({
					text: "{accounts>CDATE}"
				}), new Text({
					text: "{accounts>MDATE}"
				})
				]
         
			});
		
         
    	},
        
	  	rebindTable: function(oTemplate, sKeyboardMode) {
	  		
  			
			this.oTable.bindItems({
				path: "accounts>/T_TAB1",
				template: oTemplate,
				templateShareable: true
				// key: "accounts>CACNR",
			}).setKeyboardMode(sKeyboardMode);
			},
      
      
        onCreateDialog : function() {
       		if (!this.byId("CreateAccount")) {
				 var oView = this.getView();
				 Fragment.load({
						id: oView.getId(),
						name: "ExpenseManagement.view.master.CreateAccountDialog",
						controller : this
				}).then(function (oDialog) {
						oView.addDependent(oDialog);
						oDialog.open();
				});
       		}
       		var oMM = Core.getMessageManager();
       		oMM.registerObject(this.byId("ncacnr"), true);
			
		 },


		_validateInput: function (oInput) {
			var sValueState = "None";
			var bValidationError = false;
			var oRex = /[A-Z]/;
			var oTab = this.getView().getModel("accounts").getData().T_TAB1;
			var bDupl = false;
			
			for (var i=0; i<oTab.length; i++) {
				if (oInput.getValue() === oTab[i].CACNR) {
					bDupl = true;
					break;
				}
			}
			
			try {
				if (!oInput.getValue()) {
					throw new ValidateException();
				}else if (!oRex.test(oInput.getValue())) {
					throw new ValidateException();
				}else if (oInput.getValue().length > 1) {
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
				oInput.setValueStateText("1자리의 로마자 알파벳을 입력하세요. 계좌코드는 중복될 수 없습니다.");
			}else if (!oRex.test(oInput.getValue())) {
				oInput.setValueStateText("로마자만 입력 가능합니다!");
			}else if (oInput.getValue().length > 1) {
				oInput.setValueStateText("계좌코드는 1자리를 초과할수 없습니다!");
			}else if (bDupl) {
				oInput.setValueStateText("계좌코드가 중복됩니다! 다른 알파벳을 입력하세요");
			}
			
			
			return bValidationError;
		},
		
		
		onCacnrChange : function(oEvent) {
			var oInput = oEvent.getSource();
			oInput.setValue(oInput.getValue().toUpperCase());
			this._validateInput(oInput);
		},
		
		onCreateAccount : function(oEvent) {
			
			var aInput = this.byId("ncacnr"),
				bValidationError = this._validateInput(aInput);

			
			if (bValidationError) {
				MessageBox.alert("입력값을 다시 확인하세요.");
			}else {
				var oModel = this.getView().getModel("accounts");
				var NewAccount = {
					MANDT : "230",
					CACNR : "",
					BANKL : "",
					CACCT : "",
					CDATE : "",
					MDATE : ""
				};
				
				NewAccount.CACNR = this.byId("ncacnr").getProperty("value");
				NewAccount.BANKL = this.byId("nbankl").getProperty("value");
				NewAccount.CACCT = this.byId("ncacct").getProperty("value");
				
			
				this.getOwnerComponent().rfcCall("ZB_CREATE_COMPANY_ACCOUNT", {
				I_ACCOUNT: NewAccount
		         }).done(function(oResultData){   // RFC호출 완료
		            for (var j=0; j<oResultData.T_TAB1.length; j++) {
		              if (oResultData.T_TAB1[j].MDATE === "0000-00-00") {
		                  oResultData.T_TAB1[j].MDATE = "0";
		              }
		                  
	            	}
	            	oModel.setData(oResultData);
		         }).fail(function(sErrorMessage){
		            alert(sErrorMessage);
		         });
				
				
				
				//다이얼로그창 닫기
				this.byId("CreateAccount").close();
				this.byId("CreateAccount").destroy();
				MessageToast.show("계좌가 생성되었습니다.");   //메세지 생성
				
				
				this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			}
			
			
			},
	    
	    onEditAccount : function() {
	    	this.aTab = deepExtend([], this.getView().getModel("accounts").getData());
	    	this.byId("CompanyAccounts").setMode("None");                
			this.byId("createButton").setVisible(false);
			this.byId("editButton").setVisible(false);
			this.byId("deleteButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("cancelButton").setVisible(true);
			this.rebindTable(this.oEditableTemplate, "Edit");
	    },
	    
	    onDeleteAccount : function() {

			var oModel = this.getView().getModel("accounts");
			var aTab = oModel.getData().T_TAB1;
			var oTable = this.byId("CompanyAccounts");
			var aSelectedPaths = oTable._aSelectedPaths;
			var aSelectedAccounts = new Array();
			var that = this;
			if (aSelectedPaths.length === 0) {
				MessageBox.error("계좌를 선택하세요");
			}else {
				MessageBox.confirm("삭제하시겠습니까?", {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(sAction){
				if(sAction ===  "YES") {
					for (var i=0; i<aSelectedPaths.length; i++) {
						var aIndex = parseInt(aSelectedPaths[i].replace("/T_TAB1/",""));
						aSelectedAccounts.push(that.getView().getModel("accounts").getData().T_TAB1[aIndex]);         
					}
					aSelectedPaths.length = 0;
					
					for(var k = 0; k < aTab.length ; k++ ){
			            var splitData = aTab[k].CDATE.split('-');
			            aTab[k].CDATE = splitData[0] + splitData[1] + splitData[2];
			
			            if(aTab[k].MDATE === "0") {
			            	aTab[k].MDATE = "";
			            }
		        	}
					
					
					that.getOwnerComponent().rfcCall("ZB_DELETE_COMPANY_ACCOUNT", {
					T_TAB1: aSelectedAccounts
	        		 }).done(function(oResultData){   // RFC호출 완료
		 		    	for (var j=0; j<oResultData.T_TAB1.length; j++) {
			              if (oResultData.T_TAB1[j].MDATE === "0000-00-00") {
			                  oResultData.T_TAB1[j].MDATE = "0";
			              }
			                  
		            	 }
	            		oModel.setData(oResultData);
			         }).fail(function(sErrorMessage){
			            alert(sErrorMessage);
			         });
			         
					that.rebindTable(that.oReadOnlyTemplate, "Navigation");
					MessageToast.show("계좌가 삭제되었습니다.");
					
				}else {
					MessageToast.show("작업이 취소되었습니다.");
				}
				}
			});
			}
	    },
			
	    
	    
		onSave: function() {
			this.byId("CompanyAccounts").setMode("MultiSelect"); 
			this.byId("createButton").setVisible(true);
			this.byId("saveButton").setVisible(false);
			this.byId("cancelButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			this.byId("deleteButton").setVisible(true);
			
			var oModel = this.getView().getModel("accounts");
			var tab = oModel.getData().T_TAB1;
			
			for(var i = 0; i < tab.length ; i++ ){
	            var splitData = tab[i].CDATE.split('-');
	            tab[i].CDATE = splitData[0] + splitData[1] + splitData[2];
	
	            if(tab[i].MDATE === "0") {
	            	tab[i].MDATE = "";
	            }
        	}

			
			
			this.getOwnerComponent().rfcCall("ZB_SAVE_COMPANY_ACCOUNT", {
			T_TAB1: tab
	         }).done(function(oResultData){   // RFC호출 완료
	            for (var j=0; j<oResultData.T_TAB1.length; j++) {
	               if (oResultData.T_TAB1[j].MDATE === "0000-00-00") {
	                  oResultData.T_TAB1[j].MDATE = "0";
	               }
	                  oModel.setData(oResultData);
	            }   
	            
	         }).fail(function(sErrorMessage){
	            alert(sErrorMessage);
	         });
	         
	         
	         this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},

		onCancel: function() {
			this.byId("CompanyAccounts").setMode("MultiSelect"); 
			this.byId("createButton").setVisible(true);
			this.byId("cancelButton").setVisible(false);
			this.byId("saveButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			this.byId("deleteButton").setVisible(true);
	  		
		  	this.getView().getModel("accounts").setData(this.aTab);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},
	    
	    
	    onCloseDialog : function () {
				
			if(this.byId("CreateAccount")) {
				this.byId("CreateAccount").destroy();
			}else if(this.byId("DeleteAccount")) {
				this.byId("DeleteAccount").destroy();
			}
				
	    }
   });
   return TableController;
   
});