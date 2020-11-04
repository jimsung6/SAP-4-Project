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
], function(Controller, JSONModel, MessageToast, MessageBox, Dialog, DialogType, Fragment, Button, ButtonType, Text, TextArea, Filter,
	FilterOperator) {
	"use strict";

	return Controller.extend("ExpenseManagement.controller.expenseManagement.kmg.ProjectList_MQ", {

		// 테이블 안에 들어가는 정보
		onInit: function() {
			
			
			this.getView().setModel(new JSONModel({
					globalFilter: "",
					availabilityFilterOn: false,
					cellFilterOn: false,
					comboData: "",
					oPcode : [{
						PCODE : "ALL",
						PNAME : "ALL"
					}],
					headerTableData : ""
					
				
			}),"Project_MQ");
			
			var oData = {
					info: [], //headerdata
					tableData: [], // detaildata
					tableV: false,
					OTable: false,
					table1: false,
					table2: false
			};
			
			this.getView().setModel(new JSONModel(oData));
					
			this.getView().getModel("Project_MQ").setProperty("/comboData", "ALL");
			this.getView().getModel("Project_MQ").setProperty("/dateData", new Date());
			this.getView().getModel("Project_MQ").setProperty("/stcodComboData", "B");
			this.getView().getModel("Project_MQ").setProperty("/tableData", "a");	
			this.getView().getModel("Project_MQ").setProperty("/sButton2", false);	
			
			

			this._oGlobalFilter = null;
			this._oPriceFilter = null;
			

		},
		
			onAfterRendering : function(){
			//랜더링후 필터링 처리작업
			this.onFiltering();
			// this.onPCodeCall();     // where is it?
		},
		
		// onSave : function(){
		// // console.log("aaa");
		// // 	var oModel = this.getView().getModel("Project_MQ");
		// // 	var sData = oModel.getProperty("/tableData");
		// 	var oView = this.byId("ProjectList_MQ"); // this gives you the view
		// 	oView.getController().onSave();
		// },
	
		onliveChange : function(){
			var fliterData = this.getView().getModel("Project_MQ").getProperty("/SearchFieldData");
			var oView = this.byId("ProjectList_MQ");
			oView.getController().onFilterChange(fliterData);
		},
		
		// onReject : function(){
		// // console.log("aaa");
		// // 	var oModel = this.getView().getModel("Project_MQ");
		// // 	var sData = oModel.getProperty("/tableData");
		// 	var oView = this.byId("ProjectList_MQ"); // this gives you the view
		// 	oView.getController().onReject();
		// },
		
		
		//첫 승인화면
		onFiltering: function(event) {
			
			var oModel = this.getView().getModel("Project_MQ");
			var dateData = oModel.getProperty("/dateData");
			var comboData = oModel.getProperty("/comboData");
			var stcodComboData = oModel.getProperty("/stcodComboData");
			
			var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
			
			this.getView().getModel().setProperty("/tableV", false);
			oModel.setProperty("/tableData", []);

			this.byId("AppId").clearSelection();
			
			//버튼 숨기기
			var sButton = this.getView().getModel("Project_MQ").getProperty("/stcodComboData");
			
			if(sButton !== "B"){
				
				this.getView().getModel("Project_MQ").setProperty("/sButton", false);
				this.getView().getModel("Project_MQ").setProperty("/sButton2", false);
			}else{
				this.getView().getModel("Project_MQ").setProperty("/sButton", true);
			}




			//날짜
			var realDateData = new Date(dateData);
			var yyyy = realDateData.getFullYear();
			var mm = realDateData.getMonth() + 1 >= 10 ? realDateData.getMonth() + 1 : "0" + (realDateData.getMonth() + 1);
			var sFromDateInfo = yyyy.toString() + mm.toString();
			var realComboData = comboData;
			var sPCODE = this.getView().getModel("Project_MQ").getProperty("/info");
		

			if (realComboData === "ALL") {
				realComboData = "";
			}

			console.log(sFromDateInfo);
			console.log(stcodComboData);
			console.log(realComboData);

				this.getView().byId("mainTableId").setVisible(false);
				this.getView().byId("ryuTableId").setVisible(false);
				this.getView().byId("kyoTableId").setVisible(false);


			this.getOwnerComponent().rfcCall("ZB_HEADER_SEARCH", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
				I_CUMON: sFromDateInfo,
				I_STCOD: stcodComboData,
				I_AUEMP: EMPNOData, //로그인해서 사원정보를 빼와야한다
				I_PCODE: realComboData
					//RFC Import 데이터
			}).done(function(oResultData) { // RFC호출 완료
				console.log(oResultData.T_TAB1);
				
				oModel.setProperty("/info", oResultData.T_TAB1);
				oModel.setProperty("/TRow", oResultData.T_TAB1.length);
				var table = oModel.getProperty("/info");
				var comboData = oModel.getProperty("/oPcode");
				
				for(var i=0 ; i < table.length; i++){

					if(comboData.length === 1){
						comboData.push(table[i]);
					}else{
						var ck = true;
						for(var j=0 ; j < comboData.length ; j++){
							if( comboData[j].PCODE === table[i].PCODE ){
								ck = false;
							}
						}
						if(ck){
							comboData.push(table[i]);
						}
					}
					
				}
				oModel.refresh();
				
				
				
			}).fail(function(sErrorMessage) { // 호출 실패
				alert(sErrorMessage);
			});
				
			this._oGlobalFilter = null;

		},
		

		//셀 클릭시 상세 테이블 뷰 버튼
		onCellClick: function(oEvent) {
			var rowData = oEvent.mParameters.rowIndex;
			var oModel = this.getView().getModel();
			var sModel = this.getView().getModel("Project_MQ");
			var PCODE = sModel.getProperty("/info/" + rowData + "/PCODE");
			var EMPNO = sModel.getProperty("/info/" + rowData + "/EMPNO");
			var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
			var oCombo = sModel.getProperty("/stcodComboData");
			var dateData = new Date(sModel.getProperty("/dateData"));
		

			var yyyy = dateData.getFullYear();
			var mm = dateData.getMonth() + 1 >= 10 ? dateData.getMonth() + 1 : "0" + (dateData.getMonth() + 1);
			var sFromDateInfo = yyyy.toString() + mm.toString();
			
			
			
			if(oCombo === "B"){
					this.getView().getModel("Project_MQ").setProperty("/sButton2", true);
					this.getView().getModel("Project_MQ").setProperty("/RETTEXTVisible", false);
					this.getView().getModel("Project_MQ").setProperty("/RETINPUTVisible", true);
					this.getView().getModel("Project_MQ").setProperty("/RDATEVisible", false);
					this.getView().getModel("Project_MQ").setProperty("/ACDATVisible", false);
			}else if(oCombo === "C"){
					this.getView().getModel("Project_MQ").setProperty("/sButton2", false);
					this.getView().getModel("Project_MQ").setProperty("/RETTEXTVisible", false);
					this.getView().getModel("Project_MQ").setProperty("/RETINPUTVisible", false);
					this.getView().getModel("Project_MQ").setProperty("/RDATEVisible", true);
					this.getView().getModel("Project_MQ").setProperty("/ACDATVisible", false);
			}else if(oCombo === "D"){
					this.getView().getModel("Project_MQ").setProperty("/sButton2", false);
					this.getView().getModel("Project_MQ").setProperty("/RETTEXTVisible", true);
					this.getView().getModel("Project_MQ").setProperty("/RETINPUTVisible", false);
					this.getView().getModel("Project_MQ").setProperty("/RDATEVisible", true);
					this.getView().getModel("Project_MQ").setProperty("/ACDATVisible", false);
			}else if(oCombo === "E"){
					this.getView().getModel("Project_MQ").setProperty("/sButton2", false);
					this.getView().getModel("Project_MQ").setProperty("/RETTEXTVisible", false);
					this.getView().getModel("Project_MQ").setProperty("/RETINPUTVisible", false);
					this.getView().getModel("Project_MQ").setProperty("/RDATEVisible", true);
					this.getView().getModel("Project_MQ").setProperty("/ACDATVisible", true);
			}else if(oCombo ===  "F"){
					this.getView().getModel("Project_MQ").setProperty("/sButton2", false);
					this.getView().getModel("Project_MQ").setProperty("/RETTEXTVisible", true);
					this.getView().getModel("Project_MQ").setProperty("/RETINPUTVisible", false);
					this.getView().getModel("Project_MQ").setProperty("/RDATEVisible", true);
					this.getView().getModel("Project_MQ").setProperty("/ACDATVisible", false);
			}else{	
					MessageToast.show("상태코드를 확인해주세요");
			}
			
		

			this.getView().getModel().setProperty("/tableV", true);

			this.getOwnerComponent().rfcCall("ZB_HEADER_DETAIL", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
				I_CUMON: sFromDateInfo, //해당 월
				I_EMPNO: EMPNO, //사원 번호
				I_STCOD: oCombo,
				I_PCODE: PCODE,
				I_AUEMP: EMPNOData //로그인해서 사원정보를 빼와야한다
					//RFC Import 데이터
			}).done(function(oResultData) { // RFC호출 완료

				console.log(oResultData);

				oModel.setProperty("/headerTableData", oResultData.TAB1);
				
				oModel.setProperty("/tableRow", oResultData.TAB1.length);

			for (var i = 0; i < oResultData.TAB1.length; i++) {
				var realREDATE = oModel.getProperty("/headerTableData/" + i + "/REDATE");
				var realAPPDAT = oModel.getProperty("/headerTableData/" + i + "/APPDAT");
				var realRDATE = oModel.getProperty("/headerTableData/" + i + "/RDATE");
				var realACDAT = oModel.getProperty("/headerTableData/" + i + "/ACDAT");

				if (realREDATE === "0000-00-00") {
					oModel.setProperty("/headerTableData/" + i + "/REDATE", " ");
				}
				if (realAPPDAT === "0000-00-00") {
					oModel.setProperty("/headerTableData/" + i + "/APPDAT", " ");
				}
				if (realRDATE === "0000-00-00") {
					oModel.setProperty("/headerTableData/" + i + "/RDATE", " ");
				}
				if (realACDAT === "0000-00-00") {
					oModel.setProperty("/headerTableData/" + i + "/ACDAT", " ");
				}
			}
				
				
				
			}).fail(function(sErrorMessage) { // 호출 실패
				alert(sErrorMessage);
			});
			
			var sPCODE = oEvent.getSource().getBindingContext();
			
				this.getView().byId("mainTableId").setVisible(false);
				this.getView().byId("ryuTableId").setVisible(false);
				this.getView().byId("kyoTableId").setVisible(false);
			
		},

		rowSelection: function(event) {
			//MessageToast.show(event);
			var oModel = this.getView().getModel();
			var tableData = oModel.getProperty("/tableData");
			if (event.mParameters.rowContext) {
				var path = event.mParameters.rowContext.sPath;
			}

			if (event.mParameters.selectAll) {
				for (var i = 0; i < tableData.length; i++) {
					tableData[i].checked = true;
				}
			} else {
				if (event.mParameters.rowIndex === -1) {
					for (var i = 0; i < tableData.length; i++) {
						tableData[i].checked = false;
					}
				} else {
					if (oModel.getProperty(path + "/checked")) {
						oModel.setProperty(path + "/checked", false);
					} else {
						oModel.setProperty(path + "/checked", true);
					}
				}
			}

			//console.log(tableData);

		},
		
		//사원 코드 -> 사원 이름으로 보이는 코드
	onFilterChange : function(fliterData){
		
		var realFliterData = fliterData;
		
		var aFilter = [];
		if (realFliterData) {
			aFilter.push(new Filter("ENAME", FilterOperator.Contains, realFliterData));
		}

		// filter binding
		var oList = this.byId("tableExample");
		var oBinding = oList.getBinding("rows");
		oBinding.filter(aFilter);
			
			
	},
		// 승인(헤더)
		onSave: function() {
			var that = this;
			var payModel = this.getView().getModel();
			var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
			var selectTable = payModel.getProperty("/tableData");

			var tableData = [];

			for (var i = 0; i < selectTable.length; i++) {
				if (selectTable[i].checked) {
					tableData.push({
						JPNUM: selectTable[i].JPNUM,
						EMPNO: selectTable[i].EMPNO,
						PCODE: selectTable[i].PCODE,
						CUMON: selectTable[i].CUMON
					});
				}
			}
			console.log(tableData);
			////   RFC호출
			this.getOwnerComponent().rfcCall("ZB_HEADER_CONFIRM", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_CONFIRM를 사용
				//RFC Import 데이터
				T_TAB1: tableData,
				I_AUEMP: EMPNOData, //로그인해서 사원정보를 빼와야한다
				I_MODE: "A"

			}).done(function(oResultData) { // RFC호출 완료
			
				var dateData = payModel.getProperty("/dateData", dateData);
				var comboData = payModel.getProperty("/comboData", comboData);
				var stcodComboData = payModel.getProperty("/stcodComboData", stcodComboData);
				that.onFiltering();
				
			}).fail(function(sErrorMessage) { // 호출 실패
				MessageToast.show(sErrorMessage);
			});
		},

		// 반려(헤더)
		onReject: function() {
			var that = this;
			var payModel = this.getView().getModel();
			var selectTable = payModel.getProperty("/tableData");
			var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
			var tableData = [];

			for (var i = 0; i < selectTable.length; i++) {
				if (selectTable[i].checked) {
					tableData.push({
						JPNUM: selectTable[i].JPNUM,
						EMPNO: selectTable[i].EMPNO,
						PCODE: selectTable[i].PCODE,
						CUMON: selectTable[i].CUMON
					});
				}
			}
			console.log(tableData);
			////   RFC호출
			this.getOwnerComponent().rfcCall("ZB_HEADER_CONFIRM", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_CONFIRM를 사용
				//RFC Import 데이터
				T_TAB1: tableData,
				I_AUEMP: EMPNOData, //로그인해서 사원정보를 빼와야한다
				I_MODE: "B"

			}).done(function(oResultData) { // RFC호출 완료

			}).fail(function(sErrorMessage) { // 호출 실패
				MessageToast.show(sErrorMessage);
			}).then(function() {

				var dateData = payModel.getProperty("/dateData", dateData);
				var comboData = payModel.getProperty("/comboData", comboData);

				var stcodComboData = payModel.getProperty("/stcodComboData", stcodComboData);
				that.onFiltering();
			});
		},

		selDetail: function(oEvent) {

			//row 데이터 뽑기
			var sPath = oEvent.getSource().getBindingContext().getPath();

			//전표 번호 데이터
			var JPNUMData = this.getView().getModel().getProperty(sPath).JPNUM;

			//전표 번호 데이터 모델에 넣어주기
			this.getView().getModel().setProperty("/JPNUMData", JPNUMData);

			// 유류대 테이블 RFC 호출 테스트 끝

			// 1 선택한 로우의 정보를 가져온다.

			var selFlag = oEvent.getSource().data("flag");

			if (selFlag == '0001') {
				// console.log(this.getView().byId("det01").getVisible());
				this.getView().byId("mainTableId").setVisible(true);
				this.getView().byId("ryuTableId").setVisible(false);
				this.getView().byId("kyoTableId").setVisible(false);
				this.sikTableCall(JPNUMData);
			} else if (selFlag == '0002') {
				this.getView().byId("mainTableId").setVisible(false);
				this.getView().byId("ryuTableId").setVisible(true);
				this.getView().byId("kyoTableId").setVisible(false);
				//유류대 RFC 호출
				this.ryuTableCall(JPNUMData);
			} else if (selFlag == '0003') {
				this.getView().byId("mainTableId").setVisible(false);
				this.getView().byId("ryuTableId").setVisible(false);
				this.getView().byId("kyoTableId").setVisible(true);
				this.kyoTableCall(JPNUMData);
			} else {
				this.getView().byId("mainTableId").setVisible(false);
				this.getView().byId("ryuTableId").setVisible(false);
				this.getView().byId("kyoTableId").setVisible(false);
			}
		},

		sikTableCall: function(JPNUMData) {
			//식대 테이블 RFC
			var oModel = this.getView().getModel();
			// var JPNUM = oModel.getProperty("/JPNUMData");

			this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
				//RFC Import 데이터
				I_MODE: "B", //모드
				I_JPNUM: JPNUMData
			}).done(function(oResultData) { // RFC호출 완료

				for (var i = 0; i < oResultData.TAB2.length; i++) {
					oResultData.TAB2[i].HANGN = parseInt(oResultData.TAB2[i].HANGN);
					oResultData.TAB2[i].SIKSU = parseInt(oResultData.TAB2[i].SIKSU);
				}
				oModel.setProperty("/info", oResultData.TAB2);
				oModel.setProperty("/tableRow2", oResultData.TAB2.length);
				console.log(oResultData.TAB2);
				//oResultData.TAB1[0].NOTE
			}).fail(function(sErrorMessage) { // 호출 실패
				MessageToast.show(sErrorMessage);
			}).then(function() {
				// 여기다가 rfc 호출후 작업코딩
			});
		},

		ryuTableCall: function(JPNUMData) {
			//유류대 테이블 RFC

			var oModel = this.getView().getModel();

			this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
				//RFC Import 데이터
				I_MODE: "C", //모드
				I_JPNUM: JPNUMData

			}).done(function(oResultData) { // RFC호출 완료
				oModel.setProperty("/OilTable", oResultData.TAB3);
				oModel.setProperty("/OTableRowData", oResultData.TAB3.length);
				console.log(oResultData.TAB3);
				//oResultData.TAB1[0].NOTE
			}).fail(function(sErrorMessage) { // 호출 실패
				MessageToast.show(sErrorMessage);
			}).then(function() {
				// 여기다가 rfc 호출후 작업코딩
			});
		},

		kyoTableCall: function(JPNUMData) {
			//교육훈련비 테이블 RFC호출 테스트 시작

			var oModel = this.getView().getModel();

			this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
				//RFC Import 데이터

				I_MODE: "D", //모드
				I_JPNUM: JPNUMData

			}).done(function(oResultData) { // RFC호출 완료

				for (var i = 0; i < oResultData.TAB4.length; i++) {
					oResultData.TAB4[i].FDATE = new Date(oResultData.TAB4[i].FDATE);
					oResultData.TAB4[i].TDATE = new Date(oResultData.TAB4[i].TDATE);
				}

				oModel.setProperty("/kyoinfo", oResultData.TAB4);
				oModel.setProperty("/kyoinfoRowData", oResultData.TAB4.length);

				console.log(oResultData.TAB4);
				//oResultData.TAB1[0].NOTE
			}).fail(function(sErrorMessage) { // 호출 실패
				MessageToast.show(sErrorMessage);
			}).then(function(oResultData) {

			});
		}
	});
});