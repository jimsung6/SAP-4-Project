sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"../../model/formatter",
	"sap/ui/core/Fragment",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
	
], function(Controller, MessageToast, formatter, Fragment, UIComponent, MessageBox, History, JSONModel, Filter, FilterOperator) {
	"use strict";
	
	return Controller.extend("ExpenseManagement.controller.businessTrip.WorktimeKJE", {
		
		onInit : function() {
			
				var oData = {
							tableInfo : [{
					            PCODE : "",
					            WORKYM : "",
					            WTIME01 : "",
					            WTIME02 : "",
					            WTIME03 : "",
					            WTIME04 : "",
					            WTIME05 : "",
					            WTIME06 : "",
					            WTIME07 : "",
					            WTIME08 : "",
					            WTIME09 : "",
					            WTIME10 : "",
					            WTIME11 : "",
					            WTIME12 : "",
					            WTIME13 : "",
					            WTIME14 : "",
					            WTIME15 : "",
					            WTIME16 : "",
					            WTIME17 : "",
					            WTIME18 : "",
					            WTIME19 : "",
					            WTIME20 : "",
					            WTIME21 : "",
					            WTIME22 : "",
					            WTIME23 : "",
					            WTIME24 : "",
					            WTIME25 : "",
					            WTIME26 : "",
					            WTIME27 : "",
					            WTIME28 : "",
					            WTIME29 : "",
					            WTIME30 : "",
					            WTIME31 : ""
					         }],
					         rfcData : []
						};
			
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel);
			
			var tableModel = this.getView().getModel();
			var tableInfoLenght = tableModel.getProperty("/tableInfo").length;
			tableModel.setProperty("/tableRow", tableInfoLenght);
			
			var todayDate = new Date();
			var yyyy = todayDate.getFullYear();
			var mm = todayDate.getMonth()+1 >= 10 ? todayDate.getMonth()+1 : "0"+(todayDate.getMonth()+1) ;
			
			this.getView().getModel().setProperty("/WORKYM", yyyy+"-"+mm);
			
			var dateData = parseInt(yyyy.toString() + mm.toString());
			
			var inputWorkTime = oModel.getProperty("/WORKYM");
			
			this.rfcCall(dateData);
			
		},

		rfcCall : function(dateData){
			var oModel = this.getView().getModel();
			var aCookie = document.cookie;
        	var NoIndex = aCookie.indexOf("EMPNO=");
        	var iEmpno = aCookie.substr(NoIndex,17).replace("EMPNO=","");
			
			this.getOwnerComponent().rfcCall("ZB_GET_WORKTIME", {  //RFC Import 데이터
				i_WORKYM : dateData,
				i_EMPNO : iEmpno
			}).done(function(oResultData){	// RFC호출 완료
				console.log(oResultData.T_WTIME);
				
				switch(oResultData.E_RETURN.TYPE){
					case 'E':
						var emptyArr = [];
						oModel.setProperty("/tableInfo", emptyArr);
						oModel.getData().tableRow = 0;
						oModel.refresh();
					default:
						for(var i=0 ; i < oResultData.T_WTIME.length ; i++ ){
							var aResultData =  oResultData.T_WTIME;
							if(aResultData[i].APPLY === "B"){
								aResultData[i].input = false;
								aResultData[i].text = true;
								
							}else{
								aResultData[i].input = true;
								aResultData[i].text = false;
							}
							for(var prop in aResultData[i]){
								if( prop !== "APPLY" && prop !== "EMPNO" && prop !== "MANDT" && prop !== "PCODE" && prop !== "WORKYM" && prop !== "input" && prop !== "text"){
									aResultData[i][prop] = parseInt(aResultData[i][prop]);
									if(aResultData[i][prop] === 0){
										aResultData[i][prop] = "";
									}
								}
							}
						}
						
						for(var j=0; j < aResultData.length; j++) {
		               for (var k=0; k < oResultData.T_APPLYVALUE.length; k++) {
		                  if (aResultData[j].APPLY ===  oResultData.T_APPLYVALUE[k].DOMVALUE_L) {
		                     aResultData[j].APPLY = aResultData[j].APPLY + " " + oResultData.T_APPLYVALUE[k].DDTEXT;
		                  }
		               }
		            }
						console.log(aResultData);
						oModel.setProperty("/tableInfo", aResultData);
						oModel.refresh();
				} 	
			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			}).then(function(){
				console.log(oModel.getProperty("/tableInfo").length);
				oModel.setProperty("/tableRow", oModel.getProperty("/tableInfo").length);
			});
		},
		
		
		onBeforeRendering : function(){
			this.projDataCall();
		},
		
		projDataCall : function(){
			var rfcDataModel = this.getView().getModel();
			var oModel = this.getView().getModel();
			
			this.getOwnerComponent().rfcCall("ZB_GET_PROJECT", {  //RFC Import 데이터
			
			}).done(function(oResultData){	// RFC호출 완료
				rfcDataModel.setProperty("/rfcData", oResultData.T_TAB2);
			}).fail(function(sErrorMessage){// 호출 실패
				console.log(sErrorMessage);
			}).then(function(){
				rfcDataModel.refresh();
				console.log(rfcDataModel.getProperty("/rfcData"));
			});	
		
		},
		
		onDateChange : function(oEvent) {
			var oModel = this.getView().getModel();
			var inputWorkTime = oModel.getProperty("/WORKYM");
			console.log(inputWorkTime);
			this.rfcCall(inputWorkTime); 
		
		},

		onDelete : function(oEvent) {
			
			var oTable = this.byId("Wtab");
			var iSelectedIndex = oTable.getSelectedIndex();
			var aSelected = oTable.getSelectedIndices();
			var inputWorkTime = [];
			var selectedWorkTime = [];
			var dateData = this.getView().getModel().getProperty("/WORKYM");
			var tableData = this.getView().getModel().getProperty("/tableInfo");
			
			var yyyy = dateData.substring(0, 4);
			var mm = dateData.substring(4, 6);
			
			
			
			var that = this;
			//row 선택 시 index로 들어옴, 선택 안했을 시 -1
			if(iSelectedIndex !== -1) {
				var isAdmin = 0;
				for (var k=0; k < aSelected.length; k++) {
					
					if (tableData[aSelected[k]].APPLY === "B 승인요청완료") {
						isAdmin++;
					}
				}
				if(isAdmin === 0){
			MessageBox.confirm("삭제하시겠습니까?", {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(sAction) {
					if(sAction ===  "YES") {
					//예를 눌렀을 때만 실행되도록 (index 나옴)
					  var oModel = that.getView().getModel();
					  //var aSelectedIndex = oModel.getProperty("/tableInfo");
					  //aSelectedIndex.splice(iSelectedIndex,1);
					  var dataInfo = oModel.getProperty("/tableInfo");
					  
					  	for(var i=0 ; i < aSelected.length ; i++){
							inputWorkTime.push(dataInfo[aSelected[i]]);
						}
			
					  that.byId("Wtab").removeSelectionInterval(0, dataInfo.length);
					  oModel.refresh();
				
				
					that.getOwnerComponent().rfcCall("ZB_DELETE_WORKTIME", {  //RFC Import 데이터
					T_WTIME: inputWorkTime
					}).done(function(oResultData){	// RFC호출 완료
						console.log(oResultData);
						// oModel.setData(oResultData);
					}).fail(function(sErrorMessage){// 호출 실패
						alert(sErrorMessage);
					}).then(function(){
						that.rfcCall(yyyy.toString()+mm.toString());
					});
					  
					} else {
					//아니오를 눌렀을 때만 실행되도록	(index = -1)
					}
				}
			});
			}else{
				MessageBox.error("이미 승인요청된 항목입니다.");
			}	
			}else{
				MessageBox.error("데이터를 선택해주십시오");
			}
			
		},
		
		onSave : function() {
			var oModel = this.getView().getModel();
			var oTable = this.getView().byId("Wtab");
			var iSelectedIndex = oTable.getSelectedIndex();
			var aSelected = oTable.getSelectedIndices();
			var aCookie = document.cookie;
			var NoIndex = aCookie.indexOf("EMPNO=");
			var iEmpno = aCookie.substr(NoIndex,17).replace("EMPNO=","");
			var selectedWorkTime = [];
			var inputWorkTime = oModel.getProperty("/tableInfo");
			var oDate = oModel.getProperty("/WORKYM");
			var that = this;
			
			for (var i=0; i<aSelected.length; i++) {
				var aIndex = aSelected[i];
				selectedWorkTime.push(inputWorkTime[aIndex]);
			}
			
			for(var i=0; i < selectedWorkTime.length; i++){
				var ck = 0;
				for(var j=0 ; j < inputWorkTime.length ; j++){
					if(selectedWorkTime[i].PCODE === inputWorkTime[j].PCODE){
						ck++;
					}
				}
				if(ck > 1){
					MessageBox.error("이미 입력한 프로젝트 코드입니다. 입력값을 확인하세요.");
					return 0;
					
				}
			}
		
			
			if(iSelectedIndex !== -1) {
				for (var k=0; k < selectedWorkTime.length; k++) {
					var isNovalue = 0;
					if (selectedWorkTime[k].PCODE === "") {
						isNovalue++;
					}
				}
				if(isNovalue === 0) {
			MessageBox.confirm("저장하시겠습니까?", {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(sAction) {
					if(sAction ===  "YES") {
					//예를 눌렀을 때만 실행되도록 (index 나옴)
					var oModel = that.getView().getModel();
					var oDate = oModel.getProperty("/WORKYM");
					var inputWorkTime = oModel.getProperty("/tableInfo");
						for(var i=0; i<inputWorkTime.length; i++){
						inputWorkTime[i].WORKYM = oDate;
					}
					
					that.getOwnerComponent().rfcCall("ZB_SAVE_WORKTIME", {  //RFC Import 데이터
					T_WTIME: selectedWorkTime,
					I_EMPNO: iEmpno
					}).done(function(oResultData){	// RFC호출 완료
						console.log(oResultData);
						var oDate = that.getView().getModel().getProperty("/WORKYM");
						that.rfcCall(oDate);
					}).fail(function(sErrorMessage){// 호출 실패
						alert(sErrorMessage);
					}).then(function(){
						that.byId("Wtab").removeSelectionInterval(0, inputWorkTime.length);
					});	
					  
					} else {
					//아니오를 눌렀을 때만 실행되도록	(index = -1)
					}
				}
			});
			}else {
				MessageBox.error("프로젝트 코드를 입력하지 않은 항목이 있습니다. 입력값을 확인하세요.");
			}
			}else{
				MessageBox.error("데이터를 선택해주십시오");
			}
		},
		
		
		 onAdmin : function(oEvent) {
         var oModel = this.getView().getModel();
         var oTable = this.getView().byId("Wtab");
         var iSelectedIndex = oTable.getSelectedIndex();
         var aSelected = oTable.getSelectedIndices();
         var aCookie = document.cookie;
         var NoIndex = aCookie.indexOf("EMPNO=");
         var iEmpno = aCookie.substr(NoIndex,17).replace("EMPNO=","");
         var selectedWorkTime = [];
         var inputWorkTime = oModel.getProperty("/tableInfo");
         var oDate = oModel.getProperty("/WORKYM");
         var that = this;
         
         for (var i=0; i<aSelected.length; i++) {
				var aIndex = aSelected[i];
				selectedWorkTime.push(inputWorkTime[aIndex]);
			}
			
			for(var i=0 ; i < selectedWorkTime.length ; i++){
				var ck = 0;
				selectedWorkTime[i].WORKYM = oDate;
				for(var j=0 ; j < inputWorkTime.length ; j++){
					if(selectedWorkTime[i].PCODE === inputWorkTime[j].PCODE){
						ck++;
					}
				}
				if(ck > 1){
					MessageBox.error("이미 입력한 프로젝트 코드입니다. 입력값을 확인하세요.");
					return 0;
				}
			}
   
         if(iSelectedIndex !== -1) {
         	for (var k=0; k < selectedWorkTime.length; k++) {
					var isNovalue = 0;
					if (selectedWorkTime[k].PCODE === "") {
						isNovalue++;
					}
				}
				if(isNovalue === 0) {
            MessageBox.confirm("승인요청하시겠습니까?", {
               actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
               onClose: function(sAction) {
                  if(sAction ===  "YES") {
            
                     console.log(oDate);
                     
                     
                     that.getOwnerComponent().rfcCall("ZB_CALC_PAYMENT", {  //RFC Import 데이터
                     I_EMPNO: iEmpno,
                     I_WORKYM: oDate,
                     T_WTIME: selectedWorkTime
                     }).done(function(oResultData){   // RFC호출 완료
                        console.log(oResultData.T_WTIME);
                        if (oResultData.E_RETURN1.TYPE === "E") {
                           MessageBox.information(oResultData.E_RETURN1.MESSAGE);
                        }else {
                           MessageBox.success(oResultData.E_RETURN1.MESSAGE);
                           that.rfcCall(oDate);
                        }
                     }).fail(function(sErrorMessage){// 호출 실패
                        alert(sErrorMessage);
                     }).then(function(){
                        that.byId("Wtab").removeSelectionInterval(0, inputWorkTime.length);
                        });   
                     
                  }else{
                     MessageToast.show("작업이 취소되었습니다.");
                  }
               }
            });
				}else {
				MessageBox.error("프로젝트 코드를 입력하지 않은 항목이 있습니다. 입력값을 확인하세요.");
			}
         }else {
            MessageBox.error("데이터를 선택해주십시오");
         }
      },

		
		//combobox data select function
		onComboSelect : function(oEvent){
			var oModel = this.getView().getModel();
			var that = this;
			var tableInfoData = oModel.getProperty("/tableInfo");
			var rfcDataData = oModel.getProperty("/rfcData");
			
			for(var i=0 ; i < tableInfoData.length ; i++){
				 if(tableInfoData[i].PCODE){
				 	for(var j=0 ; j < rfcDataData.length ; j++){
						if(rfcDataData[j].PCODE === tableInfoData[i].PCODE){
							oModel.setProperty("/tableInfo/"+i+"/PNAME", rfcDataData[j].PNAME );
						}
				 	}
				 }
			}

			oModel.refresh();
			
		},
		
		//행 추가 
		onRowAdd : function(){
         var rowTableData = this.getView().getModel().getProperty("/tableRow");
         
         var realtable = this.getView().getModel().getProperty("/tableInfo");
         realtable.push({
            PCODE : "",
            WTIME01 : "",
            WTIME02 : "",
            WTIME03 : "",
            WTIME04 : "",
            WTIME05 : "",
            WTIME06 : "",
            WTIME07 : "",
            WTIME08 : "",
            WTIME09 : "",
            WTIME10 : "",
            WTIME11 : "",
            WTIME12 : "",
            WTIME13 : "",
            WTIME14 : "",
            WTIME15 : "",
            WTIME16 : "",
            WTIME17 : "",
            WTIME18 : "",
            WTIME19 : "",
            WTIME20 : "",
            WTIME21 : "",
            WTIME22 : "",
            WTIME23 : "",
            WTIME24 : "",
            WTIME25 : "",
            WTIME26 : "",
            WTIME27 : "",
            WTIME28 : "",
            WTIME29 : "",
            WTIME30 : "",
            WTIME31 : ""
         });
          this.getView().getModel().refresh();
         
         rowTableData += 1 ;
         this.getView().getModel().setProperty("/tableRow", rowTableData);
         

      }
	});
});