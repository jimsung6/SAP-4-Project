sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/m/Dialog",
	"sap/m/DialogType",
	"sap/ui/core/Fragment",
	"sap/m/Button",
	"sap/m/ButtonType",
	"sap/m/Text",
	"sap/m/TextArea",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function (Controller, JSONModel, MessageToast, MessageBox, Dialog, DialogType, Fragment, Button, ButtonType, Text, TextArea, Filter, FilterOperator) {
	"use strict";

	return Controller.extend("ExpenseManagement.controller.expenseManagement.kmg.ProjectList_MQ", {
		
		// 테이블 안에 들어가는 정보
		onInit : function(){
				var oData = {
					info : [], //headerdata
					tableData : [], // detaildata
					tableV : false,
					OTable : false,
					table1 : false,
					table2 : false,
					tableRow : 5
				};
	// 상태별 필터			
		var oModel = new JSONModel(oData);	
		this.getView().setModel(oModel);


		 this._oGlobalFilter = null;
		 this._oPriceFilter = null;

},
		//첫 승인화면
	onFiltering : function(dateData, comboData, stcodComboData){
		
		var oModel = this.getView().getModel(); 
		var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");


		oModel.setProperty("/dateData", new Date(dateData));
		oModel.setProperty("/comboData", comboData);
		oModel.setProperty("/stcodComboData", stcodComboData);
		oModel.setProperty("/tableData", []);
		
		this.byId("AppId").clearSelection();

		//날짜
		var realDateData = new Date(dateData);
		var yyyy = realDateData.getFullYear();
		var mm = realDateData.getMonth()+1 >= 10 ? realDateData.getMonth()+1 : "0"+(realDateData.getMonth()+1);
        var sFromDateInfo = yyyy.toString()+mm.toString();
		var realComboData = comboData;
		
		
		if(realComboData === "ALL"){
			realComboData = "";
		}
		
		console.log(sFromDateInfo);
		console.log(stcodComboData);
		console.log(realComboData);

 		this.getOwnerComponent().rfcCall("ZB_HEADER_SEARCH", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
	 		I_CUMON: sFromDateInfo,
	  		I_STCOD: stcodComboData,
	 		I_AUEMP: EMPNOData, //로그인해서 사원정보를 빼와야한다
	 		I_PCODE: realComboData
	        //RFC Import 데이터
	     }).done(function(oResultData){   // RFC호출 완료
	    	 console.log(oResultData.T_TAB1)
	    	
	        oModel.setProperty("/info", oResultData.T_TAB1);
	     }).fail(function(sErrorMessage){// 호출 실패
	        alert(sErrorMessage);
	     }).then(function(){
	     	 console.log(oModel.getProperty("/info"));
	     	    
	     });
    
			       
		this._oGlobalFilter = null;


	},
	

	//셀 클릭시 상세 테이블 뷰 버튼
	onCellClick : function(oEvent){
		var rowData = oEvent.mParameters.rowIndex;
		var oModel = this.getView().getModel();
		var PCODE = oModel.getProperty("/info/"+ rowData +"/PCODE");
		var EMPNO = oModel.getProperty("/info/"+ rowData +"/EMPNO");
		var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
		
		var stcodComboData = oModel.getProperty("/stcodComboData");
			
		var dateData = oModel.getProperty("/dateData");
		console.log(dateData);
		
		var yyyy = dateData.getFullYear();
		var mm = dateData.getMonth()+1 >= 10 ? dateData.getMonth()+1 : "0"+(dateData.getMonth()+1);
        var sFromDateInfo = yyyy.toString()+mm.toString();
        
        this.getView().getModel().setProperty("/tableV", true);
         
         
        this.getOwnerComponent().rfcCall("ZB_HEADER_DETAIL", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
            I_CUMON : sFromDateInfo,   //해당 월
            I_EMPNO : EMPNO,  //사원 번호
            I_STCOD : stcodComboData,
            I_PCODE : PCODE	,
            I_AUEMP : EMPNOData //로그인해서 사원정보를 빼와야한다
	        //RFC Import 데이터
	     }).done(function(oResultData){   // RFC호출 완료
	    	 
	    	 console.log(oResultData);
	    	 
	    	 oModel.setProperty("/tableData", oResultData.TAB1);
	    	
	     }).fail(function(sErrorMessage){// 호출 실패
	        alert(sErrorMessage);
	     }).then(function(){
	     	    
	     });
	
		
	},
	
	rowSelection : function(event){
		//MessageToast.show(event);
		var oModel = this.getView().getModel();
		var tableData = oModel.getProperty("/tableData");
		if(event.mParameters.rowContext){
			var path = event.mParameters.rowContext.sPath;
		}
		
		if(event.mParameters.selectAll){
			for(var i=0 ; i < tableData.length ; i++){
				tableData[i].checked = true;
			}
		}else{
			if(event.mParameters.rowIndex === -1){
				for(var i=0 ; i < tableData.length ; i++){
					tableData[i].checked = false;
				}
			}else{
				if(oModel.getProperty(path+"/checked")){
					oModel.setProperty(path+"/checked", false);
				}else{
					oModel.setProperty(path+"/checked", true);
				}
			}
		}
		
		//console.log(tableData);
		
	},
	
	// 승인
		onSave : function(){
			var that = this;
			 var payModel = this.getView().getModel();
			 var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
			 var selectTable = payModel.getProperty("/tableData");
			 
             var tableData = [];

             
             for( var i=0 ; i < selectTable.length ; i++){
             	if(selectTable[i].checked){
	             	tableData.push({
	             		JPNUM : selectTable[i].JPNUM,
	             		EMPNO : selectTable[i].EMPNO,
	             		PCODE : selectTable[i].PCODE,
	             		CUMON : selectTable[i].CUMON
	             	})
             	}
             }
             console.log(tableData);
            ////   RFC호출
                this.getOwnerComponent().rfcCall("ZB_HEADER_CONFIRM", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_CONFIRM를 사용
                    //RFC Import 데이터
                    T_TAB1 : tableData,
                    I_AUEMP : EMPNOData, //로그인해서 사원정보를 빼와야한다
                    I_MODE : "A"
                  
                 }).done(function(oResultData){   // RFC호출 완료
   
                 }).fail(function(sErrorMessage){// 호출 실패
                   MessageToast.show(sErrorMessage);
                 }).then(function(){
                 	
                 	var dateData = payModel.getProperty("/dateData", dateData);
					var comboData = payModel.getProperty("/comboData", comboData);
					
					var stcodComboData = payModel.getProperty("/stcodComboData", stcodComboData);
                 	that.onFiltering(dateData, comboData, stcodComboData);
                 });
	},
	
	// 반려
	onReject : function(){
			var that = this;
	         var payModel = this.getView().getModel();
			 var selectTable = payModel.getProperty("/tableData");
			 var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
             var tableData = [];

             
             for( var i=0 ; i < selectTable.length ; i++){
             	if(selectTable[i].checked){
	             	tableData.push({
	             		JPNUM : selectTable[i].JPNUM,
	             		EMPNO : selectTable[i].EMPNO,
	             		PCODE : selectTable[i].PCODE,
	             		CUMON : selectTable[i].CUMON
	             	})
             	}
             }
             console.log(tableData);
            ////   RFC호출
                this.getOwnerComponent().rfcCall("ZB_HEADER_CONFIRM", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_CONFIRM를 사용
                    //RFC Import 데이터
                    T_TAB1 : tableData,
                    I_AUEMP : EMPNOData, //로그인해서 사원정보를 빼와야한다
                    I_MODE : "B"
                  
                 }).done(function(oResultData){   // RFC호출 완료
   
                 }).fail(function(sErrorMessage){// 호출 실패
                   MessageToast.show(sErrorMessage);
                 }).then(function(){
                 	
                 	var dateData = payModel.getProperty("/dateData", dateData);
					var comboData = payModel.getProperty("/comboData", comboData);
					
					var stcodComboData = payModel.getProperty("/stcodComboData", stcodComboData);
                 	that.onFiltering(dateData, comboData, stcodComboData);
                 });
	},
	

	selDetail: function(oEvent) {
	
		//row 데이터 뽑기
		var sPath = oEvent.getSource().getBindingContext().getPath();
		
		//전표 번호 데이터
		var JPNUMData = this.getView().getModel().getProperty(sPath).JPNUM;
	
		//전표 번호 데이터 모델에 넣어주기
		this.getView().getModel().setProperty("/JPNUMData",JPNUMData);

		
		// 유류대 테이블 RFC 호출 테스트 끝

		// 1 선택한 로우의 정보를 가져온다.

		var selFlag = oEvent.getSource().data("flag");

		if(selFlag=='0001') {
			// console.log(this.getView().byId("det01").getVisible());
			this.getView().byId("mainTableId").setVisible(true);
			this.getView().byId("ryuTableId").setVisible(false);
			this.getView().byId("kyoTableId").setVisible(false);
			this.sikTableCall();
			}
		 else if(selFlag=='0002') {
			this.getView().byId("mainTableId").setVisible(false);
			this.getView().byId("ryuTableId").setVisible(true);
			this.getView().byId("kyoTableId").setVisible(false);
			//유류대 RFC 호출
			this.ryuTableCall();
		} else if(selFlag=='0003') {
			this.getView().byId("mainTableId").setVisible(false);
			this.getView().byId("ryuTableId").setVisible(false);
			this.getView().byId("kyoTableId").setVisible(true);
			this.kyoTableCall();
		}else{
			this.getView().byId("mainTableId").setVisible(false);
			this.getView().byId("ryuTableId").setVisible(false);
			this.getView().byId("kyoTableId").setVisible(false);
		}
	},
	
		sikTableCall : function(){
			//식대 테이블 RFC
		var oModel = this.getView().getModel();
		// var JPNUM = oModel.getProperty("/JPNUMData");



		this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
			//RFC Import 데이터
			I_MODE : "B" ,  //모드
			// I_JPNUM : JPNUM
			I_JPNUM : ""
			}).done(function(oResultData){   // RFC호출 완료

				for(var i=0 ; i < oResultData.TAB2.length ; i++){
					oResultData.TAB2[i].HANGN = parseInt(oResultData.TAB2[i].HANGN);
					oResultData.TAB2[i].SIKSU = parseInt(oResultData.TAB2[i].SIKSU);
				}
				oModel.setProperty("/info", oResultData.TAB2);
				oModel.setProperty("/tableRow2", oResultData.TAB2.length);
				console.log(oResultData.TAB2);
				//oResultData.TAB1[0].NOTE
			}).fail(function(sErrorMessage){// 호출 실패
				MessageToast.show(sErrorMessage);
			}).then(function(){
			// 여기다가 rfc 호출후 작업코딩
			});
	},
	
		ryuTableCall : function(){
			//유류대 테이블 RFC
	
			var oModel = this.getView().getModel();
	
			this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
				//RFC Import 데이터
				I_MODE : "C" ,  //모드
				I_JPNUM : 2100
				
				}).done(function(oResultData){   // RFC호출 완료
					oModel.setProperty("/OilTable", oResultData.TAB3);
					oModel.setProperty("/OTableRowData", oResultData.TAB3.length);
					console.log(oResultData.TAB3);
					//oResultData.TAB1[0].NOTE
				}).fail(function(sErrorMessage){// 호출 실패
					MessageToast.show(sErrorMessage);
				}).then(function(){
				// 여기다가 rfc 호출후 작업코딩
				});
		},
		
		
		kyoTableCall : function(){
      //교육훈련비 테이블 RFC호출 테스트 시작

	  var oModel = this.getView().getModel();
	  
      this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
         //RFC Import 데이터
         
         
         I_MODE : "D" ,  //모드
         I_JPNUM : 515
         
         }).done(function(oResultData){   // RFC호출 완료

			for(var i=0 ; i < oResultData.TAB4.length ; i++){
				oResultData.TAB4[i].FDATE = new Date(oResultData.TAB4[i].FDATE);
				oResultData.TAB4[i].TDATE = new Date(oResultData.TAB4[i].TDATE);
            }

			oModel.setProperty("/kyoinfo", oResultData.TAB4);
            oModel.setProperty("/kyoinfoRowData", oResultData.TAB4.length);
           
          
            console.log(oResultData.TAB4);
            //oResultData.TAB1[0].NOTE
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(oResultData){

         });
   }
});
});