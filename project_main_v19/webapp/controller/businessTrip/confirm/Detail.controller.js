sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel", 
    "sap/ui/model/resource/ResourceModel",
    "sap/ui/core/routing/History",
    "sap/ui/core/Fragment",
    "sap/m/MessageBox"
    ], function(Controller, MessageToast, JSONModel, ResourceModel, History, Fragment, MessageBox) {
        "use strict";
    
        // sap.ui.demo.walkthrough = name space
        return Controller.extend("ExpenseManagement.controller.businessTrip.confirm.detail", {
         onInit : function () {
            // 
     this.getView().setModel(new JSONModel({
        
        
     }), "detailModel");


         
     }, 
     onAfterRendering: function() {
  //        var that = this;
  //       // 선택 row Data
  //       var oSelectRow = this.getView().getModel("perdium");	
  //       var detailData = oSelectRow.getProperty("/detailData");
        

  //       var sPcode = detailData.PCODE //프로젝트코드
  //       var sEmpno = detailData.EMPNO	//사원번호


  //        ////   RFC호출
  //       var mEmployee = this.getView().getModel("detailPerdium");
  //       var detail = mEmployee.getProperty("/DetailList");
  //       detail.splice(0,detail.length);
  //       mEmployee.refresh();
        
        

  //        this.getOwnerComponent().rfcCall("ZB_DETAIL_PERDIUM", {   
  //            //RFC Import 데이터
  //            I_PCODE: sPcode,
  //            I_EMPNO: sEmpno 
  //         }).done(function(oResultData){   // RFC호출 완료

  //         for(var i=0; i < oResultData.T_PROJECT.length; i++){
  //            detail.push(oResultData.T_PROJECT[i]);
  //         }
          
  //         }).fail(function(sErrorMessage){// 호출 실패
  //            alert(sErrorMessage);
  //         }).then(function(){
  //         	console.log(mEmployee.getProperty("/DetailList"));
  //            mEmployee.refresh();
  //            that.getView().refresh();
  // });
     }, 
     //특정 row 선택
  rowSelection : function(oEvent){
     var perdiumModel = this.getView().getModel("detailPerdium");
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
     //   선택 row
     var perdiumModel = that.getView().getModel("detailPerdium");
     var selectTable = perdiumModel.getProperty("/test");

     // // 상태 필드 확인
     // if(selectTable.){}

     MessageBox.confirm("승인 하시겠습니까?" , {
     actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
     onClose: function (sAction) {
        if(sAction === "OK"){ 
     ////   RFC호출
      that.getOwnerComponent().rfcCall("ZB_SAVE_PERDIUM_DATA", {   
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
       var perdiumModel = that.getView().getModel("detailPerdium");
       var selectTable = perdiumModel.getProperty("/test");
      
       console.log(selectTable);

         that.getOwnerComponent().rfcCall("ZB_REJECT_PERDIUM_DATA", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
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

  }


 });
});