
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
	   
	//***************************************초기 설정************************************************** */
      onInit : function() {
		 
		//초기 세팅
         var oModel = new JSONModel();         //비어있는 json모델 생성
         this.getView().setModel(oModel, "accounts");		//accounts라는 이름으로 view에 모델 생성
         
         this.getOwnerComponent().rfcCall("ZB_GET_COMPANY_ACCOUNT", {   	//계좌 호출하는 rfc

         }).done(function(oResultData){
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
		
		this.rebindTable(this.oReadOnlyTemplate, "Navigation");		//초기에는 keyboardMode를 Navigation으로 설정
		
		this.oEditableTemplate = new ColumnListItem({			//정보 수정 시에 table속성을 변경하기 위한 로직
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
		

        //***************************** 테이블 다시 바인딩하기**************************************
	  	rebindTable: function(oTemplate, sKeyboardMode) {
	  		
  			
			this.oTable.bindItems({
				path: "accounts>/T_TAB1",
				template: oTemplate,
				templateShareable: true
				// key: "accounts>CACNR",
			}).setKeyboardMode(sKeyboardMode);
			},
      
        //*****************************계좌생성 다이얼로그창 생성**************************************
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
       		var oMM = Core.getMessageManager();					//liveChange Event용 메세지매니저 변수 선언
       		oMM.registerObject(this.byId("ncacnr"), true);		//계좌생성 다이얼로그에 메세지 매니저 오브젝트 등록
			
		 },

		//***************************************계좌 생성 시 필드 값 유효성 검사****************************************************
		_validateInput: function (oInput) {
			var sValueState = "None";			//초기에는 계좌코드 입력필드 테두리 색 변화 없음
			var bValidationError = false;		//초기 error = false
			var oRex = /[A-Z]/;					//계좌코드 값을 A~Z로 제한하기 위한 정규식
			var oTab = this.getView().getModel("accounts").getData().T_TAB1;
			var bDupl = false;					//boolean값 선언 -> 계좌코드가 중복되었는지 안되었는지 확인
			
			for (var i=0; i<oTab.length; i++) {						//table에서 루프를 돌며
				if (oInput.getValue() === oTab[i].CACNR) {			//계좌코드 입력값이 기존에 있던 값이랑 같으면
					bDupl = true;									//bDupl을 true로 만든다
					break;
				}
			}
			
			//계좌코드 생성 시 input값들에 오류가 있는지 확인
			try {
				if (!oInput.getValue()) {						//입력값이 없으면
					throw new ValidateException();					//오류던짐
				}else if (!oRex.test(oInput.getValue())) {		//위의 정규식(A~Z)에 안맞으면
					throw new ValidateException();					//오류던짐
				}else if (oInput.getValue().length > 1) {		//2글자 이상 쓰면
					throw new ValidateException();					//오류던짐
				}else if (bDupl) {								//계좌코드 중복되면
					throw new ValidateException();					//오류던짐
				}
			} catch (oException) {			//만약 오류가 있으면
				sValueState = "Error";			//valueState를 Error로 변경
				bValidationError = true;		//validation 오류 던짐
			}
			
			oInput.setValueState(sValueState);		//valueState를 error로 변경 -> 테두리 빨갛게 변함
			
			//각 오류 별 메세지 형성
			if (!oInput.getValue()) {
				oInput.setValueStateText("1자리의 로마자 알파벳을 입력하세요. 계좌코드는 중복될 수 없습니다.");
			}else if (!oRex.test(oInput.getValue())) {
				oInput.setValueStateText("로마자만 입력 가능합니다!");
			}else if (oInput.getValue().length > 1) {
				oInput.setValueStateText("계좌코드는 1자리를 초과할수 없습니다!");
			}else if (bDupl) {
				oInput.setValueStateText("계좌코드가 중복됩니다! 다른 알파벳을 입력하세요");
			}
			
			//onCreateAccount의 로직을 위해 통합 validation 오류값 return
			return bValidationError;
		},
		
		//*****************************계좌코드 입력 값 liveChange Event********************************
		onCacnrChange : function(oEvent) {
			var oInput = oEvent.getSource();
			oInput.setValue(oInput.getValue().toUpperCase());			//알파벳을 입력하면 무조건 대문자로 변환시키도록 함
			this._validateInput(oInput);						//입력값을 위의 _validateInput함수에다가 던짐
		},
		
		//******************************계좌 생성*********************************************************
		onCreateAccount : function(oEvent) {
			
			var aInput = this.byId("ncacnr"),
				bValidationError = this._validateInput(aInput); //input값을 _validateInput에다가 던짐


			if (bValidationError) {								//종합적으로 오류가 있으면
				MessageBox.alert("입력값을 다시 확인하세요.");	//메세지 형성
			}else {												//오류가 없으면
				var oModel = this.getView().getModel("accounts");
				var NewAccount = {								//새로운 Account 배열 생성
					MANDT : "230",
					CACNR : "",
					BANKL : "",
					CACCT : "",
					CDATE : "",
					MDATE : ""
				};
				
				//새 배열에다가 입력한 값들을 대입
				NewAccount.CACNR = this.byId("ncacnr").getProperty("value");		
				NewAccount.BANKL = this.byId("nbankl").getProperty("value");
				NewAccount.CACCT = this.byId("ncacct").getProperty("value");
				
				//계좌 생성 RFC
				this.getOwnerComponent().rfcCall("ZB_CREATE_COMPANY_ACCOUNT", {
				I_ACCOUNT: NewAccount
		         }).done(function(oResultData){ 
		            for (var j=0; j<oResultData.T_TAB1.length; j++) {				//날짜 형식에 맞추기 위해 변경이 없는것들 다 0으로변경
		              if (oResultData.T_TAB1[j].MDATE === "0000-00-00") {
		                  oResultData.T_TAB1[j].MDATE = "0";
		              }
		                  
	            	}
	            	oModel.setData(oResultData);						//호출된 결과물을 Set
		         }).fail(function(sErrorMessage){
		            alert(sErrorMessage);
		         });
				
				
				
				//다이얼로그창 닫기
				this.byId("CreateAccount").close();
				this.byId("CreateAccount").destroy();
				MessageToast.show("계좌가 생성되었습니다.");   //메세지 생성
				
				
				this.rebindTable(this.oReadOnlyTemplate, "Navigation");		//테이블 리바인딩, 키보드모드 Navigation
			}
			
			
		},
		
		//**************************************변경클릭 시 상태 변경******************************************* */
	    onEditAccount : function() {
	    	this.aTab = deepExtend([], this.getView().getModel("accounts").getData());     //controller를 다시 extend
	    	this.byId("CompanyAccounts").setMode("None");                				//체크박스를 없앰
			this.byId("createButton").setVisible(false);
			this.byId("editButton").setVisible(false);
			this.byId("deleteButton").setVisible(false);
			this.byId("saveButton").setVisible(true);
			this.byId("cancelButton").setVisible(true);
			this.rebindTable(this.oEditableTemplate, "Edit");	//테이블 리바인딩, 키보드모드 Edit으로 설정->tab누르면 필드 넘길 수 있음
	    },
		
		//*****************************************계좌 삭제**************************************************** */
	    onDeleteAccount : function() {

			var oModel = this.getView().getModel("accounts");
			var aTab = oModel.getData().T_TAB1;
			var oTable = this.byId("CompanyAccounts");
			var aSelectedPaths = oTable._aSelectedPaths;			//체크박스를 누른 것들의 path index들만 넘긺
			var aSelectedAccounts = new Array();					//선택한 계좌만 넣기 위해 새 배열 생성
			var that = this;
			if (aSelectedPaths.length === 0) {						//체크박스를 하나도 클릭하지 않으면
				MessageBox.error("계좌를 선택하세요");				 //오류메세지 형성
			}else {
				MessageBox.confirm("삭제하시겠습니까?", {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(sAction){
				if(sAction ===  "YES") {							//삭제하시겠습니까 에서 "예"를 누르면
					for (var i=0; i<aSelectedPaths.length; i++) {
						var aIndex = parseInt(aSelectedPaths[i].replace("/T_TAB1/",""));		//T_TAB1글자를 지워서 인덱스만 남긺
						aSelectedAccounts.push(that.getView().getModel("accounts").getData().T_TAB1[aIndex]);    //새 배열에 클릭한 정보만 push
					}
					aSelectedPaths.length = 0;						//체크박스 클릭한것들을 없애줌
					
					//rfc로 넘길 시 날짜 형식 오류를 피하기 위해 '-'를 없앰
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
			
	    
	    //***************************************계좌 변경정보 저장하기******************************************** */
		onSave: function() {

			//보이고 안보이게 할 버튼들 설정하기
			this.byId("CompanyAccounts").setMode("MultiSelect"); 
			this.byId("createButton").setVisible(true);
			this.byId("saveButton").setVisible(false);
			this.byId("cancelButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			this.byId("deleteButton").setVisible(true);
			
			var oModel = this.getView().getModel("accounts");
			var tab = oModel.getData().T_TAB1;
			
			//날짜 형식 설정
			for(var i = 0; i < tab.length ; i++ ){
	            var splitData = tab[i].CDATE.split('-');
	            tab[i].CDATE = splitData[0] + splitData[1] + splitData[2];
	
	            if(tab[i].MDATE === "0") {
	            	tab[i].MDATE = "";
	            }
        	}

			
			//계좌 변경정보 저장 RFC
			this.getOwnerComponent().rfcCall("ZB_SAVE_COMPANY_ACCOUNT", {
			T_TAB1: tab
	         }).done(function(oResultData){   // RFC호출 완료
	            for (var j=0; j<oResultData.T_TAB1.length; j++) {
	               if (oResultData.T_TAB1[j].MDATE === "0000-00-00") {
	                  oResultData.T_TAB1[j].MDATE = "0";
	               }
					  oModel.setData(oResultData);
					  MessageToast.show("계좌가 성공적으로 변경되었습니다.");
	            }   
	            
	         }).fail(function(sErrorMessage){
	            alert(sErrorMessage);
	         });
	         
	         
	         this.rebindTable(this.oReadOnlyTemplate, "Navigation");
		},

		//******************************************계좌 변경 취소******************************************* */
		onCancel: function() {
			this.byId("CompanyAccounts").setMode("MultiSelect"); 
			this.byId("createButton").setVisible(true);
			this.byId("cancelButton").setVisible(false);
			this.byId("saveButton").setVisible(false);
			this.byId("editButton").setVisible(true);
			this.byId("deleteButton").setVisible(true);
	  		
		  	this.getView().getModel("accounts").setData(this.aTab);
			this.rebindTable(this.oReadOnlyTemplate, "Navigation");
			MessageToast.show("작업이 취소되었습니다.");
		},
	    
	    //******************************************다이얼로그 닫기******************************************** */
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