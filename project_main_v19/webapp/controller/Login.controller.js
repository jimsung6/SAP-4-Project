sap.ui.define([
   "sap/base/Log",
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageBox",
   "sap/m/MessageToast",
   "sap/ui/core/format/DateFormat",
   "sap/ui/thirdparty/jquery"
], function(Log, Controller, JSONModel, MessageBox, MessageToast, DateFormat, jQuery) {
   "use strict";

   return Controller.extend("ExpenseManagement.controller.Login", {
      
         onInit : function(){
                // ID, PASSWARD 받기
            this.getView().setModel(new JSONModel({
               id : "",
               password : ""
            }), "login");
            
            this.getView().getModel("login").setProperty("/id", 20101200001);
            this.getView().getModel("login").setProperty("/password", 1314);

            console.log("app onInit");

         },

         onBeforeRendering : function(){
				//this.logInfoCheck();
			},
         
         onExit : function(){
            console.log("app onExit");
         },

         // logInfoCheck : function(){
			// 	//log 정보 확인
			// 	var logData = this.getOwnerComponent().getCookiy("EMPNO");
			// 	var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				
         //        if(logData){
         //            oRouter.navTo("mainBoard"); 
         //        }
			// },
         
         onLogin : function () {         // 로그인 버튼 클릭
            var that = this;
            var oModel = this.getView().getModel("login");   
            var sId = oModel.getProperty("/id");            //ID
            var sPassword = oModel.getProperty("/password");   //PASSWARD

            var oEmployeeLog = this.getView().getModel("employeeLog");
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            
            //RFC호출    
            this.getOwnerComponent().rfcCall("ZB_LOGIN", {
               //RFC Import 데이터
               I_ID: ""+sId,
               I_PW: ""+sPassword
            }).done(function(oResultData){   // RFC호출 완료
               console.log(oResultData);
               var logInfo = oResultData.T_EMP[0]

               for(var pro in logInfo){
                  that.getOwnerComponent().setCookiy(pro, logInfo[pro]);
               }

               for(var pro in logInfo){
                   console.log(that.getOwnerComponent().getCookiy(pro));
               }
               //에러코드 저장
               oEmployeeLog.setProperty("/Type", oResultData.E_RETURN);
            }).fail(function(sErrorMessage){// 호출 실패
               alert(sErrorMessage);
            }).then(function(){
               var Type =    oEmployeeLog.getProperty("/Type");
               var nameData = that.getOwnerComponent().getCookiy("ENAME");
               var jobData = that.getOwnerComponent().getCookiy("AUCODE");

               if( Type.TYPE === "E" ) {   // 로그인 성공 여부
                  MessageBox.error("다시 확인하여 주시기 바랍니다.");
               }else if( Type.TYPE === "S" ){
                  // MessageToast.show("로그인 되었습니다.");
                  if(nameData){
                     oEmployeeLog.setProperty("/loginName", nameData);
               } 
                  //menuSetting 함수 콜
                  that.getOwnerComponent().menuSetting();      
                  oRouter.navTo("mainBoard"); //회계부서 승인권한자
            }
            
         });
        }
        
   });
});