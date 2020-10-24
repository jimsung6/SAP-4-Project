
sap.ui.define([
	"sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
   "sap/m/MessageToast",
   'sap/ui/export/Spreadsheet',
   "sap/ui/core/Fragment",
   'sap/viz/ui5/data/FlattenedDataset',
   'sap/viz/ui5/controls/common/feeds/FeedItem'
], function(Controller, JSONModel, Filter, FilterOperator, MessageToast, Spreadsheet, Fragment, FlattenedDataset, FeedItem) {
	   "use strict";

	return Controller.extend("ExpenseManagement.controller.report.PaymentRt", {

      /**********************************************************************************
		 * 함수 내용 : 초기 작업 처리
		 * 작성자 : 김성진
		 **********************************************************************************/
      onInit : function(){

         var tableColumn = [
            {
               label : "프로젝트 및 부서",
               property : "PNAME",
               visible : true
            },
            {
               label : "사원번호",
               property : "EMPNO",
               visible : true
            },
            {
               label: "사원이름",
               property: "ENAME", 
               visible : true
            },
            {
               label: "부서명",
               property: "GNAME",
               visible : true
            },
            {
               label: "지급일",
               property: "CUMON",
               visible : true
            },
            {
               label: "지급금액",
               property: "PROPR", 
               visible : true
            }
         ]

         var chartColumn = [
            {
               label: "부서 및 프로젝트",
               property: "PNAME", 
               visible : true
            },
            {
               label: "사원이름",
               property: "ENAME", 
               visible : true
            },
            {
               label : "사원번호",
               property : "EMPNO",
               visible : true
            },
            {
               label: "부서명",
               property: "GNAME",
               visible : true
            },
            {
               label: "지급일",
               property: "CUMON",
               visible : true
            },
            {
               label: "지급금액",
               property: "PROPR", 
               visible : true
            }
         ]

         this.getView().setModel(new JSONModel({
            Pcode : "",
            Gcode : "",
            reportTableData : [],
            reportChartData : [],
            reportLineChartData : [],
            reportDetailTableData : [],
            depComboData : [],
            projComboData : [],
            depComboData : [],
            exportDataSet : tableColumn,
            exportchartDataSet : chartColumn,
            sumPay : 0,
            radioGroup : 0,
            viewSelectIcon : "",
            settingData : {
               pcode : true,
               gcode : true,
               eName : true,
               gName : true,
               payDate : true,
               payment : true
            }
         }), "PaymentRt");

         var oModel = this.getView().getModel("PaymentRt");

         //테이블 모드 세팅
         oModel.setProperty("/selectMode", "선택모드");
         //뷰 선택 아이콘 세팅
         oModel.setProperty("/viewSelectIcon", "sap-icon://table-view");

         //라우터
         var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
         oRouter.getRoute("PaymentRt").attachPatternMatched(this._onObjectMatched, this);

         this.onSearch();
         //테이블 데이터 세팅 rfc함수 콜  
        // this.reportDataRFC(TOCUMON, FROMCUMON);

      },

      /**********************************************************************************
		 * 함수 내용 : 뷰 렌더링 후 작업 처리
		 * 작성자 : 김성진
		 **********************************************************************************/
      onAfterRendering : function(){
         var oModel = this.getView().getModel("PaymentRt");

         var oDate = new Date();
         oModel.setProperty("/startDate", oDate);
         oModel.setProperty("/endDate", oDate);

         this.onSearch();

      },

      /**********************************************************************************
		 * 함수 내용 : reportRFC 호출 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
      reportDataRFC : function(TOCUMON, FROMCUMON){
            //RFC호출    
            var EMPNO = this.getOwnerComponent().getCookiy("EMPNO");
            var AUCODE = this.getOwnerComponent().getCookiy("AUCODE");
            var oModel = this.getView().getModel("PaymentRt");
            var that = this;

            console.log(EMPNO + AUCODE);

            this.getOwnerComponent().rfcCall("ZB_GET_PAYMENTREPORT_AA", {
               //RFC Import 데이터
               I_EMPNO : EMPNO,
               I_AUCODE : AUCODE,
               I_TOCUMON : TOCUMON,
               I_FROMCUMON : FROMCUMON

            }).done(function(oResultData){   // RFC호출 완료
               console.log(oResultData);
               for(var i=0 ; i < oResultData.T_TAB1.length ; i++){
                  if(oResultData.T_TAB1[i].PCODE === "Z00"){
                     oResultData.T_TAB1[i].PNAME = oResultData.T_TAB1[i].GNAME;
                  }
               }
               oModel.setProperty("/projComboData", oResultData.T_TAB2);
               oModel.setProperty("/depComboData", oResultData.T_TAB3);

               oModel.setProperty("/reportTableData", oResultData.T_TAB1);
            }).fail(function(sErrorMessage){// 호출 실패
               alert(sErrorMessage);
            }).then(function(){
               //총 지금금액 구하기 함수콜
               that.chartDataSetting(oModel.getProperty("/reportTableData"));
               that.lineChartDataSetting(oModel.getProperty("/reportTableData"));
               that.PaymentSum();
               oModel.refresh();
            });
      },

      /**********************************************************************************
		 * 함수 내용 : 부서원 사용경비 차트 데이터 세팅 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
      chartDataSetting : function(tableDate){
         //차트 세팅
         var oModel = this.getView().getModel("PaymentRt");
         var oVizFrame = this.getView().byId("reportChart");
         oVizFrame.destroyFeeds();
         var tableSetDate = tableDate;
         oModel.setProperty("/reportChartData", []);
         var chartData = oModel.getProperty("/reportChartData");

         //날짜 데이터 가져오기
         var startDate = oModel.getProperty("/SearchStartDate");
         var endDate = oModel.getProperty("/SearchEndDate");

         for(var i=0 ; i < tableSetDate.length ; i++){
            if(chartData.length === 0){
               chartData.push({
                  PNAME : tableSetDate[i].PNAME,
                  EMPNO : tableSetDate[i].EMPNO,
                  ENAME : tableSetDate[i].ENAME,
                  GCODE : tableSetDate[i].GCODE,
                  GNAME : tableSetDate[i].GNAME,
                  CUMON : startDate+"~"+endDate,
                  PROPR : tableSetDate[i].PROPR,
                  ENAMEPNAME : tableSetDate[i].ENAME+"("+tableSetDate[i].PNAME+")"
               });
            }else{
               var ck = true;
               for(var j=0 ; j < chartData.length ; j++){
                  if( chartData[j].ENAMEPNAME === tableSetDate[i].ENAME+"("+tableSetDate[i].PNAME+")"){
                     chartData[j].PROPR += tableSetDate[i].PROPR;
                     ck = false;
                  }
               }
               if(ck){
                  chartData.push({
                     PNAME : tableSetDate[i].PNAME,
                     EMPNO : tableSetDate[i].EMPNO,
                     ENAME : tableSetDate[i].ENAME,
                     GCODE : tableSetDate[i].GCODE,
                     GNAME : tableSetDate[i].GNAME,
                     CUMON : startDate+"~"+endDate,
                     PROPR : tableSetDate[i].PROPR,
                     ENAMEPNAME : tableSetDate[i].ENAME+"("+tableSetDate[i].PNAME+")"
                  });
               }
            }
         }

         oModel.setProperty("/reportChartData", chartData);

         var oDataset = new FlattenedDataset({
            dimensions : [
               {
               name : '이름',
               value : "{ENAMEPNAME}"
               }
            ],
                           
            measures : [
               {
               name : '금액',
               value : '{PROPR}'
               } 
            ],
                         
            data : {
               path : "/reportChartData"
            }
         });	

         oVizFrame.setDataset(oDataset);
         oVizFrame.setModel(oModel);	
         oVizFrame.setVizType('column');

         oVizFrame.setVizProperties({
               plotArea: {
                  visible: true,
                  colorPalette : d3.scale.category20().range()
               }
          });

         var feedCategoryAxis = new FeedItem({
            'uid': "categoryAxis",
            'type': "Dimension",
            'values': ["이름"]
         });

         var feedValueCost = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["금액"]
         })
          
		oVizFrame.addFeed(feedCategoryAxis);
      oVizFrame.addFeed(feedValueCost);
      },

      /**********************************************************************************
		 * 함수 내용 : 부서경비 사용 추이 차트 데이터 세팅 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
       lineChartDataSetting : function(tableDate){
         //차트 세팅
         var oModel = this.getView().getModel("PaymentRt");
         var oVizFrame = this.getView().byId("reportLineChart");
         oVizFrame.destroyFeeds();
         var tableSetDate = tableDate;
         oModel.setProperty("/reportLineChartData", []);
         var lineChartData = oModel.getProperty("/reportLineChartData");

         for(var i=0 ; i < tableSetDate.length ; i++){
            if(lineChartData.length === 0){
               lineChartData.push({
                  CUMON : tableDate[i].CUMON,
                  PROPR : tableDate[i].PROPR
               });
            }else{
               var ck = true;
               for(var j=0 ; j < lineChartData.length ; j++){
                  if( lineChartData[j].CUMON === tableSetDate[i].CUMON){
                     lineChartData[j].PROPR += tableSetDate[i].PROPR;
                     ck = false;
                  }
               }
               if(ck){
                  lineChartData.push({
                     CUMON : tableDate[i].CUMON,
                     PROPR : tableDate[i].PROPR
                  });
               }
            }
         }

         oModel.setProperty("/reportLineChartData", lineChartData);

         var oDataset = new FlattenedDataset({
            dimensions : [
               {
               name : "날짜",
               value : "{CUMON}"
               }
            ],
                           
            measures : [
               {
               name : '금액',
               value : '{PROPR}'
               } 
            ],
                         
            data : {
               path : "/reportLineChartData"
            }
         });	

         oVizFrame.setDataset(oDataset);
         oVizFrame.setModel(oModel);	
         oVizFrame.setVizType('line');

         oVizFrame.setVizProperties({
               plotArea: {
                  visible: true,
                  colorPalette : d3.scale.category20().range()
               }
          });

         var feedCategoryAxis = new FeedItem({
            'uid': "categoryAxis",
            'type': "Dimension",
            'values': ["날짜"]
         });

         var feedValueCost = new FeedItem({
            'uid': "valueAxis",
            'type': "Measure",
            'values': ["금액"]
         })
          
		oVizFrame.addFeed(feedCategoryAxis);
      oVizFrame.addFeed(feedValueCost);
      },

      /**********************************************************************************
		 * 함수 내용 : 파라미터 값 들고오기
		 * 작성자 : 김성진
		 **********************************************************************************/
      _onObjectMatched: function (oEvent) {

         if(oEvent.mParameters){
            var PcodeData = oEvent.mParameters.arguments.Pcode;
            var GcodeData = oEvent.mParameters.arguments.Gcode;

            this.getView().getModel("PaymentRt").setProperty("/Pcode", PcodeData);
            this.getView().getModel("PaymentRt").setProperty("/Gcode", GcodeData);
         }

      },

       /**********************************************************************************
		 * 함수 내용 : 다른이름으로 저장 다이얼로그 호출 및 컨트롤러 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
      onReNameReport : function(){
         var oView = this.getView();
         var that = this;
         // 컨트롤러 메소드 
         var controller = {
            onSaveReNameReport : function(){
               var fragInputData = that.getView().getModel("PaymentRt").getProperty("/fragInputData");

               that.onExport(fragInputData);
               that.getView().getModel("PaymentRt").setProperty("/fragInputData", "");
               that.byId("RpRenameDialog").close();
            },
            onCloseReNameReport : function(){
               that.getView().getModel("PaymentRt").setProperty("/fragInputData", "");
               that.byId("RpRenameDialog").close();
            }
         }
			// create dialog lazily
			if (!this.byId("RpRenameDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
               name: "ExpenseManagement.view.report.RpRename",
               controller: controller
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("RpRenameDialog").open();
         }
         
      },

       /**********************************************************************************
		 * 함수 내용 : 테이블 엑셀로 export 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
      onExport : function(fragInputData){
         var oModel = this.getView().getModel("PaymentRt");
         var oSettings, oSheet, InputData;
         var tableData = [];
         var tableColData = [];

         //export 할 파일 이름
         if(fragInputData && typeof fragInputData === "string"){
             InputData = fragInputData+".xlsx";
         }else{
             InputData = "exportTest.xlsx"
         }

         // export 할 테이블 데이터 및 컬럼 set   exportchartDataSet
         var exportDataSet = oModel.getProperty("/exportDataSet");
         var exportchartDataSet = oModel.getProperty("/exportchartDataSet");
         var reportTableData = oModel.getProperty('/reportTableData');
         var reportChartData = oModel.getProperty('/reportChartData');
         var reportTable = this.byId("reportTable");

         if(this.byId("reportTable").getVisible()){

            for(var i=0 ; i<exportDataSet.length ; i++){
               if(exportDataSet[i].visible){
                  tableColData.push(exportDataSet[i]);
               }
            }

            if(reportTableData.length > 0){
               if(reportTable.getSelectionMode() === "MultiToggle"){
                  for(var i=0 ; i < reportTableData.length ; i++){
                     if(reportTableData[i].checked){
                        tableData.push(reportTableData[i]);
                     }
                  }
               }else{
                  tableData = reportTableData;
               }
            }else{
               MessageToast.show('레포트 테이블의 데이터가 없습니다.');
               return 0;
            }

         }else{
            for(var i=0 ; i<exportchartDataSet.length ; i++){
                  tableColData.push(exportchartDataSet[i]);
            }
            if(reportChartData.length > 0){
               
               for(var i=0 ; i < reportChartData.length ; i++){
                  if(reportChartData[i].checked){
                     tableData.push(reportChartData[i]);
                  }
               }  
            }else{
               MessageToast.show('레포트 테이블의 데이터가 없습니다.');
               return 0;
            }
         }

         if(tableData.length < 1){
            MessageToast.show('선택한 데이터가 없습니다.');
            return 0;
         }

         //export set
			oSettings = {
				workbook: { columns: tableColData },
            dataSource: tableData,
            fileName: InputData,
			};

			oSheet = new Spreadsheet(oSettings);
			oSheet.build()
				.then( function() {
					MessageToast.show('레포트 저장');
				})
				.finally(oSheet.destroy);
         
      },

      /**********************************************************************************
		 * 함수 내용 : 서치필드 라이트체인지 이벤트 (사원이름 검색함수)
		 * 작성자 : 김성진
		 **********************************************************************************/
      onliveChange : function(){
         //서치필드 데이터
         var SearchFieldData = this.getView().getModel("PaymentRt").getProperty("/SearchField");
			
         var aFilter = [];
         
			if (SearchFieldData) {
				aFilter.push(new Filter("ENAME", FilterOperator.Contains, SearchFieldData));
			}

			var oList = this.byId("reportTable");
			var oBinding = oList.getBinding("rows");
			oBinding.filter(aFilter);
      },

       /**********************************************************************************
		 * 함수 내용 : 필터바 실행 함수 (지급월 기준 조회)
		 * 작성자 : 김성진
		 **********************************************************************************/
      onSearch : function(){

         var oModel = this.getView().getModel("PaymentRt");
         var startDate = oModel.getProperty("/startDate");
         var endDate = oModel.getProperty("/endDate");

        //날짜 데이터 핸들링

        //시작 날짜 핸들링
        if(startDate && endDate){
            var startYear = startDate.getFullYear();
            var startMonth = startDate.getMonth()+1 >= 10 ? startDate.getMonth()+1 : "0"+(startDate.getMonth()+1);
            //끝 날짜 핸들링
            var endYear = endDate.getFullYear();
            var endMonth = endDate.getMonth()+1 >= 10 ? endDate.getMonth()+1 : "0"+(endDate.getMonth()+1);
   
            startDate = startYear.toString() + startMonth.toString();
            endDate = endYear.toString() + endMonth.toString();

            oModel.setProperty("/SearchStartDate", startDate);
            oModel.setProperty("/SearchEndDate", endDate);

            this.reportDataRFC(startDate, endDate);

        }else{
          // MessageToast.show("날짜 선택 오류");
        }

      },

       /**********************************************************************************
		 * 함수 내용 : 레포트 테이블 로우 선택 이벤트
		 * 작성자 : 김성진 
		 **********************************************************************************/
      onRowSelection : function(oEvent){
         var oModel = this.getView().getModel("PaymentRt");
         var tableData = oModel.getProperty("/reportTableData");

         if(oEvent.mParameters.selectAll){
            if(oModel.getProperty("/SearchField")){
               for(var i=0 ; i < tableData.length ; i++){
                  if(tableData[i].ENAME === oModel.getProperty("/SearchField")){
                     tableData[i].checked = true;
                  }
               }
            }else{
               for(var i=0 ; i < tableData.length ; i++){
                  tableData[i].checked = true;
               }
            }
         }else{
            if(oEvent.mParameters.rowIndex === -1){
               for(var i=0 ; i < tableData.length ; i++){
                  tableData[i].checked = false;
               }
            }else{
                  var sPath = oEvent.getParameter("rowContext").getPath();

                  if(oModel.getProperty(sPath).checked){
                     oModel.setProperty(sPath + "/checked", false);
                  }else{
                     oModel.setProperty(sPath + "/checked", true);
                  }
               
            }
         }
         this.PaymentSum();
      },

      /**********************************************************************************
		 * 함수 내용 : 레포트 테이블 총 지금금액 구하기 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
      PaymentSum : function(){
         var oModel = this.getView().getModel("PaymentRt");
         var tableData = oModel.getProperty("/reportTableData");
         var chartData = oModel.getProperty("/reportChartData");
         var sumData = 0;

         if(this.byId("reportTable").getVisible()){
            if(this.byId("reportTable").getSelectionMode() === "None"){
               for(var i=0 ; i < tableData.length ; i++){
                     sumData += tableData[i].PROPR;
               }
            }else{
               for(var i=0 ; i < tableData.length ; i++){
                  if(tableData[i].checked){
                     sumData += tableData[i].PROPR;
                  }
               }
            }
         }else{
            for(var i=0 ; i < chartData.length ; i++){
               if(chartData[i].checked){
                  sumData += chartData[i].PROPR;
               }
            }
         }

         oModel.setProperty("/sumPay", sumData);
      },

      /**********************************************************************************
		 * 함수 내용 : 레포트 테이블 세팅 다이어로그 호출 및 컨트롤러 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
      onSettings : function(){

         var oView = this.getView();
         var that = this;

         //컨트롤러 메소드 
         var controller = {
            //레포트 테이블 세팅 다이어로그 저장 버튼 함수
            onSettingSave : function(){
               ///exportDataSet/0/visible
               var oModel = that.getView().getModel("PaymentRt");
               var settingData = oModel.getProperty("/settingData");
               var reportTable = that.byId("reportTable");

               oModel.setProperty("/exportDataSet/0/visible", settingData.pcode);
               oModel.setProperty("/exportDataSet/1/visible", settingData.gcode);
               oModel.setProperty("/exportDataSet/2/visible", settingData.eName);
               oModel.setProperty("/exportDataSet/3/visible", settingData.gName);
               oModel.setProperty("/exportDataSet/4/visible", settingData.payDate);
               oModel.setProperty("/exportDataSet/5/visible", settingData.payment);

               var radioData = oModel.getProperty("/radioGroup");

               if(radioData === 0){
                  reportTable.setSelectionMode("None");
               }else{
                  reportTable.setSelectionMode("MultiToggle");
               }
               that.PaymentSum();
               that.byId("RpSettingsDialog").close();
            },
            //레포트 테이블 세팅 다이어로그 취소 버튼 함수
            onSettingCanc : function(){
               var oModel = that.getView().getModel("PaymentRt");
               var reportTable = that.byId("reportTable");

               oModel.setProperty("/settingData/pcode", oModel.getProperty("/exportDataSet/0/visible"));
               oModel.setProperty("/settingData/gcode", oModel.getProperty("/exportDataSet/1/visible"));
               oModel.setProperty("/settingData/eName", oModel.getProperty("/exportDataSet/2/visible"));
               oModel.setProperty("/settingData/gName", oModel.getProperty("/exportDataSet/3/visible"));
               oModel.setProperty("/settingData/payDate", oModel.getProperty("/exportDataSet/4/visible"));
               oModel.setProperty("/settingData/payment", oModel.getProperty("/exportDataSet/5/visible"));

               if(reportTable.getSelectionMode() === "None"){
                  oModel.setProperty("/radioGroup", 0);
               }else{
                  oModel.setProperty("/radioGroup", 1);
               }
               
               that.byId("RpSettingsDialog").close();
            },
            onTableSettingAll : function(){
               var oModel = that.getView().getModel("PaymentRt");

               oModel.setProperty("/settingData/pcode", true);
               oModel.setProperty("/settingData/gcode", true)
               oModel.setProperty("/settingData/eName", true)
               oModel.setProperty("/settingData/gName", true)
               oModel.setProperty("/settingData/payDate", true)
               oModel.setProperty("/settingData/payment", true)
            }
         }
			// create dialog lazily
			if (!this.byId("RpSettingsDialog")) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
               name: "ExpenseManagement.view.report.RpSettings",
               controller: controller
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
				});
			} else {
				this.byId("RpSettingsDialog").open();
         } 
      },

      /**********************************************************************************
		 * 함수 내용 : 레포트 테이블 뷰 버튼 선택 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
      onTableView : function(){
         this.getView().getModel("PaymentRt").setProperty("/viewSelectIcon", "sap-icon://table-view");
         this.byId("reportTable").setVisible(true);
         this.byId("reportChartToolbar").setVisible(false);
         this.byId("reportChart").setVisible(false);

         this.getView().getModel("PaymentRt").refresh();
         this.PaymentSum();
      },

      /**********************************************************************************
		 * 함수 내용 : 레포트 차트 뷰 버튼 선택 함수
		 * 작성자 : 김성진
		 **********************************************************************************/
      onChartView : function(){
         this.getView().getModel("PaymentRt").setProperty("/viewSelectIcon", "sap-icon://bar-chart");
         this.byId("reportTable").setVisible(false);
         this.byId("reportChartToolbar").setVisible(true);
         this.byId("reportChart").setVisible(true);

         this.getView().getModel("PaymentRt").refresh();
         this.PaymentSum();
      },

       /**********************************************************************************
		 * 함수 내용 : 부서원 사용경비 차트 데이터 샐랙트 함수 (막대 차트)
		 * 작성자 : 김성진
		 **********************************************************************************/
      onSelectData : function(event){
         var oModel = this.getView().getModel("PaymentRt");

         for(var i=0 ; i<event.mParameters.data.length ; i++){
            var index = event.mParameters.data[i].data._context_row_number;
            oModel.setProperty("/reportChartData/"+index+"/checked", true)
         }
         console.log(oModel.getProperty("/reportChartData"));
         this.PaymentSum();
      },

      /**********************************************************************************
		 * 함수 내용 : 부서원 사용경비 차트 데이터 샐랙트 취소 함수 (막대 차트)
		 * 작성자 : 김성진
		 **********************************************************************************/
      onDeselectData : function(event){
         var oModel = this.getView().getModel("PaymentRt");

         for(var i=0 ; i<event.mParameters.data.length ; i++){
            var index = event.mParameters.data[i].data._context_row_number;
            oModel.setProperty("/reportChartData/"+index+"/checked", false)
         }
         console.log(oModel.getProperty("/reportChartData"));

         this.PaymentSum();
      },

       /**********************************************************************************
		 * 함수 내용 : 부서 경비 사용 추이 차트 데이터 샐랙트 함수 (라인 차트)
		 * 작성자 : 김성진
		 **********************************************************************************/
      onSelectLineData : function(event){

         var selectData = event.mParameters.data
         var oModel = this.getView().getModel("PaymentRt");
         var tableData = oModel.getProperty("/reportTableData");
         var detailTableData = oModel.getProperty("/reportDetailTableData");

         for( var i=0 ; i < selectData.length ; i++){
            for(var j=0 ; j < tableData.length ; j++){
               if(tableData[j].CUMON === selectData[i].data.날짜){
                  detailTableData.push(tableData[j]);
               }
            }
         }

         oModel.refresh();

      },

      /**********************************************************************************
		 * 함수 내용 : 부서 경비 사용 추이 차트 데이터 샐랙트 취소 함수 (라인 차트)
		 * 작성자 : 김성진
		 **********************************************************************************/
      onDeselectLineData : function(event){
         var selectData = event.mParameters.data
         var oModel = this.getView().getModel("PaymentRt");
         var detailTableData = oModel.getProperty("/reportDetailTableData");

         for( var i=0 ; i < selectData.length ; i++){
            for(var j=detailTableData.length-1 ; j >= 0 ; j--){
               if(detailTableData[j].CUMON === selectData[i].data.날짜){
                  detailTableData.splice(j, 1);
               }
            }
         }

         oModel.refresh();
      },

		depSelectionChange: function(oEvent) {

        var data =  this.getView().getModel("PaymentRt").getProperty("/depfilterData");
         
         console.log(data);
      },
      
      projSelectionChange : function(){
         var data =  this.getView().getModel("PaymentRt").getProperty("/projfilterData");
         
         console.log(data);
      }

	});
});