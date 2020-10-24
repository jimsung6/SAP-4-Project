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
			
			var dateData = this.getView().getModel().getProperty("/WORKYM");
			
			var yyyy = dateData.substring(0, 4);
			var mm = dateData.substring(4, 6);
			
			
			
			var that = this;
			
			//row 선택 시 index로 들어옴, 선택 안했을 시 -1
			if(iSelectedIndex !== -1) {
			MessageBox.confirm("삭제하시겠습니까?", {
				actions: [sap.m.MessageBox.Action.YES, sap.m.MessageBox.Action.NO], 
				onClose: function(sAction) {
					if(sAction ===  "YES") {
					//예를 눌렀을 때만 실행되도록 (index 나옴
					  var oModel = that.getView().getModel();
					  //var aSelectedIndex = oModel.getProperty("/tableInfo");
					  //aSelectedIndex.splice(iSelectedIndex,1);
					  var dataInfo = oModel.getProperty("/tableInfo");
					  
					  //for (var i=iSelectedIndices.length-1 ; i >= 0 ; i--) {
					  //	dataInfo.splice(iSelectedIndices[i],1);
					  //}   
					  
					  	for(var i=0 ; i < aSelected.length ; i++){
							inputWorkTime.push(dataInfo[aSelected[i]]);
						}
					  
					 // oModel.setProperty("/tableRow", parseInt(oModel.getProperty("/tableRow"))-iSelectedIndices.length );
					  //splice는 무조건 배열에 적용되어야 함, 배열.splice(자를 Data의 시작위치, 잘라낼 index의 개수)
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
			
			for(var i=0 ; i < selectedWorkTime.length ; i++){
				var ck = 0;
				for(var j=0 ; j < inputWorkTime.length ; j++){
					if(selectedWorkTime[i].PCODE === inputWorkTime[j].PCODE){
						ck++;
					}
				}
				if(ck > 1){
					MessageToast.show("이미 입력한 프로젝트코드입니다.");
					return 0;
					
				}
			}
			
			
			
			if(iSelectedIndex !== -1) {
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
				
			}else{
				MessageBox.error("데이터를 선택해주십시오");
				return;
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
					MessageToast.show("이미 입력한 프로젝트코드입니다.");
					return 0;
				}
			}
         
         if(iSelectedIndex !== -1) {
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
            MessageBox.error("데이터를 선택해주십시오");
            return;
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


/* 		우리가 TableExample을 실행하는 과정
 * 		: 일단 Table을 만들고, model을 만든 후 view와 바인딩함. (우리는 지금 모델에 이름 안 줌, 그러므로 view의 default모델을 우리가 생성한 모델이 되는 것)
 * 		    우리가 보는 메인 페이지 view는 List.view임
 * 		  List.view에 link를 생성해서 누르면 Detail Dialog가 뜨게 만듦 -> 이렇게 되면 List.controller에서 link press에 선언된 함수가 정의되어 있어야 함
 * 		  List.view에서 Row를 선택 -> 상세버튼 누름 -> 버튼에 연결된 함수가 list.controller로 연결되고 detail.view를 라우팅해서 보여줌
 * 		    근데 Detail.view를 보여주려고 routing을 하는 건데 Detail.controller는 대체 왜 필요함? 안 만들어도 상관없는 거 아닌가 (의문) 왜 1대1이어야만 하낭,,
 */		


/*		 Event의 출발점 
 * 		: this.getView().getModel(); -> 연결된 View의 Model 가져옴 
 *		  Model 내의 Javascript Data를 가져오고 싶음 -> oModel.getProperty("path(가져올 데이터의 경로)");
 *		  근데 우리 예제에서는 Event가 2개 발생함, 링크를 클릭했을 때 뜨는 Dialog와 상세 버튼을 클릭했을 때 뜨는 Datail.view 2개
 *		 상세 버튼을 클릭했을 때 뜨는 Detail.view를 위한 Path는 sPath = oEvent.mParameters.rowContext.sPath; 요런식으로 가져옴 
 *		 링크 클릭 시 뜨는 Detail Dialog의 path는 sPath = oEvent.getSource().getBindingContext().getPath(); 요런식으로 가져오는 경우 多
 *		 디버깅 해서 Path 찾는 법, 모델의 데이터가 잘 들어왔는지, getProperty를 하면 데이터를 잘 가져오는지 등을 확인하는 습관을 들이는 게 좋음 ****		
 */