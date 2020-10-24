sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/ui/core/Fragment",
    "sap/m/MessageToast",
    "sap/ui/core/format/DateFormat",
    "sap/ui/thirdparty/jquery"
    // "../model/formatter"
], function(Controller, MessageToast, JSONModel, Filter, FilterOperator,MessageBox,Fragment ) {
   "use strict";

   return Controller.extend("ExpenseManagement.controller.expenseManagement.kyj.Approyj", {
	  //formatter: formatter,
      onInit : function(){
  //    	this.getOwnerComponent().getModel('testModel').setProperty('/', {test:123});
		// console.log(this.getOwnerComponent().getModel('testModel').getProperty('/'));
      	 var that = this;
         var odata = {
            tableData: [],
            saveData: [],
            info : [],
			fragInfo : [],
			comboDataItems : [],
			eCodhc : [],
			proInfo : [],
			OilTable: [],
			ryuItems: [],
			kyoinfo:[],
			// realDate: ""
			// OilItem:[{
			// 	code : "A",
			// 	Name : "LPG"
			// },{
			// 	code : "B",
			// 	Name : "경유"
			// },{
			// 	code : "C",
			// 	Name : "휘발유"
			// }]

         };
			this.getView().byId("mainTableId").setVisible(false);
			this.getView().byId("ryuTableId").setVisible(false);
			this.getView().byId("kyoTableId").setVisible(false);
       var oModel = new JSONModel(odata);
		 this.getView().setModel(oModel);
		 this.getView().getModel().setProperty("/OTable", false);
		 this.getView().getModel().setProperty("/KTable", false);
         
         
		//SIKDAE테이블 로우 초기 세팅
		var tableRowcont = this.getView().getModel().getProperty("/info").length;
		this.getView().getModel().setProperty("/tableRow", tableRowcont);

		this.getOwnerComponent().rfcCall("ZB_GCODE_96", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
		   //RFC Import 데이터
		}).done(function(oResultData){   // RFC호출 완료
		   that.getView().getModel().setProperty("/comboDataItems", oResultData.T_ZBMDT0020);
		}).fail(function(sErrorMessage){// 호출 실패
		   alert(sErrorMessage);
		}).then(function(){
		   // 여기다가 rfc 호출후 작업코딩
		});
         //초기 세팅
         
         
         var oDate = new Date();

         var yyyy = oDate.getFullYear();
         var mm = oDate.getMonth()+1;

         this.getView().getModel().setProperty("/comboData", "A");
         //this.getView().getModel().setProperty("/dateData", yyyy+"."+mm);
        this.getView().byId("DP10").setDateValue(oDate);
         
         //this.onDisplay();
      },
  //     pressTest2: function() {
		// var testModel = this.getOwnerComponent().getModel("testModel").getProperty('/');
		//   sap.ui.controller("Appro.controller.home").callFunc01(testModel);
	 // },

	  selDetail: function(event) {
		console.log(event.getSource().data("flag"));
		console.log("test selDetail");
		



		//row 데이터 뽑기
		
		var sPath = event.getSource().getBindingContext().getPath();
		
		//전표 번호 데이터
	
		var JPNUMData = this.getView().getModel().getProperty(sPath).JPNUM;
		//전표 번호 데이터 모델에 넣어주기
		this.getView().getModel().setProperty("/JPNUMData",JPNUMData);
		
		var comboData = this.getView().getModel().getProperty("/comboData");
		// var ryuTable = this.getView().getModel().getProperty("/OilTable")[0].CARTY
		

		console.log(JPNUMData);
		//	테이블 입력칸 작업
		if(comboData === "A" || comboData === "F" || comboData === "D"){
		  this.getView().getModel().setProperty("/input", true);
		  this.getView().getModel().setProperty("/text", false);
		  this.getView().getModel().setProperty("/Oinput", true); // 승인요청 상태일때 테스트
		  this.getView().getModel().setProperty("/Otext", false);
		  this.getView().getModel().setProperty("/ryuButton", true);
		}else{
		  this.getView().getModel().setProperty("/input", false);
		  this.getView().getModel().setProperty("/text", true);
		  this.getView().getModel().setProperty("/Oinput", false); // 승인요청 상태일때 테스트
		  this.getView().getModel().setProperty("/Otext", true);
		  this.getView().getModel().setProperty("/ryuButton", false);
		}		
		
		// 유류대 테이블 RFC 호출 테스트 끝

		// 1 선택한 로우의 정보를 가져온다.

		var selFlag = event.getSource().data("flag");

		if(selFlag=='0001') {
			// console.log(this.getView().byId("det01").getVisible());
			this.getView().byId("mainTableId").setVisible(true);
			this.getView().byId("ryuTableId").setVisible(false);
			this.getView().byId("kyoTableId").setVisible(false);
			this.sikTableCall(JPNUMData);
		} else if(selFlag=='0002') {
			//유류대 RFC 호출
		

			
			this.getView().byId("mainTableId").setVisible(false);
			this.getView().byId("ryuTableId").setVisible(true);
			this.getView().byId("kyoTableId").setVisible(false);
			this.ryuTableCall(JPNUMData);
			
			
			// if(ryuTable)
			// {	
			// 	this.getView().getModel().setProperty("/Oinput", false);
			// 	this.getView().getModel().setProperty("/Otext", true);
			// }else
			// {
			// 	this.getView().getModel().setProperty("/Oinput", true);
			// 	this.getView().getModel().setProperty("/Otext", false);
			// }
		} else if(selFlag=='0003') {
			this.getView().byId("mainTableId").setVisible(false);
			this.getView().byId("ryuTableId").setVisible(false);
			this.getView().byId("kyoTableId").setVisible(true);
			this.kyoTableCall(JPNUMData);
		}else{
			this.getView().byId("mainTableId").setVisible(false);
			this.getView().byId("ryuTableId").setVisible(false);
			this.getView().byId("kyoTableId").setVisible(false);
		}
		
	  },

      onAfterRendering : function(){
         this.onDisplay();
         },
	
   ryuTableCall : function(JPNUMData){
      //유류대 테이블 RFC호출 테스트 시작

      var oModel = this.getView().getModel();
      

      this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
         //RFC Import 데이터
         I_MODE : "C" ,  //모드
         I_JPNUM : JPNUMData
         
         }).done(function(oResultData){   // RFC호출 완료
            for(var i=oResultData.TAB3.length-1 ; i > 0 ; i--){
               if(!oResultData.TAB3[i].CARTY){
                  oResultData.TAB3.splice(i, 1);
               }
            }
            oModel.setProperty("/OilTable", oResultData.TAB3);
            oModel.setProperty("/OTableRowData", oResultData.TAB3.length)
            console.log(oResultData.TAB3);
            //oResultData.TAB1[0].NOTE
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){
         // 여기다가 rfc 호출후 작업코딩
         });
   },


onkyoItemSave : function(){
      var oModel = this.getView().getModel();
      var JPNUMData = parseInt(this.getView().getModel().getProperty("/JPNUMData"));
	  // var kyoItem = oModel.getProperty("/kyoinfo");
	  var that = this


	  var kyoinfoData = oModel.getProperty("/kyoinfo");
	  

	  MessageBox.confirm("교육훈련 아이템뷰를 저장하시겠습니까??", {
		actions: ["저장", MessageBox.Action.CLOSE],
		emphasizedAction: "저장",
		onClose: function (sAction) {

			if(sAction === "저장"){

				if(JPNUMData){
         
					that.getOwnerComponent().rfcCall("ZB_INPUT_APPRO", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
					   //RFC Import 데이터
					   
					   I_MODE : "E" ,  //모드
					   I_JPNUM : JPNUMData,
					   TAB4 : kyoinfoData
					   
					   
					   
					   }).done(function(oResultData){   // RFC호출 완료
						  oModel.setProperty("/kyoinfo", oResultData.TAB4);
						  console.log(oResultData.TAB4);
						  //oResultData.TAB1[0].NOTE
					   }).fail(function(sErrorMessage){// 호출 실패
						  MessageToast.show(sErrorMessage);
					   }).then(function(){
						  oModel.refresh();
					   });         
				 }


				MessageToast.show("저장되었습니다");
			}else{
				MessageToast.show("취소되었습니다");
			}
		}
	});




      // for(var i=0 ; i < kyoinfoData.length ; i++){
      //    var date = new Date(kyoinfoData[i].FDATE);
      //    var yyyy = date.getFullYear();
      //    var mm = date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0"+(date.getMonth()+1);
      //    var dd = date.getDate() >= 10 ? date.getDate() : "0"+date.getDate();

      //    kyoinfoData[i].FDATE = parseInt(yyyy.toString()+"-"+mm.toString()+"-"+dd.toString());
      // }
      
      // for(var i=0 ; i < kyoinfoData.length ; i++){
      //    var date = new Date(kyoinfoData[i].TDATE);
      //    var yyyy = date.getFullYear();
      //    var mm = date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0"+(date.getMonth()+1);
      //    var dd = date.getDate() >= 10 ? date.getDate() : "0"+date.getDate();

      //    kyoinfoData[i].TDATE = yyyy.toString()+"-"+mm.toString()+"-"+dd.toString();
      // }

      console.log(kyoinfoData);

      // oModel.getProperty("/kyoinfo")[0].JPNUM = JPNUMData
      
   

      // var oCARTY = this.getView().getModel().getProperty("/OilTable")[0].CARTYData;
      // var oOILTY = this.getView().getModel().getProperty("/OilTable")[0].OILTYData;
      // var InHOMET = this.getView().getModel().getProperty("/OilTable")[0].InHOMET;
      // var InPROPR = this.getView().getModel().getProperty("/OilTable")[0].InPROPR;
      // var InBIGO = this.getView().getModel().getProperty("/OilTable")[0].InBIGO;


      

      // var OilItem = this.byId("OilItem").mAggregations.items[0].mProperties.text;

      // console.log(OilItem);
      
      




      // var tableData = [
      //    {
      //       MANDT : "230",
      //       JPNUM : JPNUMData,
      //       CARTY : oCARTY,
      //       OILTY : oOILTY,
      //       HOMET : InHOMET,
      //       PROPR : InPROPR,
      //       BIGO : InBIGO
      //    }
      // ]

 

   },


   /****************************************
    * 함수 : 교육 테이블 데이터 RFC 콜 함수  :: 김성윤 2020-10-21
    * **************************************/




   kyoTableCall : function(JPNUMData){
      //유류대 테이블 RFC호출 테스트 시작

	  var oModel = this.getView().getModel();
	  
      
      

      this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
         //RFC Import 데이터
         I_MODE : "D" ,  //모드
         I_JPNUM : JPNUMData
         
         }).done(function(oResultData){   // RFC호출 완료
            // for(var i=oResultData.TAB3.length-1 ; i > 0 ; i--){
            //    if(!oResultData.TAB3[i].CARTY){
            //       oResultData.TAB3.splice(i, 1);
            //    }
			// }
			
			for(var i=0 ; i < oResultData.TAB4.length ; i++){
				oResultData.TAB4[i].FDATE = new Date(oResultData.TAB4[i].FDATE);
				oResultData.TAB4[i].TDATE = new Date(oResultData.TAB4[i].TDATE);
				
				// var yyyy = (oResultData.TAB4[i].FDATE).getFullYear();
				// var mm = (oResultData.TAB4[i].FDATE).getMonth();
				// var dd = (oResultData.TAB4[i].FDATE).getDate();

				// oResultData.TAB4[i].FDATE = parseInt(yyyy + "-" + mm + "-" + dd);
				
				

            }

			oModel.setProperty("/kyoinfo", oResultData.TAB4);
            oModel.setProperty("/kyoinfoRowData", oResultData.TAB4.length);
           
          
            console.log(oResultData.TAB4);
            //oResultData.TAB1[0].NOTE
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(oResultData){

         });
   },

/****************************************
    * 함수 : 교육 테이블 날짜데이터 셀렉트 함수  :: 김성윤 2020-10-21
    * **************************************/

   handleChangeF: function(oEvent) {
      var oModel = this.getView().getModel(), 
         sPath = oEvent.getSource().getBindingContext().getPath(),
         oSelectData = oModel.getProperty(sPath),         //선택한 라인 경로
         sSelectDate = oEvent.getSource().getValue();      //datePicker에서 선택한 날짜 가져오기
      
      oSelectData.FDATE = sSelectDate;                  //선택한 날짜 저장
   
    },
    
   handleChangeT: function(oEvent) {
      var oModel = this.getView().getModel();
        //  sPath = oEvent.getSource().getBindingContext().getPath(),
        //  oSelectData = oModel.getProperty(sPath),         //선택한 라인 경로
		//  sSelectDate = oEvent.getSource().getValue();      //datePicker에서 선택한 날짜 가져오기
		var oSelectData = oModel.getProperty("/kyoinfo/0");
		var sSelectDate = oEvent.getSource().mProperties.value;
      
      
      oSelectData.TDATE = sSelectDate;            //선택한 날짜 저장
    },

	/****************************************
	 * 함수 : 식대 테이블 데이터 RFC 콜 함수
	 * **************************************/
	sikTableCall : function(JPNUMData){
		var oModel = this.getView().getModel();
		var JPNUM = oModel.getProperty("/JPNUMData");

		console.log(JPNUM);


		this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
			//RFC Import 데이터
			I_MODE : "B" ,  //모드
			I_JPNUM : JPNUM
			
			}).done(function(oResultData){   // RFC호출 완료

				for(var i=0 ; i < oResultData.TAB2.length ; i++){
					oResultData.TAB2[i].HANGN = parseInt(oResultData.TAB2[i].HANGN);
					oResultData.TAB2[i].SIKSU = parseInt(oResultData.TAB2[i].SIKSU);
				}
				oModel.setProperty("/info", oResultData.TAB2);
				oModel.setProperty("/tableRow2", oResultData.TAB2.length)
				console.log(oResultData.TAB2);
				//oResultData.TAB1[0].NOTE
			}).fail(function(sErrorMessage){// 호출 실패
				MessageToast.show(sErrorMessage);
			}).then(function(){
			// 여기다가 rfc 호출후 작업코딩
			});
	},

	/****************************************
	 * 함수 : 유류대 테이블 로우 추가 함수
	 * **************************************/
	OTableRowAdd : function(){
		MessageToast.show("추가");
		var oModel = this.getView().getModel();
		
		var OilTableData = oModel.getProperty("/OilTable");

		OilTableData.push({
			CARTY : "",
			OILTY : "",
			HOMET : "",
			PROPR : "",
			BIGO : "",
			ADDIM : ""
		});

		oModel.setProperty("/OTableRowData", parseInt(oModel.getProperty("/OTableRowData"))+1)


	},

		/****************************************
	 * 함수 : 교육 테이블 로우 추가 함수 2020-10-22 김성윤
	 * **************************************/
	KTableRowAdd : function(){
		MessageToast.show("추가");
		var oModel = this.getView().getModel();
		
		var kyoinfo = oModel.getProperty("/kyoinfo");
		
		kyoinfo.push({
			FDATE : "",
			TDATE : "",
			EDUNA : "",
			EDUOR : "",
			PROPR : "",
			BIGO : "",
			ADDIM : ""
		});

		oModel.setProperty("/kyoinfoRowData", parseInt(oModel.getProperty("/kyoinfoRowData"))+1);




	},



	/****************************************
	 * 함수 : 유류대 테이블 로우 삭제 함수
	 * **************************************/
	OTableRowDel : function(){
		MessageToast.show("삭제");

		var oModel = this.getView().getModel();
		var OilTableData = oModel.getProperty("/OilTable");


		if(oModel.getProperty("/OTableRowData") < 1){
			MessageBox.error("더 이상 삭제할수 없습니다.");
		}else{
			OilTableData.pop();
			oModel.setProperty("/OTableRowData", parseInt(oModel.getProperty("/OTableRowData"))-1)
		}
	},

	/****************************************
	 * 함수 : 교육 테이블 로우 삭제 함수
	 * **************************************/

	KTableRowDel : function(){

		MessageToast.show("삭제");

		var oModel = this.getView().getModel();
		var kyoinfo = oModel.getProperty("/kyoinfo");

		if(oModel.getProperty("/kyoinfoRowData") > 0){
			kyoinfo.pop();
			oModel.setProperty("/kyoinfoRowData", parseInt(oModel.getProperty("/kyoinfoRowData"))-1)
		}else{
			MessageBox.error("더 이상 삭제할수 없습니다.");
		}

	},



	/****************************************
	 * 함수 : 유류대 테이블 저장 버튼 함수 :: 김성윤 10/21
	 * **************************************/
	onItemSave : function(){
		var oModel = this.getView().getModel();
		var JPNUMData = parseInt(this.getView().getModel().getProperty("/JPNUMData"));
		var ryuItem = oModel.getProperty("/OilTable");
		var that = this;


		// var kyoinfoData = oModel.getProperty("/kyoinfo");

		// for(var i=0 ; i < kyoinfoData.length ; i++){
		// 	var date = new Date(kyoinfoData[i].FDATE);
		// 	var yyyy = date.getFullYear();
		// 	var mm = date.getMonth()+1 >= 10 ? date.getMonth()+1 : "0"+(date.getMonth()+1);
		// 	var dd = date.getDate() >= 10 ? date.getDate() : "0"+date.getDate();

		// 	kyoinfoData[i].FDATE = yyyy.toString()+"-"+mm.toString()+"-"+dd.toString();
		

		/***********************
		 * 아이템뷰 저장 메세지   2020-10-22 김성윤
		 * *************************/
		MessageBox.confirm("유류대 아이템뷰를 저장하시겠습니까??", {
			actions: ["저장", MessageBox.Action.CLOSE],
			emphasizedAction: "저장",
			onClose: function (sAction) {

				if(sAction === "저장"){

					if(JPNUMData){
			
						that.getOwnerComponent().rfcCall("ZB_INPUT_APPRO", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
							//RFC Import 데이터
							
							I_MODE : "C" ,  //모드
							I_JPNUM : JPNUMData,
							TAB3 : ryuItem
							
							
							
							}).done(function(oResultData){   // RFC호출 완료
								oModel.setProperty("/OilTable", oResultData.TAB3);
								console.log(oResultData.TAB3);
								//oResultData.TAB1[0].NOTE
							}).fail(function(sErrorMessage){// 호출 실패
								MessageToast.show(sErrorMessage);
							}).then(function(){
								oModel.refresh();
							});			
					}


					MessageToast.show("저장되었습니다");
				}else{
					MessageToast.show("취소되었습니다");
				}
			}
		});

		

		// oModel.getProperty("/OilTable")[0].JPNUM = JPNUMData
		
	

		// var oCARTY = this.getView().getModel().getProperty("/OilTable")[0].CARTYData;
		// var oOILTY = this.getView().getModel().getProperty("/OilTable")[0].OILTYData;
		// var InHOMET = this.getView().getModel().getProperty("/OilTable")[0].InHOMET;
		// var InPROPR = this.getView().getModel().getProperty("/OilTable")[0].InPROPR;
		// var InBIGO = this.getView().getModel().getProperty("/OilTable")[0].InBIGO;


		

		// var OilItem = this.byId("OilItem").mAggregations.items[0].mProperties.text;

		// console.log(OilItem);
		
		




		// var tableData = [
		// 	{
		// 		MANDT : "230",
		// 		JPNUM : JPNUMData,
		// 		CARTY : oCARTY,
		// 		OILTY : oOILTY,
		// 		HOMET : InHOMET,
		// 		PROPR : InPROPR,
		// 		BIGO : InBIGO
		// 	}
		// ]

	

	},



      //저장 버튼 이벤트 함수
      
		onSave: function() {
				var comboData = this.getView().getModel().getProperty("/comboData");
				// var PaywaData = this.getView().getModel().getProperty("/PAYWA");
				// var realDate = this.getView().byId("DP1").getDateValue("/REDATE");
				var oModel = this.getView().getModel();
				var that = this;
				var realTable = oModel.getProperty("/tableData");
				var realNothing = [];
				var Count = false;
				var cnt = 0;
				// var comDate = 
				var oDate = new Date();
				var yyyy = oDate.getFullYear();
				// var mm = oDate.getMonth()+1 >= 10 ? oDate.getMonth()+1 : "0"+(oDate.getMonth()+1);
				var mm = oDate.getMonth() + 1 >= 10 ? oDate.getMonth() + 1 : "0" + (oDate.getMonth() + 1);
				// var NOTE = oModel.getProperty("/PNAME");
				mm = String(mm);
				var dd = oDate.getDate();
				var dateDD = yyyy + mm + dd;

				var sTest = realTable;

				//var dateValue = sYear + sMonth;
				if(comboData === "B" || comboData === "C" || comboData === "E" || comboData === "F") {
						MessageBox.warning("상태필드를 확인해 주세요.");
						//빈값 팝업창
					} else if (comboData === "A" || comboData === "D") {
						for (var i = 0; i < realTable.length; i++) {
							if (realTable[i].checked != true) {
								continue;
							}
							if (realTable[i].PNAME == "" || realTable[i].PNAME == null) {
								MessageBox.error("프로젝트를 입력해주세요.");
								return;
							} else if (realTable[i].CODDN == "" || realTable[i].CODDN == null) {
								MessageBox.error("계정과목을 입력해주세요.");
								return;
							

						
					} else {
						for (var i = 0; i < realTable.length; i++) {
							if (realTable[i].checked) {
								Count = true;
								if (!realTable[i].JPNUM) {
									realTable[i].JPNUM = "0";
								}
								realTable[i].EMPNO = "20201200010";
								realTable[i].GCODE = "120";
								realTable[i].CUMON = yyyy + mm;
								// realTable[i].REDATE = realTable[i].realDate;
								//realTable[i].REDATE = "";
								realTable[i].APPDAT = "";
								realTable[i].RDATE = "";
								realTable[i].ACDAT = "";
								delete realTable[i].checked;
								realNothing.push(realTable[i]);
							}
						}
						//oModel.setProperty("/tableRow", parseInt(oModel.getProperty("/tableRow"))-cnt);
						console.log(realNothing);

						if (Count) {
							this.getOwnerComponent().rfcCall("ZB_INPUT_APPRO", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
								//RFC Import 데이터
								I_MODE: 'B',
								TAB1: realNothing
							}).done(function(oResultData) { // RFC호출 완료
								console.log(oResultData);
								//oResultData.TAB1[0].NOTE
							}).fail(function(sErrorMessage) { // 호출 실패
								MessageToast.show(sErrorMessage);
							}).then(function() {

								// that.byId("AppId").removeSelectionInterval(realTable[i]);

								that.byId("AppId").removeSelectionInterval(0, realTable.length);

								for (var i = 0; i < realTable.length; i++) {
									if (realTable[i].checked) {
										realTable[i].checked = false;
										oModel.refresh();
									}
								}

								that.onDisplay();
								var tableRowdata = that.getView().getModel().getProperty("/tableData").length;
								oModel.setProperty("/tableRow", tableRowdata);

								that.getView().getModel().refresh();
							});
						} else {
							MessageBox.warning("선택한 전표가 없습니다 ●_● ");
						}
					}
			}

		}

	},

	//승인 요청 버튼 이벤트 함수 1020윤지
	onReq: function() {
		var comboData = this.getView().getModel().getProperty("/comboData");
		var oModel = this.getView().getModel();
		var that = this;
		var realTable = oModel.getProperty("/tableData");
		var realNothing = [];
		var Count = false;
		var cnt = 0;
		if (comboData === "B" || comboData === "C" || comboData === "E" || comboData === "F") {
			MessageBox.warning("상태필드를 확인해 주세요.");
		} else if (comboData === "A" || comboData === "D") {
			for (var i = 0; i < realTable.length; i++) {
				if (realTable[i].checked) {
					if (realTable[i].PROPR == "" || realTable[i].PROPR == null
						|| realTable[i].REDATE.trim() == "" ||realTable[i].REDATE == null 
						|| realTable[i].PAYWA.trim() == "" ||realTable[i].PAYWA == null) {
						MessageBox.error("빈값을 채워주세요.");
						return;
					} else {
						Count = true;
						realTable[i].ACDAT = "";
						realTable[i].APPDAT = "";
						delete realTable[i].checked;
						realTable[i].RDATE = "";
						realTable[i].REDATE = "";
						realTable[i].RETCODE = "";
						realNothing.push(realTable[i]);

						this.getView().getModel().refresh();
					}
				}
			}

			console.log(realNothing);

			if (Count) {
				this.getOwnerComponent().rfcCall("ZB_INPUT_APPRO", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
					//RFC Import 데이터
					I_MODE: 'A',
					TAB1: realNothing

				}).done(function(oResultData) { // RFC호출 완료
					console.log(oResultData);
					//oResultData.TAB1[0].NOTE
				}).fail(function(sErrorMessage) { // 호출 실패
					MessageToast.show(sErrorMessage);
				}).then(function() {

					// that.byId("AppId").removeSelectionInterval(realTable[i]);

					for (var i = realTable.length - 1; i >= 0; i--) {
						if (realTable[i].checked) {
							oModel.getProperty("/tableData")[i].checked = false;
							realTable.splice(i, 1);
							oModel.refresh();
							cnt++;
						}
					}

					that.byId("AppId").removeSelectionInterval(0, realTable.length);

					for (var i = 0; i < realTable.length; i++) {
						if (realTable[i].checked) {
							realTable[i].checked = false;
							oModel.refresh();
						}
					}

					that.onDisplay();
					oModel.setProperty("/tableRow", parseInt(oModel.getProperty("/tableRow")) - cnt);

				});
			} else {
				MessageBox.warning("선택한 전표가 없습니다 ●_● ");
			}

		}

	},
	onRowde: function(oEvent) {
		var oModel = this.getView().getModel();
		var realNothing = [];
		var realTable = oModel.getProperty("/tableData");

		var oTable = this.getView().byId("AppId");
		var iSelectedIndex = oTable.getSelectedIndex();
		var iSelectedIndices = oTable.getSelectedIndices();
		var that = this;
		var oModel = that.getView().getModel();
		//var aSelectedIndex = oModel.getProperty("/tableInfo");
		//aSelectedIndex.splice(iSelectedIndex,1);
		var dataInfo = oModel.getProperty("/tableData");

		for (var i = iSelectedIndices.length - 1; i >= 0; i--) {
			dataInfo.splice(iSelectedIndices[i], 1);
		}
		oModel.setProperty("/tableRow", parseInt(oModel.getProperty("/tableRow")) - iSelectedIndices.length);
		//splice는 무조건 배열에 적용되어야 함, 배열.splice(자를 Data의 시작위치, 잘라낼 index의 개수)
		that.byId("AppId").removeSelectionInterval(0, dataInfo.length);
		oModel.refresh();
	},

	// 로우 추가 이벤트 함수
	onRowAdd: function() {

		var rowTableData = this.getView().getModel().getProperty("/tableRow");

		var realtable = this.getView().getModel().getProperty("/tableData");

		realtable.push({
			PCODE: "",
			CODHC: "",
			NOTE: "",
			PAYWANA: "",
			PROPR: "",
			REDATE: "",
			REPHO: "",
			ACCPE: "",
			APPDAT: "",
			STCODNA: "",
			RDATE: "",
			RETTEXT: "",
			ACDAT: ""
		});
		this.getView().getModel().refresh();

		rowTableData += 1;
		this.getView().getModel().setProperty("/tableRow", rowTableData);

	},

	onDisplay: function() {

		var aaa = this.getView().byId("DP10").getDateValue();

		// 데이터 들고오기
		var comboData = this.getView().getModel().getProperty("/comboData");

		//테이블 입력칸 작업
		if (comboData === "A" || comboData === "F" || comboData === "D") {
			this.getView().getModel().setProperty("/input", true);
			this.getView().getModel().setProperty("/text", false);
			this.getView().getModel().setProperty("/Oinput", true);
			this.getView().getModel().setProperty("/Otext", false);
			this.getView().getModel().setProperty("/OTable", false);
			this.getView().getModel().setProperty("/KTable", false);
		} else {
			this.getView().getModel().setProperty("/input", false);
			this.getView().getModel().setProperty("/text", true);
			this.getView().getModel().setProperty("/Oinput", false);
			this.getView().getModel().setProperty("/Otext", false);
			this.getView().getModel().setProperty("/OTable", false);
			this.getView().getModel().setProperty("/KTable", false);
		}

		var oModel = this.getView().getModel();
		var dateData = this.getView().byId("DP10").getDateValue();
		var realDate = this.getView().byId("DP1").getDateValue("/REDATE");
		//var dateData = oModel.getProperty("/dateData");

		var sYear = dateData.getFullYear();
		var sMonth = "";
		sMonth = dateData.getMonth() + 1 >= 10 ? dateData.getMonth() + 1 : "0" + (dateData.getMonth() + 1);
		sMonth = String(sMonth);
		var dateValue = sYear + sMonth;

		console.log(dateValue);

		//var monthData = dateData.split(".")[1].trim() >= 10 ? dateData.split(".")[0] + dateData.split(".")[1].trim() : dateData.split(".")[0] + "0" + dateData.split(".")[1].trim();

		var stcoData = oModel.getProperty("/comboData");

		this.getOwnerComponent().rfcCall("ZB_INPUT_DISPLAY", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
			//RFC Import 데이터
			I_CUMON: dateValue, //해당 월
			I_MODE: "A", //모드
			I_EMPNO: "20201200010", //사원 번호
			I_STCOD: stcoData

		}).done(function(oResultData) { // RFC호출 완료
			oModel.setProperty("/tableData", oResultData.TAB1);
			console.log(oResultData.TAB1);
			//oResultData.TAB1[0].NOTE
		}).fail(function(sErrorMessage) { // 호출 실패
			MessageToast.show(sErrorMessage);
		}).then(function(oResultData) {
			oModel.setProperty("/tableRow", oResultData.TAB1.length);

			for (var i = 0; i < oResultData.TAB1.length; i++) {
				var realREDATE = oModel.getProperty("/tableData/" + i + "/REDATE");
				var realAPPDAT = oModel.getProperty("/tableData/" + i + "/APPDAT");
				var realRDATE = oModel.getProperty("/tableData/" + i + "/RDATE");
				var realACDAT = oModel.getProperty("/tableData/" + i + "/ACDAT");

				if (realREDATE === "0000-00-00") {
					oModel.setProperty("/tableData/" + i + "/REDATE", " ");
				}
				if (realAPPDAT === "0000-00-00") {
					oModel.setProperty("/tableData/" + i + "/APPDAT", " ");
				}
				if (realRDATE === "0000-00-00") {
					oModel.setProperty("/tableData/" + i + "/RDATE", " ");
				}
				if (realACDAT === "0000-00-00") {
					oModel.setProperty("/tableData/" + i + "/ACDAT", " ");
				}

				//date 초기값
				if (oResultData.TAB1[i].REDATE) {
					var oDate = new Date(oResultData.TAB1[i].REDATE);
					oModel.setProperty("/tableData/" + i + "/realDate", oDate);
				}

			}

			if (comboData === "A") {
				oModel.setProperty("/realvisi", true);
			} else {
				oModel.setProperty("/realvisi", false);

			}

		});

	},
      onGo:function(){
      	MessageToast.show("d");
      },
      
      
       rowSelection : function(oEvent){
	      	var allData = oEvent.mParameters.selectAll;
	      	var cancData = oEvent.mParameters.rowIndex;
	      	var oModel = this.getView().getModel();
	      	var tableArray = oModel.getProperty("/tableData");
	      	
	      	if(allData){
	      		for(var i=0 ; i < tableArray.length ; i++){
	      			if(!tableArray[i].checked){
	      				tableArray[i].checked = true;
	      			}
	      		}
	      	}else if(cancData === -1){
		  		for(var i=0 ; i < tableArray.length ; i++){
		      			if(tableArray[i].checked){
		      				tableArray[i].checked = false;
	      			}
	      		}
	      	
	      	}else{
	      		if(oEvent.getParameters("rowContextParameters").rowContext){
		      		var sPath = oEvent.getParameters("rowContextParameters").rowContext.sPath;
		      		
		      		if(oModel.getProperty(sPath + "/checked")){
			      		MessageToast.show(oModel.getProperty(sPath + "/checked"));
			      		oModel.setProperty(sPath + "/checked", false);
			      		//delete// data 
			      	}else{
			      		MessageToast.show(oModel.getProperty(sPath + "/checked"));
			      		oModel.setProperty(sPath + "/checked", true);
			      		//add data
		    		}	
	      		}
	      
      	}
      	
      	console.log(tableArray);
      	
      },
    	
    	//프로젝트 fragment
    	
    	
    
    	ProValueHelp: function(oEvent) {
		// var target = oEvent.oSource.oParent.sId;
		// // var targetData = target.replace("__table0-rows-row","").trim();
		// var targetData = target.replace("container-sampleApp---home--mainTableId-rows-row","").trim();

		var sPath = oEvent.getSource().getBindingContext().getPath();
		var targetData = sPath.substring(sPath.lastIndexOf("/") + 1);

		this.getView().getModel().setProperty("/target", targetData);

		var oView = this.getView();
		var that = this;
		this.getView().getModel().setProperty("/proInfo", []);

		if (!this.byId("ProDialog")) {
			Fragment.load({
				id: oView.getId(),
				name: "ExpenseManagement.view.expenseManagement.kyj.fragView3",
				controller: this
			}).then(function(oDialog) {
				oView.addDependent(oDialog);
				oDialog.open();
			});
		} else {
			this.byId("ProDialog").open();

		}
		that._proSearch2();
	},
	_proSearch2: function() {

		var oModel = this.getView().getModel();
		var proData = oModel.getProperty("/proData");
		// var nameSearchData = oModel.getProperty("/proSearch");

		// MessageToast.show(proData+"/"+nameSearchData);

		this.getOwnerComponent().rfcCall("ZB_SEARCH_PROJ", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
			//RFC Import 데이터
			I_PCODE: proData
		}).done(function(oResultData) { // RFC호출 완료
			console.log(oResultData.TAB1);
			oModel.setProperty("/proInfo", oResultData.TAB1);
		}).fail(function(sErrorMessage) { // 호출 실패
			alert(sErrorMessage);
		}).then(function() {
			// 여기다가 rfc 호출후 작업코딩
		});

	},

	onproSelection: function(oEvent) {
		var sPath = oEvent.mParameters.rowContext.sPath;

		var oModel = this.getView().getModel();
		var selectData = oModel.getProperty(sPath);
		var targetData = oModel.getProperty("/target");

		// if(oModel.getProperty("/tableData/" + targetData + "/PNAME")){
		// oModel.setProperty("/tableData/" + targetData + "/PNAME","");
		// oModel.setProperty("/tableData/" + targetData + "/PCODE", "");
		oModel.setProperty("/tableData/" + targetData + "/PNAME", selectData.PNAME);
		oModel.setProperty("/tableData/" + targetData + "/PCODE", selectData.PCODE);
		// }
		// else{
		// 	oModel.setProperty("/tableData/" + targetData + "/PNAME", selectData.PNAME);
		// 	oModel.setProperty("/tableData/" + targetData + "/PCODE", selectData.PCODE);
		// }
	},
	onproData: function() {
		var oModel = this.getView().getModel();
		// var targetData = oModel.getProperty("/target");
		// oModel.setProperty("/tableData/" + targetData + "/ProNum", "");
		// oModel.setProperty("/tableData/" + targetData + "/ProNum", "");
		this.byId("ProDialog").close();
	},

	// onproDialog : function(){
	// 	var oModel = this.getView().getModel();
	// 	this.byId("ProDialog").close();
	// },

	proSearchChange: function() {
		var ProSearchFiled = this.getView().getModel().getProperty("/proSearch");

		// build filter array
		var aFilter = [];

		if (ProSearchFiled) {
			aFilter.push(new Filter("PNAME", FilterOperator.Contains, ProSearchFiled));
		}

		// filter binding
		var oList = this.byId("ProDialog");
		var oBinding = oList.getBinding("rows");
		oBinding.filter(aFilter);
	},

	//계정코드 fragment

	CodeValueHelp: function(oEvent) {
		// var target = oEvent.oSource.oParent.sId;
		// // var targetData = target.replace("__table0-rows-row","").trim();
		// var targetData = target.replace("container-sampleApp---home--mainTableId-rows-row","").trim();

		var sPath = oEvent.getSource().getBindingContext().getPath();
		var targetData = sPath.substring(sPath.lastIndexOf("/") + 1);

		this.getView().getModel().setProperty("/target", targetData);

		var oView = this.getView();

		this.getView().getModel().setProperty("/eCodhc", []);
		var that = this;

		if (!this.byId("CodhcDialog")) {
			Fragment.load({
				id: oView.getId(),
				name: "ExpenseManagement.view.expenseManagement.kyj.fragView2",
				controller: this
			}).then(function(oDialog) {
				oView.addDependent(oDialog);
				oDialog.open();
				// that.getView().getModel().refresh();

			});
		} else {
			this.byId("CodhcDialog").open();
		}

		that._getSearchCode();
	},

	// get account
	_getSearchCode: function() {
		var oModel = this.getView().getModel();
		var CodeData = oModel.getProperty("/CODHC");
		this.getOwnerComponent().rfcCall("ZB_SEARCH_CODE", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
			//RFC Import 데이터
			I_CODHC: CodeData
		}).done(function(oResultData) { // RFC호출 완료
			oModel.setProperty("/eCodhc", oResultData.TAB1);
		}).fail(function(sErrorMessage) { // 호출 실패
			alert(sErrorMessage);
		}).then(function() {});
	},

	onCoData: function() {
		var oModel = this.getView().getModel();
		this.byId("CodhcDialog").close();
	},

	onCodeSelection: function(oEvent) {
		var sPath = oEvent.mParameters.rowContext.sPath;

		var oModel = this.getView().getModel();
		var selectData = oModel.getProperty(sPath);
		var targetData = oModel.getProperty("/target");

		// if(oModel.getProperty("/tableData/" + targetData + "/CODDN")){
		oModel.setProperty("/tableData/" + targetData + "/CODDN", selectData.CODDN);
		oModel.setProperty("/tableData/" + targetData + "/CODHC", selectData.CODHC);
		// }else{
		// 	oModel.setProperty("/tableData/" + targetData + "/CODDN", selectData.CODDN);
		// 	oModel.setProperty("/tableData/" + targetData + "/CODHC", selectData.CODHC);
		// }
	},
	//식대행추가
	onRowAdd2: function() {
		var oModel = this.getView().getModel();
		var tableData = oModel.getProperty("/info");
		var JPNUMData = oModel.getProperty("/JPNUMData");
		var HANGN = 0;

		if (tableData.length == 0) {
			HANGN = 1;
		} else {
			HANGN = tableData[tableData.length - 1].HANGN + 1;
		}

		// //행 추가
		tableData.push({
			JPNUM: JPNUMData,
			HANGN: HANGN,
			SIKSU: 0,
			EMPNO: "",
			ENAME: "",
			REMARK: ""
		});

		oModel.setProperty("/tableRow2", oModel.getProperty("/tableRow2") + 1);
	},

	onRowDel: function() {
		var oModel = this.getView().getModel();
		var tableData = oModel.getProperty("/info");
		var tableDataLeng = tableData.length;
		var cnt = 0;

		for (var i = tableData.length - 1; i >= 0; i--) {
			if (tableData[i].checked) {
				tableData[i].checked = false;
				tableData.splice(i, 1);
				oModel.refresh();
				cnt++;
			}
		}

		this.byId("mainTableId").removeSelectionInterval(0, tableDataLeng);

		oModel.setProperty("/tableRow2", parseInt(oModel.getProperty("/tableRow2")) - cnt);

		for (var i = 0; i < tableData.length; i++) {
			tableData[i].HANGN = i + 1;
		}
		oModel.refresh();

	},
	handleValueHelp: function(oEvent) {
		// var target = oEvent.oSource.oParent.sId;
		// // var targetData = target.replace("__table0-rows-row","").trim();
		// var targetData = target.replace("container-sampleApp---home--mainTableId-rows-row","").trim();

		var sPath = oEvent.getSource().getBindingContext().getPath();
		var targetData = sPath.substring(sPath.lastIndexOf("/") + 1);

		this.getView().getModel().setProperty("/target", targetData);

		var oView = this.getView();

		this.getView().getModel().setProperty("/fragInfo", []);

		if (!this.byId("helloDialog")) {
			Fragment.load({
				id: oView.getId(),
				name: "ExpenseManagement.view.expenseManagement.kyj.fragView",
				controller: this
			}).then(function(oDialog) {
				oView.addDependent(oDialog);
				oDialog.open();
			});
		} else {
			this.byId("helloDialog").open();
		}
	},

	//사원조회 rfc 함수
	onSearch: function() {

		var oModel = this.getView().getModel();
		var comboData = oModel.getProperty("/comboData");
		var nameSearchData = oModel.getProperty("/nameSearch");

		MessageToast.show(comboData + "/" + nameSearchData);

		this.getOwnerComponent().rfcCall("ZB_EMPLOYEESEARCH", { // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
			//RFC Import 데이터
			I_GCODE: comboData
		}).done(function(oResultData) { // RFC호출 완료
			console.log(oResultData.TAB1);
			oModel.setProperty("/fragInfo", oResultData.TAB1);
		}).fail(function(sErrorMessage) { // 호출 실패
			alert(sErrorMessage);
		}).then(function() {
			// 여기다가 rfc 호출후 작업코딩
		});

	},

	onMainTableSelect: function(oEvent) {
		var oEventData = oEvent.mParameters.rowIndices;
		var oModel = this.getView().getModel();

		if (oEvent.mParameters.selectAll) {
			for (var i = 0; i < oEventData.length; i++) {
				oModel.setProperty("/info/" + oEventData[i] + "/checked", true);
			}
		} else {
			if (oEventData.length > 1) {
				for (var i = 0; i < oEventData.length; i++) {
					oModel.setProperty("/info/" + oEventData[i] + "/checked", false);
				}
			} else {
				for (var i = 0; i < oEventData.length; i++) {
					if (oModel.getProperty("/info/" + oEventData[i] + "/checked")) {
						oModel.setProperty("/info/" + oEventData[i] + "/checked", false);
					} else {
						oModel.setProperty("/info/" + oEventData[i] + "/checked", true);
					}
				}

			}
		}

	},

	onRowSelection: function(oEvent) {
		var sPath = oEvent.mParameters.rowContext.sPath;

		var oModel = this.getView().getModel();
		var selectData = oModel.getProperty(sPath);
		var targetData = oModel.getProperty("/target");

		oModel.setProperty("/info/" + targetData + "/EMPNO", selectData.EMPNO);
		oModel.setProperty("/info/" + targetData + "/ENAME", selectData.ENAME);

	},

	onCloseDialog: function() {
		var oModel = this.getView().getModel();
		var targetData = oModel.getProperty("/target");
		oModel.setProperty("/info/" + targetData + "/nameNum", "");
		oModel.setProperty("/info/" + targetData + "/name", "");
		this.byId("helloDialog").close();
	},

	onAddData: function() {
		var oModel = this.getView().getModel();
		this.byId("helloDialog").close();
	},
	// 프레그먼트 서치필드 라이브체인지 이벤트
	onSearchChange: function() {
		var SearchFiled = this.getView().getModel().getProperty("/nameSearch");

		// build filter array
		var aFilter = [];

		if (SearchFiled) {
			aFilter.push(new Filter("ENAME", FilterOperator.Contains, SearchFiled));
		}

		// filter binding
		var oList = this.byId("fragTable");
		var oBinding = oList.getBinding("rows");
		oBinding.filter(aFilter);
	},
    
    
		onsikSave : function(){
			var oModel = this.getView().getModel();
			var tableData = oModel.getProperty("/info");
			var JPNUM = oModel.getProperty("/JPNUMData");

			this.getOwnerComponent().rfcCall("ZB_INPUT_APPRO", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
				//RFC Import 데이터
				I_MODE : "D",
				I_JPNUM : JPNUM,
				TAB2: tableData
			 }).done(function(oResultData){   // RFC호출 완료
				for(var i=0 ; i < oResultData.TAB2.length ; i++){
					oResultData.TAB2[i].HANGN = parseInt(oResultData.TAB2[i].HANGN);
					oResultData.TAB2[i].SIKSU = parseInt(oResultData.TAB2[i].SIKSU);
				}
				oModel.setProperty("/info", oResultData.TAB2);
			 }).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			 }).then(function(){
				oModel.refresh();
			 });



		},
			handleChange: function(oEvent) {
		var oModel = this.getView().getModel(), 
			sPath = oEvent.getSource().getBindingContext().getPath(),
			oSelectData = oModel.getProperty(sPath),			//선택한 라인 경로
			sSelectDate = oEvent.getSource().getValue();		//datePicker에서 선택한 날짜 가져오기
		
		oSelectData.REDATE = sSelectDate;						//선택한 날짜 저장
	},


 



   });
});