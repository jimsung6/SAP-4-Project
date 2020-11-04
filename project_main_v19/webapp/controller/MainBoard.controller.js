sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
	"use strict";

	return Controller.extend("ExpenseManagement.controller.MainBoard", {

		/**********************************************************************************
		 * 함수 내용 : 초기 작업 처리
		 * 작성자 : 김성진
		 **********************************************************************************/
		onInit : function(){

			this.getView().setModel(new JSONModel({
				statusListCard : false,
				stackedBar : false,
				calendar : false,

				donut : false,
				stackedColumn : false,

				donut2 : false,
				stackedColumn2 : false,

				depExpensesCard : false,
				depExpTransCard : false,

			}),"authority");

			this.getView().setModel(new JSONModel({
				
				paymentCard : []

			}));

			this.getView().getModel().setProperty("/paymentComboData", "A")

			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this._oRouter.attachRouteMatched(this.onAfterRendering, this);

		},
		
		/**********************************************************************************
		 * 함수 내용 : 로그인 정보 확인 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
		checkLog : function(){
			//log 정보 확인
			var logData = this.getOwnerComponent().getCookiy("EMPNO");
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			if(!logData){
				oRouter.navTo("login"); 
			}

		},

		onBeforeRendering : function(){
			// 카드 이벤트 연결 함수 콜
			var oCardModel = this.getView().getModel("cardManifests");
			this.cardEventConnect(oCardModel);
		},

		/**********************************************************************************
		 * 함수 내용 : 뷰가 그려지기 전 작업 처리
		 * 작성자 : 김성진
		 **********************************************************************************/
		onAfterRendering : function(event){

			var oCardModel = this.getView().getModel("cardManifests");

			//로그인 화면으로 나갈때 세팅없이 리턴
			if(event.mParameters.name === "login"){
				return 0;
			}
			

			//로그인 정보확인 함수 콜
			this.checkLog();
			//초기 카드 세팅 함수 콜
			this.onCardSetting(oCardModel);

			// 전표 현황 데이터 모델링 함수 콜
			this.callDataStatusList(oCardModel);
			// 관리부서 사용경비 모델링 함수 콜
			this.callDataDepExpenses(oCardModel);
			// 관리부서 사용경비 추이 모델링 함수 콜
			this.callDataDepExpTrans(oCardModel);
			// 사용자 사용경비 현황 모델링 함수 콜
			this.callDataStackedBar(oCardModel);
			// 사용자 근태 현황 모델링 함수 콜
			this.callDataCalendar(oCardModel);
			// 부서 사용경비 현황 모델링 함수 콜
			this.callDataDonut(oCardModel);
			// 프로젝트 사용경비 현황 모델링 함수 콜
			this.callDataDonut2(oCardModel);
			// 부서원 사용경비 현황 모델링 함수 콜
			this.callDataStackedColumn(oCardModel);
			// 프로젝트 팀원 사용경비 현황 모델링 함수 콜
			this.callDataStackedColumn2(oCardModel);

		},

		/**********************************************************************************
		 * 함수 내용 : 초기 카트 세팅
		 * 작성자 : 김성진, 최동현
		 **********************************************************************************/
		onCardSetting : function(oCardModel){
			//권한 정보
				var AUCODE = this.getOwnerComponent().getCookiy("AUCODE");
				var cardModel = this.getView().getModel("authority");

				var oModel = this.getView().getModel("authority");
				var ExpensesCard = this.getView().byId("depExpensesCard");

				oModel.setProperty("/ExpTransCardHandle", false);
				var depExpensesData = oCardModel.getProperty("/depExpenses");
				ExpensesCard.setManifest(depExpensesData);
				var zvEMPNO = this.getOwnerComponent().getCookiy("EMPNO");

			//권한 정보에 따른 카드 세팅
			switch (AUCODE) {
				case "A1":
					cardModel.setProperty("/statusListCard", true);
					cardModel.setProperty("/stackedBar", true);
					cardModel.setProperty("/calendar", true);

					cardModel.setProperty("/donut", true);
					cardModel.setProperty("/stackedColumn", true);

					cardModel.setProperty("/donut2", false);
					cardModel.setProperty("/stackedColumn2", false);

					cardModel.setProperty("/depExpensesCard", true);
					cardModel.setProperty("/depExpTransCard", true);

					break;

				case "A0":
					cardModel.setProperty("/statusListCard", true);
					cardModel.setProperty("/stackedBar", true);
					cardModel.setProperty("/calendar", true);

					cardModel.setProperty("/donut", true);
					cardModel.setProperty("/stackedColumn", true);

					cardModel.setProperty("/donut2", false);
					cardModel.setProperty("/stackedColumn2", false);

					cardModel.setProperty("/depExpensesCard", true);
					cardModel.setProperty("/depExpTransCard", true);

					break;

				case "J1":
					cardModel.setProperty("/statusListCard", true);
					cardModel.setProperty("/stackedBar", true);
					cardModel.setProperty("/calendar", true);

					cardModel.setProperty("/donut", true);
					cardModel.setProperty("/stackedColumn", true);

					cardModel.setProperty("/donut2", true);
					cardModel.setProperty("/stackedColumn2", true);

					cardModel.setProperty("/depExpensesCard", false);
					cardModel.setProperty("/depExpTransCard", false);
					break;

				case "J0":
					cardModel.setProperty("/statusListCard", true);
					cardModel.setProperty("/stackedBar", true);
					cardModel.setProperty("/calendar", true);

					cardModel.setProperty("/donut", true);
					cardModel.setProperty("/stackedColumn", true);

					cardModel.setProperty("/donut2", false);
					cardModel.setProperty("/stackedColumn2", false);

					cardModel.setProperty("/depExpensesCard", false);
					cardModel.setProperty("/depExpTransCard", false);
					break;

				default:

					cardModel.setProperty("/statusListCard", false);
					cardModel.setProperty("/stackedBar", false);
					cardModel.setProperty("/calendar", false);

					cardModel.setProperty("/donut", false);
					cardModel.setProperty("/stackedColumn", false);

					cardModel.setProperty("/donut2", false);
					cardModel.setProperty("/stackedColumn2", false);

					cardModel.setProperty("/depExpensesCard", false);
					cardModel.setProperty("/depExpTransCard", false);
					break;
			}
			//프로젝트 권한에 따른 카드세팅
			this.getOwnerComponent().rfcCall("ZB_GET_PMDECISION", {	// 사용자가 최근 한달 맡은 프로젝트 유/무 판단하는 rfc(ZB_GET_PMDECISION)를 사용
				//RFC Import 데이터
				I_EMPNO: zvEMPNO
			}).done(function(oResultData){	// RFC호출 완료
				switch(oResultData.E_RETURN) {
					//받아온 E_RETURN이 "T"이면 카드 세팅 O
					case "T":
						cardModel.setProperty("/donut2", true);
						cardModel.setProperty("/stackedColumn2", true);
						break;
					//받아온 E_RETURN이 "F"이면 카드 세팅 X
					case "F":
						cardModel.setProperty("/donut2", false);
						cardModel.setProperty("/stackedColumn2", false);
					break; 
				}
			}).fail(function(sErrorMessage){  // 호출 실패
				alert(sErrorMessage);
			});
			

		},

		/**********************************************************************************
		 * 함수 내용 : 전표 현황 데이터 모델링 작업														
		 * 작성자 : 김성진																   
		 **********************************************************************************/
		callDataStatusList : function(oCardModel){
			// 전표 현황 카드 객체
			var oModel = this.getView().getModel();
			var that = this;
			var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
			//현재 년월 구하기
			var toDay = new Date();
			var yyyy = toDay.getFullYear();
			var mm = toDay.getMonth()+1 >= 10 ? toDay.getMonth()+1 : "0"+(toDay.getMonth()+1);
			var CUMON = yyyy.toString()+mm.toString();
			oModel.setProperty("/toMonth", toDay.getMonth()+1);

			// 전표 건수를 저장할 숫자타입 변수
			var iReqList = 0;	//요청전표 건수
			var iPayList = 0; //미결전표 건수

			var E_SAVENUM = 0;  //임시저장 건수

			var E_PERREQ = 0;	//승인 요청 건수
			var E_CANCPER = 0;	//승인 요청 반려 건수
			var E_REQLSEND = 0; //승인 요청 미결 건수
			var E_REQCOM = 0;   //승인 완료 건수

			var E_CANCPAY = 0;  //지급 반려 건수
			var E_PAYLSEND = 0; //지급 미결 건수
			var E_PAYCOM = 0;   //지급 완료 건수

			var E_DBUDREQ = 0;   //부서 예산 증액 요청 건수
			var E_DCANBUD = 0;   //부서 예산 증액 요청 반려 건수
			var E_DBUDLSEND = 0;   //부서 예산 증액 요청 미결 건수
			var E_DBUDCOM = 0;   //부서 예산 증액 요청 완료 건수

			var E_PBUDREQ = 0;   //프로젝트 예산 증액 요청 건수
			var E_PCANBUD = 0;   //프로젝트 예산 증액 요청 반려 건수
			var E_PBUDLSEND = 0;   //프로젝트 예산 증액 요청 미결 건수
			var E_PBUDCOM = 0;   //프로젝트 예산 증액 요청 완료 건수

			// 전표 현황 데이터 배열
			var statusListData = [];

			// 전표 현황 카드의 content 안에 들어갈 데이터 호출 RFC
			this.getOwnerComponent().rfcCall("ZB_GET_SLIP_AB", {	//ZB_GET_SLIP_AB rfc사용
				//RFC Import 데이터
				I_EMPNO : EMPNOData,
				I_CUMON : CUMON
			}).done(function(oResultData){	// RFC호출 완료
				console.log(oResultData);
				E_SAVENUM = parseInt(oResultData.E_SAVENUM);

				E_PERREQ = parseInt(oResultData.E_PERREQ);
				E_CANCPER = parseInt(oResultData.E_CANCPER);
				E_REQLSEND = parseInt(oResultData.E_REQLSEND);
				E_REQCOM = parseInt(oResultData.E_REQCOM);

				E_CANCPAY = parseInt(oResultData.E_CANCPAY);
				E_PAYLSEND = parseInt(oResultData.E_PAYLSEND);
				E_PAYCOM = parseInt(oResultData.E_PAYCOM);

				E_DBUDREQ = parseInt(oResultData.E_DBUDREQ);
				E_DCANBUD = parseInt(oResultData.E_DCANBUD);
				E_DBUDLSEND = parseInt(oResultData.E_DBUDLSEND);
				E_DBUDCOM = parseInt(oResultData.E_DBUDCOM);

				E_PBUDREQ = parseInt(oResultData.E_PBUDREQ);
				E_PCANBUD = parseInt(oResultData.E_PCANBUD);
				E_PBUDLSEND = parseInt(oResultData.E_PBUDLSEND);
				E_PBUDCOM = parseInt(oResultData.E_PBUDCOM);
				
				// 건수가 있으면 전표 현황 데이터 배열에 push
				//요청자가 보임
				var reqConut = 0;
				var resCount = 0;
				if(E_SAVENUM && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "임시저장",
						icon : "sap-icon://activity-items",
						number : E_SAVENUM,
						State: "Success"
					 })
				}
				//요청자가 보임
				if(E_PERREQ && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "승인요청",
						icon : "sap-icon://activity-items",
						number : E_PERREQ,
						State: "Success"
					 })
				}
				//요청자가 보임
				if(E_REQCOM && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "승인요청 완료",
						icon : "sap-icon://activity-items",
						number : E_REQCOM,
						State: "Success"
					})
				}
				//요청자가 보임
				if(E_PAYCOM && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "지급 완료",
						icon : "sap-icon://activity-items",
						number : E_PAYCOM,
						State: "Success"
					})
				}

				// 승인자만 보임
				if(E_REQLSEND && oModel.getProperty("/paymentComboData") === "B"){
					resCount++;
					statusListData.push({
						name : "승인요청 미결",
						icon : "sap-icon://activity-items",
						number : E_REQLSEND,
						State: "Warning"
					})
				}
				//지급자만 보임
				if(E_PAYLSEND && oModel.getProperty("/paymentComboData") === "B"){
					resCount++;
					statusListData.push({
						name : "지급 미결",
						icon : "sap-icon://activity-items",
						number : E_PAYLSEND,
						State: "Warning"
					})
				}

				// 승인자만 보임
				if(E_DBUDREQ && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "부서 예산 증액 요청",
						icon : "sap-icon://activity-items",
						number : E_DBUDREQ,
						State: "Success"
					 })
				}

				// 지급자만 보임
				if(E_DBUDLSEND && oModel.getProperty("/paymentComboData") === "B"){
					resCount++;
					statusListData.push({
						name : "부서 예산 증액 요청 미결",
						icon : "sap-icon://activity-items",
						number : E_DBUDLSEND,
						State: "Warning"
					 })
				}
				// 승인자만 보임
				if(E_DBUDCOM && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "부서 예산 증액 요청 완료",
						icon : "sap-icon://activity-items",
						number : E_DBUDCOM,
						State: "Success"
					 })
				}

				// 승인자만 보임
				if(E_PBUDREQ && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "프로젝트 예산 증액 요청",
						icon : "sap-icon://activity-items",
						number : E_PBUDREQ,
						State: "Success"
					})
				}
				// 지급자만 보임
				if(E_PBUDLSEND && oModel.getProperty("/paymentComboData") === "B"){
					resCount++;
					statusListData.push({
						name : "프로젝트 예산 증액 요청 미결",
						icon : "sap-icon://activity-items",
						number : E_PBUDLSEND,
						State: "Warning"
					})
				}
				// 승인자만 보임
				if(E_PBUDCOM && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "프로젝트 예산 증액 요청 완료",
						icon : "sap-icon://activity-items",
						number : E_PBUDCOM,
						State: "Success"
					})
				}

				//반려~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
				//요청자가 보임
				if(E_CANCPAY && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "지급 반려",
						icon : "sap-icon://activity-items",
						number : E_CANCPAY,
						State: "Error"
					 })
				}
				//요청자가 보임
				if(E_CANCPER && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "승인요청 반려",
						icon : "sap-icon://activity-items",
						number : E_CANCPER,
						State: "Error"
					})
				}
				// 승인자만 보임
				if(E_DCANBUD && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "부서 예산 증액 요청 반려",
						icon : "sap-icon://activity-items",
						number : E_DCANBUD,
						State: "Error"
					})
				}
				// 승인자만 보임
				if(E_PCANBUD && oModel.getProperty("/paymentComboData") === "A"){
					reqConut++;
					statusListData.push({
						name : "프로젝트 예산 증액 요청 반려",
						icon : "sap-icon://activity-items",
						number : E_PCANBUD,
						State: "Error"
					})
				}

				if(oModel.getProperty("/paymentComboData") === "A"){
					if(reqConut > 8){
						that.getView().byId("comboHeight").setHeight("30px");
					}else if(reqConut > 5){
						that.getView().byId("comboHeight").setHeight("40px");
					}else{
						that.getView().byId("comboHeight").setHeight("50px");
					}

				}else{
					if(resCount > 8){
						that.getView().byId("comboHeight").setHeight("30px");
					}else if(resCount > 5){
						that.getView().byId("comboHeight").setHeight("40px");
					}else{
						that.getView().byId("comboHeight").setHeight("50px");
					}
				}

				oModel.setProperty("/comboHeight", iReqList);

				//요청전표 건수 계산
				iReqList = E_PERREQ + E_CANCPER + E_REQCOM + E_CANCPAY + E_PAYCOM + E_DBUDREQ + E_DCANBUD + E_DBUDCOM + E_PBUDREQ + E_PCANBUD + E_PBUDCOM;
				iPayList = E_REQLSEND + E_PAYLSEND + E_DBUDLSEND + E_PBUDLSEND;
				// 전표 건수 data set (총 건수, 요청전표 건수, 미결전표 건수) 순서

				oModel.setProperty("/sumList", iReqList+iPayList);
				oModel.setProperty("/iReqList", iReqList);
				oModel.setProperty("/iPayList", iPayList);


				// 전표현황 Content Data Set
				oModel.setProperty("/paymentCard", statusListData);
				oModel.refresh();

			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			});
		},

		/**********************************************************************************
		 * 함수 내용 : 관리부서 및 프로젝트 사용 경비 모델링 작업
		 * 작성자 : 김성진
		 **********************************************************************************/
		callDataDepExpenses : function(oCardModel){
			// 관리부서 및 프로젝트 사용경비 카드 객체
			var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
			var AUCODE = this.getOwnerComponent().getCookiy("AUCODE");
			var oCard = this.getView().byId("depExpensesCard");
			// 관리부서 및 프로젝트 사용경비 카드의 content 안에 들어갈 데이터 RFC
			var DatamDepExpData = [];
			var DatamProjExpData = [];

			//var yesterday = (function(){this.setMonth(this.getMonth()-1); return this}).call(new Date);

			var toDay = (function(){this.setMonth(this.getMonth()-1); return this}).call(new Date);

			var yeardata = toDay.getFullYear();
			var monthdata = toDay.getMonth()+1 >= 10 ? toDay.getMonth()+1 : "0"+(toDay.getMonth()+1);
			

			this.getOwnerComponent().rfcCall("ZB_GET_MANBUDGET_AB", {  //ZB_GET_MANBUDGET_AB rfc사용
				//RFC Import 데이터
				I_EMPNO : EMPNOData,
				I_RDATE : yeardata.toString() + monthdata.toString(),
				I_AUCODE : AUCODE
			}).done(function(oResultData){	// RFC호출 완료
				console.log(oResultData);
				var resultData = oResultData.TAB1
				// RFC에서 들고온 테이블 데이터 데이터 꺼내기
				for(var i=0 ; i < resultData.length ; i++){
					// GCODE 의 데이터가 존재하면 부서의 데이터 기준으로 DatamDepExpData 배열에 Data Push
					if(resultData[i].PCODE === "Z00"){
						DatamDepExpData.push({
							Gcode : resultData[i].GCODE,
							Name : resultData[i].GNAME,
							Highlight : "Success",
							budget : resultData[i].DEPPR,
							expenses : resultData[i].PROPR,
							InitBudget : 1818,
							ChartColor : "Good"
						})
					}
					// PCODE 의 데이터가 존재하면 프로젝트의 데이터 기준으로 DatamProjExpData 배열에 Data Push
					if(resultData[i].PCODE !== "Z00"){
						DatamProjExpData.push({
							Pcode : resultData[i].PCODE,
							Name : resultData[i].PNAME,
							Highlight : "Success",
							budget : resultData[i].PROBUD,
							expenses : resultData[i].PROPR,
							InitBudget : 1818,
							ChartColor : "Neutral"
						})
					}
				}

				// 관리 부서 사용경비 data set
				oCardModel.setProperty("/depExpenses/sap.card/content/data/json", DatamDepExpData);
				console.log(DatamProjExpData);
				// 관리 프로젝트 사용경비 data set
				oCardModel.setProperty("/porjExpenses/sap.card/content/data/json", DatamProjExpData);
				// 관리 프로젝트 사용경비 제목
				oCardModel.setProperty("/depExpenses/sap.card/header/title", monthdata+"월 부서 사용 경비");
				oCardModel.setProperty("/porjExpenses/sap.card/header/title", monthdata+"월 프로젝트 사용 경비");

				oCardModel.setProperty("/depExpenses/sap.card/content/maxItems", DatamDepExpData.length >= 5 ? DatamDepExpData.length : 5);
				oCardModel.setProperty("/porjExpenses/sap.card/content/maxItems", DatamProjExpData.length >= 5 ? DatamProjExpData.length : 5);	

				// 관리부서 및 프로젝트 사용경비 컴포넌트 새로고침
				var oModelData = oCardModel.getProperty("/depExpenses");
				if (oCard.getManifest()) {
					oCard.refresh();
				} else {
					oCard.setManifest(oModelData);
				}

			}).fail(function(sErrorMessage){// 호출 실패
				MessageToast.show(sErrorMessage);
			});		

		},

		/**********************************************************************************
		 * 함수 내용 : 관리부서 및 프로젝트 사용경비 추이 모델링 작업
		 * 작성자 : 김성진
		 **********************************************************************************/
		callDataDepExpTrans : function(oCardModel){
			var EMPNOData = this.getOwnerComponent().getCookiy("EMPNO");
			var AUCODE = this.getOwnerComponent().getCookiy("AUCODE");
			
			var STARTDay = (function(){this.setMonth(this.getMonth()-6); return this}).call(new Date);
			var ENDDay = (function(){this.setMonth(this.getMonth()-1); return this}).call(new Date);

			var startyyyy = STARTDay.getFullYear();
			var startmm = STARTDay.getMonth()+1 >= 10 ? STARTDay.getMonth()+1 : "0"+(STARTDay.getMonth()+1)

			var ENDyyyy = ENDDay.getFullYear();
			var ENDmm = ENDDay.getMonth()+1 >= 10 ? ENDDay.getMonth()+1 : "0"+(ENDDay.getMonth()+1)

			var STARTDATEData = startyyyy.toString() + startmm.toString();
			var ENDDATEData = ENDyyyy.toString() + ENDmm.toString();
			// 차트 월 기간
			var intervalDate = 5

			var oCard = this.getView().byId("depExpTransCard");

			// 추이 데이터 넣을 배열
			var listDepData = [];
			var listProjData = [];
			var measuresDepData = [];
			var measuresProjData = [];

			console.log(STARTDATEData);
			console.log(ENDDATEData);

			this.getOwnerComponent().rfcCall("ZB_GET_EXPENSETRANS_AB", {	// ZB_GET_EXPENSETRANS_AB RFC 호출 
				//RFC Import 데이터
				I_EMPNO : EMPNOData,	//사원 번호
				I_STARTDATE : STARTDATEData,	//전 날짜
				I_ENDDATE : ENDDATEData,	//끝 날짜
				I_AUCODE : AUCODE
			}).done(function(oResultData){	// RFC호출 완료
			//	callDataDepExpTransData = oResultData.TAB1
				console.log(oResultData);

				//관리 부서 및 프로젝트 사용경비 추이 데이터 핸들링
				//사용경비 데이터 세팅
				for(var i=intervalDate-1 ; i>=0 ; i--){
					var pushDepData = {
						Month : ENDDATEData-i
					}

					var pushProjData = {
						Month : ENDDATEData-i
					}
					for(var j=0 ; j<oResultData.TAB1.length ; j++){
						if(parseInt(oResultData.TAB1[j].CUMON) === ENDDATEData-i){
							if(oResultData.TAB1[j].PCODE === "Z00"){
								pushDepData[oResultData.TAB1[j].GNAME] = oResultData.TAB1[j].PROPR;
							}else{
								pushProjData[oResultData.TAB1[j].PNAME] = oResultData.TAB1[j].PROPR;
							}
						}else{
							if(oResultData.TAB1[j].PCODE === "Z00"){
								pushDepData[oResultData.TAB1[j].GNAME] = 0;
							}else{
								pushProjData[oResultData.TAB1[j].PNAME] = 0;
							}
						}
					}
					listDepData.push(pushDepData);
					listProjData.push(pushProjData);
				}
				//중복 체크를 위한 데이터 세팅
				var dataArray = [];

				for( var i=0 ; i < oResultData.TAB1.length ; i++){
					// //중복 부서 중복 체크
					var ckData = true;
					for(var j=0 ; j<dataArray.length ; j++){
						if( dataArray[j] === oResultData.TAB1[i].PCODE){
							ckData = false;
						}
					}
					if(ckData){
						if(oResultData.TAB1[i].PCODE === "Z00"){
							measuresDepData.push({
								label : oResultData.TAB1[i].GNAME,
								value : "{"+ oResultData.TAB1[i].GNAME +"}"
							});	
							dataArray.push(oResultData.TAB1[i].GCODE);
						}else{
							measuresProjData.push({
								label : oResultData.TAB1[i].PNAME,
								value : "{"+ oResultData.TAB1[i].PNAME +"}"
							});	
							dataArray.push(oResultData.TAB1[i].PCODE);
						}	
					}
	
				}

				//관리 부서 및 프로젝트 경비사용 추이
				console.log(listProjData);
				oCardModel.setProperty("/depExpTrans/sap.card/content/measures", measuresDepData);
				oCardModel.setProperty("/depExpTrans/sap.card/content/data/json/list", listDepData);

				oCardModel.setProperty("/projExpTrans/sap.card/content/measures", measuresProjData);
				oCardModel.setProperty("/projExpTrans/sap.card/content/data/json/list", listProjData);

				// 관리부서 및 프로젝트 사용경비 컴포넌트 새로고침
				var oModelData = oCardModel.getProperty("/depExpTrans");
				if (oCard.getManifest()) {
					oCard.refresh();
				} else {
					oCard.setManifest(oModelData);
				}
				
				//oResultData.TAB1[0]..NOTE
			}).fail(function(sErrorMessage){// 호출 실패
				MessageToast.show(sErrorMessage);
			});

		},

		/**********************************************************************************
		 * 사용자 사용경비 현황  모델링 작업
		 * 작성자 : 최동현
		 **********************************************************************************/
		callDataStackedBar : function(oCardModel){   // 사용경비현황 카드의 content 안에 들어갈 데이터 (RFC로 대체)
			var oCardModel = this.getView().getModel("cardManifests");
			var oCard = this.getView().byId("stackedBar");
			var ListObj = {"Month": ""};
			var ListArr = [];
			var MeasureArr = [];
			var ProprSum = 0;
			var Month = new Date().getMonth();
			var   ZvMonth = "";
			var zvEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			this.getOwnerComponent().rfcCall("ZB_GET_MYCOST_AB", {   // 사용자 사용경비 데이터 호출 rfc(ZB_GET_MYCOST_AB)를 사용
			//RFC Import 데이터
			I_EMPNO: zvEMPNO
			}).done(function(oResultData){   // RFC호출 완료
			for(var i=0; i<oResultData.T_TAB3.length; i++){
				MeasureArr.push({
					"label": oResultData.T_TAB3[i].CODDN,
					"value": "{"+oResultData.T_TAB3[i].CODHC+"}"
				});
			}
			MeasureArr.push({
					"label": "기타",
					"value": "{기타}"
				});
				
			for(var i=0; i<oResultData.T_TAB1.length; i++){
				ListObj[oResultData.T_TAB1[i].CODHC] = oResultData.T_TAB1[i].PROPR;
				if(i==3){
					break;
					}
			}
			for(var i=4; i<oResultData.T_TAB1.length; i++){
				ProprSum = ProprSum + oResultData.T_TAB1[i].PROPR;
			}
			ListObj["기타"] = ProprSum;
			ZvMonth = Month >= 10 ? Month + "월" : "0" + Month + "월";
			ListObj["Month"] = ZvMonth;
			ListArr.push(ListObj);
			ListObj = {"Month": ""};
			ProprSum = 0;
			Month = Month - 1;
			
			for(var i=0; i<oResultData.T_TAB2.length; i++){
				ListObj[oResultData.T_TAB2[i].CODHC] = oResultData.T_TAB2[i].PROPR;
				if(i==3){
					break;
					}
			}
			for(var i=4; i<oResultData.T_TAB2.length; i++){
				ProprSum = ProprSum + oResultData.T_TAB2[i].PROPR;
			}
			ListObj["기타"] = ProprSum;
			ZvMonth = Month >= 10 ? Month + "월" : "0" + Month + "월";
			ListObj["Month"] = ZvMonth;
			ListArr.push(ListObj);
			
			oCardModel.setProperty("/stackedBar/sap.card/content/data/json/list", ListArr);
			oCardModel.setProperty("/stackedBar/sap.card/content/measures", MeasureArr);
			oCard.refresh(); 
			}).fail(function(sErrorMessage){  // 호출 실패
			alert(sErrorMessage);
			});

		},
		
		/**********************************************************************************
		 * 사용자 근태 현황  모델링 작업
		 * 작성자 : 최동현
		 **********************************************************************************/
		callDataCalendar : function(oCardModel){   // 근태 현황 카드의 content 안에 들어갈 데이터 (RFC로 대체)
			var oCardModel = this.getView().getModel("cardManifests");
			var oCard = this.getView().byId("calendar");
			var oType = "";
			var legendItemArr = [];
			var legendItemArr2 = [];
			var specialDateArr = [];
			var zvEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			this.getOwnerComponent().rfcCall("ZB_GET_TOWORK_AA", {   // 근태 현황 데이터 호출 rfc(ZB_GET_TOWORK_AA)를 사용
			//RFC Import 데이터
			I_EMPNO: zvEMPNO
			}).done(function(oResultData){   // RFC호출 완료
			for(var i=0; i<oResultData.T_TAB2.length; i++){
				if(i<9){
					legendItemArr.push({
						"category": "calendar",
						"text": oResultData.T_TAB2[i].PNAME,
						"type": "Type0"+(i+1)                     
						});   
					legendItemArr2.push({
						"pcode": oResultData.T_TAB2[i].PCODE,
						"type": "Type0"+(i+1)                     
						});      
				}else{
					legendItemArr.push({
					"category": "calendar",
					"text": oResultData.T_TAB2[i].PNAME,
					"type": "Type"+(i+1)                     
						});   
					legendItemArr2.push({
						"pcode": oResultData.T_TAB2[i].PCODE,
						"type": "Type"+(i+1)                     
						});   
				}
			}
			for(var i=0; i<oResultData.T_TAB1.length; i++){
				if(i==0){
					for(var j=0; j<legendItemArr2.length; j++){
					if(oResultData.T_TAB1[i].PCODE == legendItemArr2[j].pcode){
						oType = legendItemArr2[j].type;
					}
					}
					specialDateArr.push({
					"start": oResultData.T_TAB1[i].SPECIALDATE,
					"end": oResultData.T_TAB1[i].SPECIALDATE,
					"type": oType
					});   
				}else{
					if(oResultData.T_TAB1[i].SPECIALDATE != oResultData.T_TAB1[i-1].SPECIALDATE){
					for(var j=0; j<legendItemArr2.length; j++){
					if(oResultData.T_TAB1[i].PCODE == legendItemArr2[j].pcode){
						oType = legendItemArr2[j].type;
						break;
					}
					}
					specialDateArr.push({
						"start": oResultData.T_TAB1[i].SPECIALDATE,
						"end": oResultData.T_TAB1[i].SPECIALDATE,
						"type": oType
					});   
				}   
				}
			}
			oCardModel.setProperty("/calendar/sap.card/data/json/specialDate", specialDateArr);
			oCardModel.setProperty("/calendar/sap.card/data/json/legendItem", legendItemArr);
			oCard.refresh(); 
			}).fail(function(sErrorMessage){  // 호출 실패
			alert(sErrorMessage);
			});

		},

		/**********************************************************************************
		 * 부서 사용경비 현황 모델링 작업
		 * 작성자 : 최동현
		 **********************************************************************************/
		callDataDonut : function(oCardModel){  // 부서 사용경비 현황 카드의 content 안에 들어갈 데이터 (RFC로 대체)
			var oCardModel = this.getView().getModel("cardManifests");
			var oCard = this.getView().byId("donut");
			var oTeamArray = [];
			var oDEPPR = 0;
			var oRemainder = 0;
			var zvGCODE = this.getOwnerComponent().getCookiy("GCODE");
			this.getOwnerComponent().rfcCall("ZB_GET_BUDGETTM_AB", {   // 부서 사용경비 현황 데이터 호출 rfc(ZB_GET_BUDGETTM_AB)를 사용
			//RFC Import 데이터
			I_GCODE: zvGCODE
			}).done(function(oResultData){   // RFC호출 완료
			if(oResultData.T_TAB1.length<5){
				for(var i=0; i<oResultData.T_TAB1.length; i++){
				oTeamArray.push({
						"measureName": oResultData.T_TAB1[i].CODDN,
						"value": oResultData.T_TAB1[i].PROPR
						});
						oDEPPR =  oDEPPR + oResultData.T_TAB1[i].PROPR;
				}
				oRemainder = oResultData.E_DEPPR - oDEPPR;
				oTeamArray.push({
						"measureName": "여유 예산",
						"value": oRemainder
						});
				oCardModel.setProperty("/donut/sap.card/content/data/json/measures", oTeamArray);      
			}
			else{
				for(var i=0; i<3; i++){
					oTeamArray.push({
							"measureName": oResultData.T_TAB1[i].CODDN,
							"value": oResultData.T_TAB1[i].PROPR
						});
					}
				for(var i=3; i<oResultData.T_TAB1.length; i++){
					oDEPPR = oDEPPR + oResultData.T_TAB1[i].PROPR;
				}
				oTeamArray.push({
							"measureName": "기타",
							"value": oDEPPR
						});
				oRemainder = oResultData.E_DEPPR - oDEPPR - oResultData.T_TAB1[0] - oResultData.T_TAB1[1] - oResultData.T_TAB1[2];
				oTeamArray.push({
						"measureName": "여유 예산",
						"value": oRemainder
						});
				oCardModel.setProperty("/donut/sap.card/content/data/json/measures", oTeamArray);         
			}
			oCard.refresh(); 
			}).fail(function(sErrorMessage){  // 호출 실패
			alert(sErrorMessage);
			});
		},

		/**********************************************************************************
		 * 프로젝트 사용경비 현황 모델링 작업
		 * 작성자 : 최동현
		 **********************************************************************************/
		callDataDonut2 : function(oCardModel){  // 프로젝트 사용경비 현황 카드의 content 안에 들어갈 데이터 (RFC로 대체)
			var oCardModel = this.getView().getModel("cardManifests");
			var oCard = this.getView().byId("donut2");
			var oTeamArray = [];
			var oDEPPR = 0;
			var oRemainder = 0;
			var zvEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			this.getOwnerComponent().rfcCall("ZB_GET_BUDGETPO_AB", {   // 프로젝트 사용경비 현황 데이터 호출 rfc(ZB_GET_BUDGETTM_AB)를 사용
			//RFC Import 데이터
			I_EMPNO: zvEMPNO
			}).done(function(oResultData){   // RFC호출 완료
			if(oResultData.T_TAB1.length<5){
				for(var i=0; i<oResultData.T_TAB1.length; i++){
				oTeamArray.push({
						"measureName": oResultData.T_TAB1[i].CODDN,
						"value": oResultData.T_TAB1[i].PROPR
						});
						oDEPPR =  oDEPPR + oResultData.T_TAB1[i].PROPR;
				}
				oRemainder = oResultData.E_PROBUD - oDEPPR;
				oTeamArray.push({
						"measureName": "여유 예산",
						"value": oRemainder
						});
				oCardModel.setProperty("/donut2/sap.card/content/data/json/measures", oTeamArray);      
			}
			else{
				for(var i=0; i<3; i++){
					oTeamArray.push({
							"measureName": oResultData.T_TAB1[i].CODDN,
							"value": oResultData.T_TAB1[i].PROPR
						});
					}
				for(var i=3; i<oResultData.T_TAB1.length; i++){
					oDEPPR = oDEPPR + oResultData.T_TAB1[i].PROPR;
				}
				oTeamArray.push({
							"measureName": "기타",
							"value": oDEPPR
						});
				oRemainder = oResultData.E_PROBUD - oDEPPR - oResultData.T_TAB1[0] - oResultData.T_TAB1[1] - oResultData.T_TAB1[2];
				oTeamArray.push({
						"measureName": "여유 예산",
						"value": oRemainder
						});
				oCardModel.setProperty("/donut2/sap.card/content/data/json/measures", oTeamArray);         
			}
			oCard.refresh(); 
			}).fail(function(sErrorMessage){  // 호출 실패
			alert(sErrorMessage);
			});

		},

		/**********************************************************************************
		 * 부서원 사용경비 현황 모델링 작업
		 * 작성자 : 최동현
		 **********************************************************************************/
		callDataStackedColumn : function(oCardModel){  // 부서원 사용경비 현황 카드의 content 안에 들어갈 데이터 (RFC로 대체)
			var oCardModel = this.getView().getModel("cardManifests");
			var oCard = this.getView().byId("stackedColumn");
			var oTeamArray = [];
			var zvGCODE = this.getOwnerComponent().getCookiy("GCODE");
			this.getOwnerComponent().rfcCall("ZB_GET_TEAMCOST_AB", {   // 부서원 사용경비 현황 데이터 호출 rfc(ZB_GET_TEAMCOST_AB)를 사용
			//RFC Import 데이터
			I_GCODE: zvGCODE
			}).done(function(oResultData){   // RFC호출 완료
			for(var i=0; i<oResultData.T_TAB1.length; i++){
				oTeamArray.push({
						"Category": oResultData.T_TAB1[i].ENAME,
						"expense": oResultData.T_TAB1[i].PROPR
						});
			}
			oCardModel.setProperty("/stackedColumn/sap.card/content/data/json/list", oTeamArray);
			oCard.refresh(); 
			}).fail(function(sErrorMessage){  // 호출 실패
			alert(sErrorMessage);
			});

		},

		/**********************************************************************************
		 * 프로젝트 팀원 사용경비 현황 모델링 작업
		 * 작성자 : 최동현
		 **********************************************************************************/
		callDataStackedColumn2 : function(oCardModel){  // 프로젝트 팀원 사용경비 현황 카드의 content 안에 들어갈 데이터 (RFC로 대체)
			var oCardModel = this.getView().getModel("cardManifests");
			var oCard = this.getView().byId("stackedColumn2");
			var oTeamArray = [];
			var zvEMPNO = this.getOwnerComponent().getCookiy("EMPNO");
			this.getOwnerComponent().rfcCall("ZB_GET_PROJCOST_AB", {   // 프로젝트 팀원 사용경비 현황 데이터 호출 rfc(ZB_GET_TEAMCOST_AB)를 사용
			//RFC Import 데이터
			I_EMPNO: zvEMPNO
			}).done(function(oResultData){   // RFC호출 완료
			for(var i=0; i<oResultData.T_TAB1.length; i++){
				oTeamArray.push({
						"Category": oResultData.T_TAB1[i].ENAME,
						"expense": oResultData.T_TAB1[i].PROPR
						});
			}
			oCardModel.setProperty("/stackedColumn2/sap.card/content/data/json/list", oTeamArray);
			oCard.refresh(); 
			}).fail(function(sErrorMessage){  // 호출 실패
			alert(sErrorMessage);
			});

		},

		/**********************************************************************************
		 * 함수 내용 : 카드 이벤트 연결 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
		cardEventConnect : function(oCardModel){
			
			var oModel = this.getView().getModel("authority");

			// 관리 부서 및 프로젝트 사용 경비 이벤트 연결
			var ExpensesCard = this.getView().byId("depExpensesCard");
			var depExpensesData = oCardModel.getProperty("/depExpenses");
			var porjExpensesData = oCardModel.getProperty("/porjExpenses");

			ExpensesCard.attachBrowserEvent("click", function(event) {
				console.log(event);
				if(event.toElement.classList[0] == "sapMTextMaxLine" || event.toElement.classList[0] == "sapFCardHeaderTextFirstLine"
					|| event.toElement.classList[0] == "sapFCardHeader"){
					
					if(oModel.getProperty("/ExpensesCardHandle")){
						ExpensesCard.setManifest(depExpensesData);
						oModel.setProperty("/ExpensesCardHandle", false);
					
					}else{
						ExpensesCard.setManifest(porjExpensesData);
						oModel.setProperty("/ExpensesCardHandle", true);
					
					}
					ExpensesCard.refresh();
				}
				console.log(oModel.getProperty("/ExpensesCardHandle"));

			}, this);

			//관리 부서 및 프로젝트 사용 경비 추이 이벤트 연결
			var ExpTransCard = this.getView().byId("depExpTransCard");
			var depExpTransData = oCardModel.getProperty("/depExpTrans");
			var projExpTransData = oCardModel.getProperty("/projExpTrans");

			ExpTransCard.attachBrowserEvent("click", function(event) {

				if(event.toElement.classList[0] == "sapMTextMaxLine"){
					if(oModel.getProperty("/ExpTransCardHandle")){
						ExpTransCard.setManifest(depExpTransData);
						oModel.setProperty("/ExpTransCardHandle", false);
					}else{
						ExpTransCard.setManifest(projExpTransData);
						oModel.setProperty("/ExpTransCardHandle", true);
					}
					ExpTransCard.refresh();
				}
				console.log(oModel.getProperty("/ExpTransCardHandle"));

			}, this);

		},

		/**********************************************************************************
		 * 함수 내용 : 전표현황 카트 콤보박스 이벤트
		 * 작성자 : 김성진
		 **********************************************************************************/
		onPaymentSelect : function(){
			var oCardModel = this.getView().getModel("cardManifests");
			this.callDataStatusList(oCardModel);
		},
	
		/**********************************************************************************
		 * 함수 내용 : 전표현황 카트 리스트 클릭 이벤트
		 * 작성자 : 김성진
		 **********************************************************************************/
		onPaymentListSelection : function(event){
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var sPath = event.oSource._aSelectedPaths[0]
			var oModel = this.getView().getModel();
			var paymentCardData = oModel.getProperty(sPath+"/name");
			MessageToast.show(paymentCardData);

			switch (paymentCardData) {

				// 예산 증액 요청 관련 라우팅
				case "부서 예산 증액 요청":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("DepBudget_YS", {
						status : 0
					});
					break;

				case "부서 예산 증액 요청 반려":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("DepBudget_YS", {
						status : 1
					});
					break;

				case "부서 예산 증액 요청 완료":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("DepBudget_YS", {
						status : 2
					});
					break;

				case "프로젝트 예산 증액 요청":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("ProjBudget_YS", {
						status : 0
					});
					break;

				case "프로젝트 예산 증액 요청 반려":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("ProjBudget_YS", {
						status : 1
					});
					break;

				case "프로젝트 예산 증액 요청 완료":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("ProjBudget_YS", {
						status : 2
					});
					break;

				// 예산 증액 승인 관련 라우팅
				case "부서 예산 증액 요청 미결":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("DepBudget_SY", {
						status : 0
					});
					break;
				case "프로젝트 예산 증액 요청 미결":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("ProjBudget_YS", {
						status : 0
					});
					break;

				// 경비 요청 관련 라우팅
				case "임시저장":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("Approyj");
					break;

				case "승인요청":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("Approyj");
					break;

				case "승인요청 완료":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("Approyj");
					break;

				case "지급 완료":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("Approyj");
					break;
					
				// 경비 승인 관련 라우팅
				case "승인요청 미결":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("ExpenseManagement");
					break;

				// 지급 관련 라우팅
				case "지급 미결":
					this.byId("paymentlist").removeSelections();
					oRouter.navTo("List26");
					break;

				default:
					break;
			}


		}

  });
});