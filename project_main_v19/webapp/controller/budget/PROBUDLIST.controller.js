sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/MessageToast",
		"sap/ui/core/Fragment",
	"sap/ui/model/json/JSONModel",
	 "sap/ui/model/Filter",
	 "sap/ui/model/FilterOperator"
 ], function (Controller, MessageBox, MessageToast, Fragment, JSONModel, Filter, FilterOperator ) {
	"use strict";
 
	return Controller.extend("ExpenseManagement.controller.budget.PROBUDLIST", {
	   
	   // 테이블 안에 들어가는 정보
	   onInit : function(){
		  
		var oFilter = this.getView().byId("payFilter"),
		  that = this;
			 var oData = {
			
				info : [],
			
				
				filterTable : [],
				   filterbar: {
				
				    fromdate: "",
					pname : "",
					pcode : ""
					 }
					 
					 
				 };
				var oModel = new JSONModel(oData);
		   	    this.getView().setModel(oModel, "TEST");
		  
				this.getView().getModel("TEST").setProperty("/RadioButtonGroup", 0);

 			this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
        	this._oRouter.attachRouteMatched(this.onAfterRendering, this);
 
			},
			
			onDetail : function(event){
				
				var pathData = event.oSource.oBindingContexts.TEST.sPath;
				
				var PCODE = this.getView().getModel("TEST").getProperty(pathData+"/PCODE");
				var STATUS = this.getView().getModel("TEST").getProperty(pathData+"/STATUS");
			
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				oRouter.navTo("PROBUDDETAIL_MS", {
					DATA : PCODE+","+STATUS
				});
			
			
			},
			
	   onAfterRendering : function(){
	   //랜더링후 필터링 처리작업
		   this.onFiltering();
		   this.onFilter();
	   
	   },
	   
		onFilter : function (oEvent) {
			var oModel = this.getView().getModel("TEST");
			var searchInfoPname = oModel.getProperty("/searchInfoPname");
	

			var aFilter = [];
			//프로젝트명
			if( searchInfoPname ){
				aFilter.push(new Filter("PNAME", FilterOperator.Contains, searchInfoPname));
			}
		
			//Filter
			var oList = this.byId("TEST");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
		},
		
		onFiltering : function(){
			 var oModel = this.getView().getModel("TEST"); 
	
					
			var RadioButtonGroup = oModel.getProperty("/RadioButtonGroup");
			
		//	var RadioButtonGroupData = "";
			
			var toDay = new Date();
			
			var yyyy = toDay.getFullYear();
			var mm = toDay.getMonth()+1 >= 10 ? toDay.getMonth()+1 : "0"+(toDay.getMonth()+1);
			var dd = toDay.getDate() >= 10 ? toDay.getDate() : "0"+toDay.getDate();
			
			toDay = yyyy.toString()+mm.toString()+dd.toString();
			
		
	 
		   this.getOwnerComponent().rfcCall("ZB_BUDGET_PRO", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 ZB_HEADER_SEARCH를 사용
				// I_SDATE : sFromDateInfo,
				 I_EDATE : toDay,
				 I_MODE: RadioButtonGroup
				//RFC Import 데이터
			}).done(function(oResultData){   // RFC호출 완료
			  console.log(oResultData);
			  oModel.setProperty("/info", oResultData.T_PROBU);
			}).fail(function(sErrorMessage){// 호출 실패
			  alert(sErrorMessage);
			}).then(function(){
							
			});
 
	
 
	
	},
		proOpen2 : function(oEvent){
			var oView = this.getView();
			var oModel = oView.getModel("TEST");
			var sPath = oEvent.getSource().getBindingContext("TEST").getPath();
			var oSelectData = oModel.getProperty(sPath);
			oModel.setProperty("/projectData",oSelectData);
			//create dialog 
			if(!oView.byId("ProjectForm")) {
				var oFragmentController = {
						onCloseDialog : function(){
							oView.byId("ProjectForm").close();
							 oModel.setProperty("/projectData",null);
						}
				};
				// load asynchronous XML fragment
				Fragment.load({
					id: oView.getId(),
					name: "ExpenseManagement.view.budget.ProjectForm2",
					controller : oFragmentController
				}).then(function(oDialog){
					oView.addDependent(oDialog);
					oDialog.open();
				});
				//Fragment.load().then()
			} else{
				oView.byId("ProjectForm").open();
			}
			var PNAME = oSelectData.PNAME;
				this.getOwnerComponent().rfcCall("ZB_GET_DETAIL_PROJECT",{
					I_PNAME : PNAME
				}).done(function(oResultData){
					// RFC호출 완료
					console.log(oResultData.ZBPTAB3);
					oModel.setProperty("/projectData", oResultData.ZBPTAB3);
				}).fail(function(sErrorMessage){
					// 호출 실패
					alert(sErrorMessage);
				});

		},

	
  	onLiveChange : function(){
			var searchData = this.getView().getModel("TEST").getProperty("/filterbar/PName");
		   
		   	var aFilter = [];
		   	
			if (searchData) {
				aFilter.push(new Filter("PNAME", FilterOperator.Contains, searchData));
			}

			// filter binding
			var oList = this.byId("pbudgetlist");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			
			var DepartmentBudget = this.getView().getModel("TEST").getProperty("/info");
			var sumData = 0;
				
					for(var i=0 ; i < info.length ; i++){
				if(info[i].PNAME.
				indexOf(searchData)!= -1){
				
				}
			}
			
		
			
		}
 
 
 });
 });