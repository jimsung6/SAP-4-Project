sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/m/MessageBox",
   "sap/ui/core/routing/History"
], function(Controller, JSONModel, MessageToast, MessageBox, History) {
   "use strict";

 return Controller.extend("ExpenseManagement.controller.budget.PROBUDDETAIL", {
 	onNavBack : function() {
				window.history.go(-1);
				this.byId("TEST").clearSelection(true);
		},
		
      onInit: function() {
      	
      	this.getView().setModel(new JSONModel({
      		detailTableData : []
      	}), "detailModel");
         //var oGoodsModel = new JSONModel();
         //this.getView().setModel(oGoodsModel, "TEST");
         
         //this.getOwnerComponent().rfcCall("ZB_BUDGET_PRO", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
         //   //RFC Import 데이터
         //   I_PNAME: ''
         //}).done(function(oResultData){   // RFC호출 완료
         //   console.log(oResultData);
         //   oGoodsModel.setData(oResultData);
         //   // oModel.setDefaultBindingMode(oResultData);
         //   // that.
         //}).fail(function(sErrorMessage){// 호출 실패
         //   alert(sErrorMessage);
         //});
         var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
         oRouter.getRoute("PROBUDDETAIL_MS").attachPatternMatched(this._onObjectMatched, this);
         
         //oRouter.attachRouteMatched(this.onBeforeRendering, this);
         
      },
      
      
       _onObjectMatched: function (oEvent) {
         if(oEvent.mParameters){
            var DATA = oEvent.mParameters.arguments.DATA;
            
            var realData = DATA.split(",");
            this.getView().getModel("detailModel").setProperty("/pcode", realData[0]);
            this.getView().getModel("detailModel").setProperty("/status", realData[1]);
			this.callDetailRFC();
         }
   
       },
       
       
       callDetailRFC : function(){
       		MessageToast.show("hi")
       		var oModel = this.getView().getModel("detailModel");
       		var i_pcode = oModel.getProperty("/pcode");
       		var i_status = oModel.getProperty("/status");
       		
       		this.getOwnerComponent().rfcCall("ZB_BUDGET_PRO_DETAIL", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
				I_PCODE : i_pcode,
				I_STATUS : i_status
			//RFC Import 데이터
			   
			}).done(function(oResultData){   // RFC호출 완료
			  oModel.setProperty("/detailTableData", oResultData.T_PROBUDE);
			}).fail(function(sErrorMessage){// 호출 실패
			   alert(sErrorMessage);
			}).then(function(){
				 oModel.refresh();
			});
       }
       
      	
		
			 
 
 
 
 
 
			
	
	//   onInit : function(){
	//   var oModel = this.getView().getModel("TEST"); 

 //var oData = {
		
	// 			PROBUD : []
	 			
	
	// 			 };
	
 

 
	//  //테이블 필드 내역 
	// 	  this.getView().setModel(oModel, "TEST");
	// 	   this.getOwnerComponent().rfcCall("ZB_BUDGET_PRO_DETAIL", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
		
	// 		//RFC Import 데이터
		
		   
			   
	// 		}).done(function(oResultData){   // RFC호출 완료
			  
	// 		   oModel.setProperty("/info", oResultData.T_PROBUDE);
	// 		}).fail(function(sErrorMessage){// 호출 실패
	// 		   alert(sErrorMessage);
	// 		}).then(function(){
	// 			   console.log(oModel.getProperty("/info"));
	// 		});
 
	
 
	
	// }
 
 
 });
 
});