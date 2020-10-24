sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageToast",
	"sap/ui/core/Fragment",
	"sap/ui/core/UIComponent",
	"sap/m/MessageBox",
	"sap/ui/core/routing/History",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"

], function (Controller, MessageToast, Fragment, UIComponent, MessageBox, History, JSONModel, Filter, FilterOperator) {
	"use strict";
	
	return Controller.extend("ExpenseManagement.controller.expenseManagement.List26", {
	
		onInit: function () {
			//달력 초기 세팅
			var oDRS = this.byId("DRS");
			//모델링
			var yesterday = (function(){this.setMonth(this.getMonth()-1); return this}).call(new Date);
			oDRS.setDateValue(yesterday);
			oDRS.setSecondDateValue(new Date());
			
			var oData = {
				oToday:yesterday,
				oToday2:new Date(),
				displayFormat: "yyyy-MM",
				fragInfo : [],
				sRetcode: [],
				sCacnr : [],
				oCacnr: [],
				oRetcode: [],
				oCodhc: [],
				oPcode: [],
				oGcode: [],
				oEmpno: [],
				oStcod: [],
				View: [],
				Mitem: [],
				Oitem: [],
				Sitem: [],
				filterbar: {
					todate: "",
					fromdate: "",
					gcode: "",
					pcode: "",
					empno: "",
					codhc: "",
					index: 1,
					stcod: ""
				}
			};
			
			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "TEST");
	
			this.getOwnerComponent().rfcCall("ZB_EMPNO_98", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
         }).done(function(oResultData){   // RFC호출 완료
        	
            oModel.setProperty("/oEmpno", oResultData.T_ZBMDT0010);
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){
            // 여기다가 rfc 호출후 작업코딩
         });

		this.getOwnerComponent().rfcCall("ZB_GCODE_96", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
         }).done(function(oResultData){   // RFC호출 완료
            oModel.setProperty("/oGcode", oResultData.T_ZBMDT0020);
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){
         });

			this.getOwnerComponent().rfcCall("ZB_PCODE_97", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
         }).done(function(oResultData){   // RFC호출 완료
            oModel.setProperty("/oPcode", oResultData.T_ZBMDT0030);
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){
            // 여기다가 rfc 호출후 작업코딩
         });
         
			this.getOwnerComponent().rfcCall("ZB_CODHC_99", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
         }).done(function(oResultData){   // RFC호출 완료
            oModel.setProperty("/oCodhc", oResultData.T_ZBEXT0030);
         }).fail(function(sErrorMessage){// 호출 실패
           MessageToast.show(sErrorMessage);
         }).then(function(){
            // 여기다가 rfc 호출후 작업코딩
         });
			
			this.getOwnerComponent().rfcCall("ZB_RETCODE_99B", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
         }).done(function(oResultData){   // RFC호출 완료
            oModel.setProperty("/oRetcode", oResultData.T_ZBBUT0001);
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){
            // 여기다가 rfc 호출후 작업코딩
         });
         
			this.getOwnerComponent().rfcCall("ZB_STCOD_99D", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
            }).done(function(oResultData){   // RFC호출 완료
            oModel.setProperty("/oStcod", oResultData.T_ZBEXT0010); //TEST라고 하는 모델에 view라고하는 빈 배열이 있고 거기에 setProperty로 지정
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){	
         	// 여기다가 rfc 호출후 작업코딩
         });
         
        	this.getOwnerComponent().rfcCall("ZB_OITEM_92E", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
            }).done(function(oResultData){   // RFC호출 완료
            oModel.setProperty("/Oitem", oResultData.T_ZBEXT0040); //TEST라고 하는 모델에 view라고하는 빈 배열이 있고 거기에 setProperty로 지정
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){	
         	// 여기다가 rfc 호출후 작업코딩
         });

        	this.getOwnerComponent().rfcCall("ZB_CACNR_99F", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
            }).done(function(oResultData){   // RFC호출 완료
            oModel.setProperty("/oCacnr", oResultData.T_ZBMDT0060); //TEST라고 하는 모델에 view라고하는 빈 배열이 있고 거기에 setProperty로 지정
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){	
         	// 여기다가 rfc 호출후 작업코딩
         });
         
          },
          
          onAfterRendering : function(){
			//뷰가 그려지고 실행됨
			//초기 필터링 작업
			this.onFilterSearch();
		},
		
     handleValueHelp : function(oEvent){
    	var oView = this.getView();
    	var gData = oView.getModel("TEST").getProperty("/filterbar/gcode");
        var i_mode = "";
        
	        if(gData){
	        	i_mode = "A";
	        }else{
	        	i_mode = "B";
	        }
	       
	         this.getOwnerComponent().rfcCall("ZB_EMPNO_98", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
             //RFC Import 데이터
	             I_MODE : i_mode,
	             I_GCODE : gData
	         }).done(function(oResultData){   // RFC호출 완료
	        	oView.getModel("TEST").setProperty("/oEmpno", oResultData.T_ZBMDT0010);
	        	oView.getModel();
	         }).fail(function(sErrorMessage){// 호출 실패
	            MessageToast.show(sErrorMessage);
	         });

            if (!this.byId("empnoDialog")) {
              Fragment.load({
                  id: oView.getId(),
                  name: "ExpenseManagement.view.expenseManagement.khs.Empno",
                  controller: this
              }).then(function (oDialog) {
                  oView.addDependent(oDialog);
                  oDialog.open();
              });
            } else {
              this.byId("empnoDialog").open();
            }
      },
      
      onCloseDialog : function () {
      	var oEid = this.byId("oESpecificData");
      	var oOid = this.byId("oOSpecificData");
      	var oSid = this.byId("oSSpecificData");
      	var oEmpid = this.byId("empnoDialog");
      	
      	if(oEid){
      		oEid.close();
      	} else if(oOid){
      		oOid.close();
      	} else if(oSid){
      		oSid.close();	
      	} else if(oEmpid){
      		oEmpid.close();
      	}
      },
      
		onFilterSearch: function () {
			var oFilterData = this.getView().getModel("TEST").getData().filterbar;
			
			if(oFilterData){
				var sFromDate = oFilterData.fromdate;
				var sToDate = oFilterData.todate;
				var sGcode = oFilterData.gcode;
				//javascript => 객체 내 property로 접근할 때 . 으로 접근 가능하다는 것 잊지 말기
				var iPcode = oFilterData.pcode;
				var sEmpno = oFilterData.empno;
				var gCodhc = oFilterData.codhc;
				var sStcod = oFilterData.index;
				
				if(sStcod !== 1){
					this.getView().getModel("TEST").setProperty("/comboEnable", false);
				}else{
					this.getView().getModel("TEST").setProperty("/comboEnable", true);
				}
			}
			
			   var odata = this.getView().getModel("TEST").getProperty("/oToday");
               var odata2 = this.getView().getModel("TEST").getProperty("/oToday2");
               

			
				if(odata && odata2){
	
					var sFromDate = new Date(odata);
					var sToDate = new Date(odata2);
		   
					var sFromYear = sFromDate.getFullYear();
					var sFromMonth = sFromDate.getMonth()+1 >= 10 ? sFromDate.getMonth()+1 : "0"+(sFromDate.getMonth()+1);
					var sFromDate = sFromDate.getDate() >= 10 ? sFromDate.getDate() : "0"+sFromDate.getDate();
		   
					var sToYear = sToDate.getFullYear();
					var sToMonth = sToDate.getMonth()+1 >= 10 ? sToDate.getMonth()+1 : "0"+(sToDate.getMonth()+1);
					var sToDate = sToDate.getDate() >= 10 ? sToDate.getDate() : "0"+sToDate.getDate();
		   
					// var sFromDateInfo = sFromYear.toString()+sFromMonth.toString()+sFromDate.toString();
					// var sToDateInfo = sToYear.toString()+sToMonth.toString()+sToDate.toString();
					
					var sFromDateInfo = sFromYear.toString()+sFromMonth.toString();
					var sToDateInfo = sToYear.toString()+sToMonth.toString();
				}
			
			var oModel = this.getView().getModel("TEST");
			
			this.getOwnerComponent().rfcCall("ZB_VIEW_91", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
            I_FROMDATE : sFromDateInfo,
            I_TODATE : sToDateInfo,
            I_GCODE : sGcode,
            I_PCODE : iPcode,
            I_CODHC : gCodhc,
            I_EMPNO : sEmpno,
            I_INDEX : sStcod
		 }).done(function(oResultData){   // RFC호출 완료
			for(var i = 0 ; i < oResultData.T_PAYTAB.length ; i++){
				if(oResultData.T_PAYTAB[i].STCOD === "C"){
					oResultData.T_PAYTAB[i].STCOD = "미결"
				}else if(oResultData.T_PAYTAB[i].STCOD === "E"){
					oResultData.T_PAYTAB[i].STCOD = "완결"
				}else{
					oResultData.T_PAYTAB[i].STCOD = "반려"
				}
			}
            oModel.setProperty("/View", oResultData.T_PAYTAB); //TEST라고 하는 모델에 view라고하는 빈 배열이 있고 거기에 setProperty로 지정
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
		 }).then(function(){	// 여기다가 rfc 호출후 작업코딩
			
         });
		},
		
				//Fragment 띄우기
		proOpen : function(oEvent){
			var data = oEvent.oSource.mProperties.text;
			var oModel = this.getView().getModel("TEST");
				oModel.setProperty("/fragData", data);
				
			var sCodhc = "";
			var oView = this.getView();
			var oESpecificData = this.byId("ESpecificData");
			var oOSpecificData = this.byId("OSpecificData");
			var oSSpecificData = this.byId("SSpecificData");
			var that = this;
			this.getOwnerComponent().rfcCall("ZB_OITEM_92E", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
            //RFC Import 데이터
            I_JPNUM : data
         }).done(function(oResultData){   // RFC호출 완료
            oModel.setProperty("/Mitem", oResultData.T_TAB1); //TEST라고 하는 모델에 view라고하는 빈 배열이 있고 거기에 setProperty로 지정
            oModel.setProperty("/Oitem", oResultData.T_TAB2); //TEST라고 하는 모델에 view라고하는 빈 배열이 있고 거기에 setProperty로 지정
            oModel.setProperty("/Sitem", oResultData.T_TAB3); //TEST라고 하는 모델에 view라고하는 빈 배열이 있고 거기에 setProperty로 지정
            sCodhc = oResultData.E_CODHC;
            console.log(oModel.getProperty("/Mitem"));
            switch (sCodhc){
    case "0001" :
			// create dialog lazily
			if (!oESpecificData) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.expenseManagement.khs.EspecificData",
					controller: that
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
					
				});
			} else {
				oESpecificData.open();
			}
        break;
    case "0002" :
 		// create dialog lazily
			if (!oOSpecificData) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.expenseManagement.khs.OspecificData",
					controller: that
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
					
				});
			} else {
				oOSpecificData.open();
			}
        break;
    case "0003" :
        		// create dialog lazily
			if (!oSSpecificData) {
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.expenseManagement.khs.SspecificData",
					controller: that
				}).then(function (oDialog) {
					// connect dialog to the root view of this component (models, lifecycle)
					oView.addDependent(oDialog);
					oDialog.open();
					
				});
			} else {
				oSSpecificData.open();
			}
        break;
		}
         }).fail(function(sErrorMessage){// 호출 실패
            MessageToast.show(sErrorMessage);
         }).then(function(){
         });
		},
		
		         //메인뷰 특정 row 선택
         rowSelection : function(oEvent){
            var payModel = this.getView().getModel("TEST");
               if(oEvent.oSource._aSelectedPaths){
                    var aPath = oEvent.oSource._aSelectedPaths;
                    // console.log(payModel.getProperty("/View"));
                    
                    payModel.setProperty("/test", []); 
                    var selectTable = payModel.getProperty("/test");
                  for(var i=0; i<aPath.length; i++){
                    selectTable.push(payModel.getProperty(aPath[i]));
                  }
              }    
         },
        		// FRAGMENT 특정 row 선택
        onRowSelection : function(oEvent){
	         var sPath = oEvent.mParameters.rowContext.sPath;
	         var oModel = this.getView().getModel("TEST");
	         var selectData = oModel.getProperty(sPath);
	         oModel.setProperty("/oRow",selectData);
      },
         
        	onSave: function () {
        		var that = this;
        		if(this.byId("cbotable").getSelectedContextPaths().length === 0){
        			MessageBox.error("항목을 선택해주세요");
        		}else{
					MessageBox.confirm("지급하시겠습니까?" , {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: function (sAction) {
					   if(sAction === "OK"){
						   MessageToast.show("지급되었습니다");
  	         var payModel = that.getView().getModel("TEST");
             var selectTable = payModel.getProperty("/test");
            ////   RFC호출
                that.getOwnerComponent().rfcCall("ZB_GIV_PAY_90", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
                    //RFC Import 데이터
                    T_GIVTAB : selectTable
                  
                 }).done(function(oResultData){   // RFC호출 완료
                 }).fail(function(sErrorMessage){// 호출 실패
                   MessageToast.show(sErrorMessage);
                 }).then(function(){
                 });
              	   }
					   }
					});}
        	},
						   
			onRet: function (){
			        var that = this;
			    	if(this.byId("cbotable").getSelectedContextPaths().length === 0){
        			MessageBox.error("항목을 선택해주세요");
        		}else{
					MessageBox.confirm("반려하시겠습니까?" , {
					actions: [MessageBox.Action.OK, MessageBox.Action.CANCEL],
					onClose: function (sAction) {
					   if(sAction === "OK"){
						   MessageToast.show("반려되었습니다");
			// var aPath = oEvent.oSource._aSelectedPaths;
                    // console.log(payModel.getProperty("/View"));
             var payModel = that.getView().getModel("TEST");
        	 var selectTable = payModel.getProperty("/test");
             //var retTable = payModel.getProperty("/retData");
             //var rPath = selectTable.length;
             //for(var i=0; i<rPath; i++){
             //    retTable.push(selectTable[i].RETCODE);
             //     }
             //var retData = selectTable.getProperty(rPath+"/RETCODE");
             //console.log(retData);
             //var sRetcode = payModel.getProperty("/oRetcode");
             var oCodeData = that.getView().getModel("TEST").getProperty("/sRetcode");
			 var pRetcode = oCodeData.retcode;
             //console.log(pRetcode);
            ////   RFC호출
                that.getOwnerComponent().rfcCall("ZB_REJ_PAY_92", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
                    //RFC Import 데이터
                    T_RETTAB : selectTable
                 }).done(function(oResultData){   // RFC호출 완료
                 }).fail(function(sErrorMessage){// 호출 실패
                    MessageToast.show(sErrorMessage);
                 }).then(function(){
                 });
         
						   }
					   }
					});}
		},
	
		onSearchChange : function(){
			var searchData = this.getView().getModel("TEST").getProperty("/nameSearch"); 
			
			var aFilter = [];
			
			if (searchData) {
				aFilter.push(new Filter("ENAME", FilterOperator.Contains, searchData));
			}
			// filter binding
			var oList = this.byId("fragTable");
			var oBinding = oList.getBinding("rows");
			oBinding.filter(aFilter);
		},
		
		onAddData : function(){
         var oModel = this.getView().getModel("TEST");
         var empnoData = oModel.getProperty("/oRow/EMPNO");
         oModel.setProperty("/filterbar/empno",empnoData);
         this.byId("empnoDialog").close();
      }

		
	});
});