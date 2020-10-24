sap.ui.define([ 
   "sap/ui/core/mvc/Controller", 
   "sap/m/MessageToast",
   "sap/m/MessageBox",
   "sap/ui/model/json/JSONModel", 
   "sap/ui/model/resource/ResourceModel",
   "sap/ui/core/Fragment" ,
   "sap/ui/core/UIComponent",
   "sap/ui/core/routing/History",
   "sap/ui/model/Filter", 
   "sap/ui/model/FilterOperator"
],
      function(Controller, MessageToast,MessageBox, JSONModel, ResourceModel,Fragment,UIComponent, History, Filter, FilterOperator) {
         "use strict";

         return Controller.extend("ExpenseManagement.controller.businessTrip.confirm.Confirm", {

            onInit : function() {
               var that = this;
                //실행버튼  이름 바꾸기
         var oFilter = this.getView().byId("objectFilter_BS"),
            that = this;
            oFilter.addEventDelegate({
            "onAfterRendering": function(oEvent) {
               var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();

               var oButton = oEvent.srcControl._oSearchButton;
               oButton.setText(oResourceBundle.getText("조회"));
               }
            });

          

         //사원검색 모델링
         var that = this;

         var odate = {
            info : [],
            fragInfo : [],
            comboDataItems : [{
               GCODE:"전체",
               GNAME:"전체"
            }],
   
      
         }
         var oModel = new JSONModel(odate);
         this.getView().setModel(oModel);   

         // 날짜 모델링
         var yesterday = (function(){this.setDate(this.getDate()-1); return this}).call(new Date);

               var oData = {
                oToday: yesterday,
                oToday2: new Date(),

                 filterbar: {
                  sdate: "",
                  status: 1,
                  empno:"",
                  gocde:""
                },
                             };
             var oModel= new JSONModel(oData);  
         this.getView().setModel(oModel , "TEST");
         //근무연월 설정                    
         var todayDate = new Date();
         var yyyy = todayDate.getFullYear();
         var mm = todayDate.getMonth()+1 >= 10 ? todayDate.getMonth()+1 : "0"+(todayDate.getMonth()+1) ;
         
         
         this.getView().getModel("TEST").setProperty("/WORKYM", yyyy+"-"+mm);


         //프레그먼트 콤보박스 데이터 셋팅

this.getOwnerComponent().rfcCall("ZB_GCODE_96", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
   //RFC Import 데이터
}).done(function(oResultData){   // RFC호출 완료
   var tttt=oResultData.T_ZBMDT0020;
   var odata = that.getView().getModel().getProperty("/comboDataItems")

   for(var i=0; i<tttt.length; i++){
      odata.push(tttt[i]);
   }
   that.getView().getModel().refresh();

}).fail(function(sErrorMessage){// 호출 실패
   alert(sErrorMessage);
}).then(function(){
   // 여기다가 rfc 호출후 작업코딩
});
         
         
   //       this.getOwnerComponent().rfcCall("ZB_EMPNO_98", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
   //    //RFC Import 데이터
     //  }).done(function(oResultData){   // RFC호출 완료
   //    oModel.setProperty("/oEmpno", oResultData.T_ZBMDT0010);
     //  }).fail(function(sErrorMessage){// 호출 실패
   //    alert(sErrorMessage);
     // }).then(function(){
   //    // 여기다가 rfc 호출후 작업코딩
     //  });
         

         },

         onAfterRendering : function(){
             // 초기값 필터적용
         this.onFilterBarSearch();
         
         

       //////   RFC호출
       //var that = this;
       //  var mEmployee = this.getView().getModel("perdium");
       //  var Request = mEmployee.getProperty("/RequestList");
       //  Request.splice(0,Request.length);
       //  mEmployee.refresh();
         
       //   this.getOwnerComponent().rfcCall("ZB_GET_PERDIUM_DATA", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
       //       //RFC Import 데이터
       //    }).done(function(oResultData){   // RFC호출 완료
       //         //console.log(oResultData);
                
       //    for(var i=0; i < oResultData.T_SPER.length; i++){
       //       // mperdium.setProperty("/RequestList", oResultData.T_PDIEM[i]);
       //       Request.push(oResultData.T_SPER[i]);
       //    }
           
       //    }).fail(function(sErrorMessage){// 호출 실패
       //       alert(sErrorMessage);
       //    }).then(function(){
       //    	// console.log(mEmployee.getProperty("/RequestList"));
       //       mEmployee.refresh();
       //       this.getView().refresh();
         
       //    });
            
         },

      // //뒤로가기
      //    onPageBack : function(){
      //    var oHistory  = new History.getInstance();
      //    var sPreviousHash = oHistory.getPreviousHash();

      //    if (sPreviousHash !== undefined) {
      //       window.history.go(-1);
      //    } else {
      //       var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
      //       oRouter.navTo("home");
      //    }
         
      // },
      //상세 테이블 이동
      onGoDetail : function(oEvent) {

         var sPath = oEvent.oSource.oBindingContexts.perdium.sPath;

         // var oPerdium = this.getView().getModel("perdium");
         // var oDetail = this.getView().getModel("detailPerdium");
         //   oDetail.setProperty("/DetailList", oPerdium.getProperty(sPath));

         //  var check = oDetail.getProperty("/DetailList"); 
         //  console.log(check.PCODE);
         //  console.log(check.EMPNO);

         var oPerdium = this.getView().getModel("perdium");
        
         oPerdium.setProperty("/detailData", oPerdium.getProperty(sPath));
          var detailData = oPerdium.getProperty("/detailData"); 

          // 선택 row Data     
         var sPcode = detailData.PCODE //프로젝트코드
         var sEmpno = detailData.EMPNO	//사원번호
         var sAcode = detailData.AUTRZ //상태코드

          ////   RFC호출
         var mEmployee = this.getView().getModel("detailPerdium");
         var detail = mEmployee.getProperty("/DetailList");
         detail.splice(0,detail.length);
         mEmployee.refresh();

          this.getOwnerComponent().rfcCall("ZB_DETAIL_PERDIUM", {   
              //RFC Import 데이터
              I_PCODE: sPcode,
              I_EMPNO: sEmpno,
              I_AUTRZ: sAcode 
           }).done(function(oResultData){   // RFC호출 완료

           for(var i=0; i < oResultData.T_PROJECT.length; i++){
              detail.push(oResultData.T_PROJECT[i]);
           }
           
           }).fail(function(sErrorMessage){// 호출 실패
              alert(sErrorMessage);
           }).then(function(){
              console.log(mEmployee.getProperty("/DetailList"));
              mEmployee.refresh();
              
   });

      },

   //특정 row 선택
   rowSelection : function(oEvent){
      var perdiumModel = this.getView().getModel("perdium");
         if(oEvent.oSource._aSelectedPaths){
              var aPath = oEvent.oSource._aSelectedPaths;
              
              perdiumModel.setProperty("/test", []); 
              var selectTable = perdiumModel.getProperty("/test");
            for(var i=0; i<aPath.length; i++){
              selectTable.push(perdiumModel.getProperty(aPath[i]));
           }
        } 
        
   },
  // //승인
   onAccept: function(){
      var that = this;
      MessageBox.confirm("승인 하시겠습니까?" , {
      actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
      onClose: function (sAction) {
         if(sAction === "OK"){ 
            
      ////   선택 row
      var perdiumModel = that.getView().getModel("perdium");
      var selectTable = perdiumModel.getProperty("/test");
      ////   RFC호출
       that.getOwnerComponent().rfcCall("ZB_SAVE_TOTALPERDIUM", {   
           //RFC Import 데이터
           T_SPER : selectTable
        }).done(function(oResultData){   // RFC호출 완료
         MessageToast.show("승인되었습니다");
         window.location.reload();
        }).fail(function(sErrorMessage){// 호출 실패
           alert(sErrorMessage);
        }).then(function(){
      refresh();
        });
            }
         }
      });

      


   },
   //반려
   onReject: function(){
      var that = this;
      MessageBox.confirm("반려 하시겠습니까?" , {
      actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
      onClose: function (sAction) {
         if(sAction === "OK"){ 
      ////   RFC호출
        var perdiumModel = that.getView().getModel("perdium");
        var selectTable = perdiumModel.getProperty("/test");
       
        console.log(selectTable);

          that.getOwnerComponent().rfcCall("ZB_REJECT_TOTALPERDIUM", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
              //RFC Import 데이터
              
              T_RPER: selectTable
              
              
           }).done(function(oResultData){   // RFC호출 완료
                console.log(oResultData);
                MessageToast.show("반려 되었습니다.");
                window.location.reload();
           }).fail(function(sErrorMessage){// 호출 실패
              alert(sErrorMessage);
           }).then(function(){
            refresh();
         });
             }
          }
       });

   },
         
         
      //    onChangeDateRange: function(oEvent){
              
      //    console.log(oEvent.getSource().getDateValue());
      //    console.log( oEvent.getSource().getSecondDateValue());
      //    // this.getView().getModel("TEST").getData();           
      //    },

         onFilterBarSearch : function(oEvent) {
            var that = this;
            //사원번호  쿠키 정보받기
            var EMPNO = that.getOwnerComponent().getCookiy("EMPNO");

         // 날짜데이터
         var oModel = this.getView().getModel("TEST");
      var sDateInfo = oModel.getProperty("/WORKYM");   

//             var odata = this.getView().getModel("TEST").getProperty("/oToday");
//             var odata2 = this.getView().getModel("TEST").getProperty("/oToday2");
//             var sFromDate = new Date(odata);
//             var sToDate = new Date(odata2);
         

//             var sFromYear = sFromDate.getUTCFullYear();
//             var sFromMonth = sFromDate.getUTCMonth()+1 >= 10 ? sFromDate.getUTCMonth()+1 : "0"+(sFromDate.getUTCMonth()+1);
//             var sFromDate = sFromDate.getUTCDate()+1 >= 10 ? sFromDate.getUTCDate()+1 : "0"+(sFromDate.getUTCDate()+1);

//             var sToYear = sToDate.getUTCFullYear();
//             var sToMonth = sToDate.getUTCMonth()+1 >= 10 ? sToDate.getUTCMonth()+1 : "0"+(sToDate.getUTCMonth()+1);
//             var sToDate = sToDate.getUTCDate() >= 10 ? sToDate.getUTCDate() : "0"+sToDate.getUTCDate();

//  //           var sFromDateInfo = sFromYear.toString()+"-"+sFromMonth.toString()+"-"+sFromDate.toString();
//  //           var sToDateInfo = sToYear.toString()+"-"+sToMonth.toString()+"-"+sToDate.toString();

//          //   var sDateInfo = sToYear.toString()+"-"+sToMonth.toString();
//            var sDateInfo = sToYear.toString()+sToMonth.toString();

      // MessageToast.show(sToDateInfo);
      // var sFromDateInfo = sFromYear+sFromMonth+sFromDate;
      // var sToDateInfo = sToYear+sToMonth+sToDate;

      // var sDateInfo = sToYear+sToMonth;
         // MessageToast.show(sFromDateInfo);
      
         var oFilterData = this.getView().getModel("TEST").getData().filterbar;
         //var searchData = this.getView().getModel("TEST").getProperty("/SearchField");
         var empNoFilter = oFilterData.empno;
         // var sSDate= oFilterData.sdate;
         var iStatus= oFilterData.status;
            var sStatus="";

         if( iStatus===1 ){
             sStatus="A";
          }else if(iStatus===2){
             sStatus="B";
             
          }else if(iStatus===3){
             sStatus="C";
          } 


          
        
          
           ////   RFC호출
       
         var mEmployee = this.getView().getModel("perdium");
         var Request = mEmployee.getProperty("/RequestList");
         Request.splice(0,Request.length);
         mEmployee.refresh();
         
          this.getOwnerComponent().rfcCall("ZB_SEARCH_PERDIUM_DATA", {   
              //RFC Import 데이터
              I_AUEMP: EMPNO,
              I_WORKYM: sDateInfo 
           }).done(function(oResultData){   // RFC호출 완료
                console.log(oResultData);
                
           for(var i=0; i < oResultData.T_SERCH.length; i++){
              // mperdium.setProperty("/RequestList", oResultData.T_PDIEM[i]);
              Request.push(oResultData.T_SERCH[i]);
           }
           
           }).fail(function(sErrorMessage){// 호출 실패
              alert(sErrorMessage);
           }).then(function(){
              console.log(mEmployee.getProperty("/RequestList"));
              mEmployee.refresh();
            //  that.getView().refresh();
   });
   
      var aFilterbarFilter=[];

     //if (sSDate) {// ex)2020-07-17
     //   aFilterbarFilter.push(new Filter("SDATE", FilterOperator.BT, sSDate));
     //}

    //if (sFromDateInfo && sToDateInfo) {// ex)2020-07-17 ~ 2020-07-18
    //   aFilterbarFilter.push(new Filter("SDATE", FilterOperator.BT, sFromDateInfo, sToDateInfo));
    //}

    if (empNoFilter) {// ex)1417231
       aFilterbarFilter.push(new Filter("EMPNO", FilterOperator.Contains, empNoFilter));
    }
    if (sStatus) {
       aFilterbarFilter.push(new Filter("AUTRZ", FilterOperator.EQ, sStatus));
    }
     
      var aFilter = new Filter({
         filters: aFilterbarFilter,
          and : true
      }); 
      // filter binding
   var oList = this.byId("perdiumList_BS");
   var oBinding = oList.getBinding("items");
   oBinding.filter(aFilter);

},
onSelectRadio:function(oEvent){
   
   var iSelecteIndex= oEvent.getParameter("selectedIndex");
   this.getView().getModel("TEST").setProperty("/filterbar/status",iSelecteIndex);
},

onSelectedButton:function() {
   var radioData = this.getView().getModel("TEST").getProperty("/filterbar/RadioButtonGroup");

   var oFilterData = this.getView().getModel("TEST").getData().filterbar;
   var iStatus= oFilterData.status;

      // 버튼 보이기
      if(iStatus !== 1){
         this.getView().getModel("perdium").setProperty("/comboEnable", false);
         this.getView().getModel("detailPerdium").setProperty("/comboEnable", false);

      }else{
         this.getView().getModel("perdium").setProperty("/comboEnable", true);
         this.getView().getModel("detailPerdium").setProperty("/comboEnable", true);
      }
},


           //사원조회 rfc 함수

           handleValueHelp : function(oEvent){
            var target = oEvent.oSource.oParent.sId;
            // var targetData = target.replace("__table0-rows-row","").trim();

            var targetData = target.replace("container-ExpenseManagement---home--mainTableId-rows-row","").trim();

            this.getView().getModel().setProperty("/target", targetData);

            var oView = this.getView();

            this.getView().getModel().setProperty("/fragInfo", []);

           

            if (!this.byId("helloDialog")) {
               Fragment.load({
                  id: oView.getId(),
                  name: "ExpenseManagement.view.businessTrip.confirm.fragView",
                  controller: this
               }).then(function (oDialog) {
                  oView.addDependent(oDialog);
                  oDialog.open();
               });
            } else {
               this.byId("helloDialog").open();
            }
      },           
onSearch : function(){
   
   var oModel = this.getView().getModel();
   var comboData = oModel.getProperty("/comboData");
   var nameSearchData = oModel.getProperty("/nameSearch");

   MessageToast.show(comboData+"/"+nameSearchData);

   if(comboData==="전체"){
      comboData="";
   }

   this.getOwnerComponent().rfcCall("ZB_EMPLOYEESEARCH", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
      //RFC Import 데이터
      I_GCODE: comboData
   }).done(function(oResultData){   // RFC호출 완료
      console.log(oResultData.TAB1);
      oModel.setProperty("/fragInfo", oResultData.TAB1);
   }).fail(function(sErrorMessage){// 호출 실패
      alert(sErrorMessage);
   }).then(function(){
      // 여기다가 rfc 호출후 작업코딩
   });

},

onMainTableSelect : function(oEvent){
   var oEventData = oEvent.mParameters.rowIndices;
   var oModel = this.getView().getModel();

   for(var i=0 ; i < oEventData.length ; i++){
      if(oModel.getProperty("/info/" + oEventData[i] + "/checked")){
         oModel.setProperty("/info/" + oEventData[i] + "/checked", false);
      }else{
         oModel.setProperty("/info/" + oEventData[i] + "/checked", true);
      }
   }
   

},

onRowSelection : function(oEvent){
   var sPath = oEvent.mParameters.rowContext.sPath;
   var oModel = this.getView().getModel();
   var selectData = oModel.getProperty(sPath);

   oModel.setProperty("/oRow",selectData);
 
},

onCloseDialog : function () {
   var oModel = this.getView().getModel("TEST");
   oModel.setProperty("/filterbar/empno", "");
   this.byId("helloDialog").close();
},

onAddData : function(){
   // var oModel = this.getView().getModel();
   // this.byId("helloDialog").close();
   var oModel = this.getView().getModel();
   var empnoData = oModel.getProperty("/oRow/EMPNO");
   var testModel = this.getView().getModel("TEST");
   testModel.setProperty("/filterbar/empno",empnoData);
   this.byId("helloDialog").close();

},
// 프레그먼트 서치필드 라이브체인지 이벤트
onSearchChange : function(){
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


}



      
   });

});