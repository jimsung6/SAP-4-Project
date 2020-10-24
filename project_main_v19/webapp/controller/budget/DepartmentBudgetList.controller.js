//정은혜 : 부서별 예산 조회
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
], function(Controller, MessageToast, Fragment, UIComponent, MessageBox, History, JSONModel, Filter, FilterOperator) {
	"use strict";
	
	return Controller.extend("ExpenseManagement.controller.budget.DepartmentBudgetList", {
		
		onInit : function() {

			// this.getView().setModel(new JSONModel({
			// 		filterbar : {}
			// 	}), "TEST");

			var oData = {
				DepartmentBudget : [],
				DepartmentInfo : [{
					GCODE : "ALL",
					GNAME : "ALL"
				}],
				filterbar : {
					gname : "",
					gcode : "",
					empno : "",
					ename : ""
				}
			};

			var oModel = new JSONModel(oData);
			this.getView().setModel(oModel, "BUDGET");

		    //var sTearDate = new Date().getFullYear();
		    this.depComboDataCall();
		    
			var sTearDate = new Date();

			// this.getView().getModel("BUDGET").setProperty("/filterbar/Department", "All");
			this.getView().getModel("BUDGET").setProperty("/filterbar/GCODE", "ALL");
			this.getView().getModel("BUDGET").setProperty("/dateData", sTearDate);
			this.getView().getModel("BUDGET").setProperty("/filterbar/ename", "");
			// this.getView().getModel("TEST").setProperty("/filterbar/Month", "All");
			
		},

		onAfterRendering : function(){
			this.onFilterSearch();

		},
		
		// onRowDelete : function(oEvent) {
		// 	var aSelectedIndex = oEvent.getParameter("listItem").getBindingContextPath();
		// 	//mParameters.listItem.oBindingContexts.sPath();
		// 	alert(aSelectedIndex);
		// },
		
		// onDeleteMode : function(oEvent) {
		// 	var SelectedValue = oEvent.getSource().getSelected();
		// 	var oTable = this.byId("productlist");
		// 	//if문 없애고 3항연산자 써서 해도 됨
		// 	//var sMode = SelectedValue === true ? "Delete" : "SingleSelect" -> oTable.setMode(sMode) 이런식으로 해도 가능쓰
			
		// 	if(SelectedValue === true) {
		// 		oTable.setMode("Delete");
		// 	} else {
		// 		oTable.setMode("None");
		// 	}
		// },
	
		onFilterSearch : function(oEvent) {
			//날짜 변수/rfc 변수 
			var BModel = this.getView().getModel("BUDGET");
			var dateData = BModel.getProperty("/dateData");
			var yearyyyy = dateData.getFullYear();
			var monthmm = dateData.getMonth()+1 >= 10 ? dateData.getMonth()+1 : "0"+(dateData.getMonth()+1);
			var ymyyyymm = yearyyyy+monthmm.toString();
			// var sumData = BModel.getProperty("/DEPPR"); 
			var that = this;

			var GcodeData = this.getView().getModel("BUDGET").getProperty("/filterbar/gname");
			if(GcodeData === "ALL"){
				GcodeData = "";
			}
			
			//rfc 호출
			this.getOwnerComponent().rfcCall("ZB_BUDGET_DEPA", {  
				// 본인이 호출하고 싶은 RFC명 입력. 
				I_BUDYM : ymyyyymm,
				I_GCODE : GcodeData                                                       
			 }).done(function(oResultData){   // RFC호출 완료
				console.log(oResultData);
				BModel.setProperty("/DepartmentBudget", oResultData.T_DEPBU);

			 }).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			 }).then(function(){
				// 여기다가 rfc 호출후 작업코딩
				BModel.refresh();
				that.getView().byId("ToolbarId").setVisible(true);
				that.getView().byId("dbudgetlist").removeSelections();

				var DepartmentBudget = BModel.getProperty("/DepartmentBudget");
				
				
				//날짜포맷
				
				for(var i=0; i<DepartmentBudget.length; i++){
					
					var budym = DepartmentBudget[i].BUDYM;
					var yyyy = budym.substring(0,4);
					var mm = budym.substring(4);
					BModel.setProperty("/DepartmentBudget/"+i+"/BUDYM", yyyy+"-"+mm);
	
				}
				
				
				var sumData = 0;
				for(var i = 0 ; i < DepartmentBudget.length ; i++){
					sumData += parseInt(DepartmentBudget[i].DEPPR);
				}
				BModel.setProperty("/sumData", sumData);
				BModel.setProperty("/currency", "KRW");
				
			 });

			// if(TESTModel.getProperty("/filterbar/Department")){
			// 	var sDepartment = TESTModel.getProperty("/filterbar/Department");
			// 	if(sDepartment === "All") sDepartment = ""
			// }
			// if(TESTModel.getProperty("/filterbar/Year")){
			// 	var sYear = TESTModel.getProperty("/filterbar/Year");
			// }
			// if(TESTModel.getProperty("/filterbar/Month")){
			// 	var sMonth = TESTModel.getProperty("/filterbar/Month");
			// 	if(sMonth === "All") sMonth = ""
			// }

			//javascript => 객체 내 property로 접근할 때 . 으로 접근 가능하다는 것 잊지 말기

	
		},


		// onSelectionChange : function(oEvent){

		// 	var aEvent = oEvent.oSource._aSelectedPaths;
		// 	var sumData = 0;
			
			// for(var i=0 ; i < aEvent.length ; i++){
			// 	sumData += parseInt(this.getView().getModel("BUDGET").getProperty(aEvent[i]+"/DEPPR")); 
			// }

		// 	this.getView().getModel("BUDGET").setProperty("/sumData", sumData);

		// 	if( !sumData ){
		// 		this.getView().byId("ToolbarId").setVisible(true);
		// 	}else{
		// 		this.getView().byId("ToolbarId").setVisible(true);
		// 	}

		// },
				
		depComboDataCall : function(){
			var oModel = this.getView().getModel("BUDGET");
			var DepacrtmentInfo = oModel.getProperty("/DepartmentInfo");
	
			//부서 rfc 호출
			this.getOwnerComponent().rfcCall("ZB_GCODE_96", {  
				// 본인이 호출하고 싶은 RFC명 입력. 
			 }).done(function(oResultData){   // RFC호출 완료
				for(var i=0 ;  i < oResultData.T_ZBMDT0020.length ; i++){
					DepacrtmentInfo.push(oResultData.T_ZBMDT0020[i]);
				}
			 }).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			 }).then(function(){
				oModel.refresh();
			 });
		},
		
		onLiveChange : function(){
			var searchData = this.getView().getModel("BUDGET").getProperty("/filterbar/eName");
		   
		   	var aFilter = [];
		   	
			if (searchData) {
				aFilter.push(new Filter("ENAME", FilterOperator.Contains, searchData));
			}

			// filter binding
			var oList = this.byId("dbudgetlist");
			var oBinding = oList.getBinding("items");
			oBinding.filter(aFilter);
			
			var DepartmentBudget = this.getView().getModel("BUDGET").getProperty("/DepartmentBudget");
			var sumData = 0;
			
			
			
			for(var i=0 ; i < DepartmentBudget.length ; i++){
				if(DepartmentBudget[i].ENAME.
				indexOf(searchData)!= -1){
					sumData += parseInt(DepartmentBudget[i].DEPPR);
				}
			}
			
			this.getView().getModel("BUDGET").setProperty("/sumData", sumData);
			
		}
	
	});
});


/* 		우리가 TableExample을 실행하는 과정
 * 		: 일단 Table을 만들고, model을 만든 후 view와 바인딩함. (우리는 지금 모델에 이름 안 줌, 그러므로 view의 default모델을 우리가 생성한 모델이 되는 것)
 * 		    우리가 보는 메인 페이지 view는 List.view임
 * 		  List.view에 link를 생성해서 누르면 Detail Dialog가 뜨게 만듦 -> 이렇게 되면 List.controller에서 link press에 선언된 함수가 정의되어 있어야 함
 * 		  List.view에서 Row를 선택 -> 상세버튼 누름 -> 버튼에 연결된 함수가 list.controller로 연결되고 detail.view를 라우팅해서 보여줌
 * 		    근데 Detail.view를 보여주려고 routing을 하는 건데 Detail.controller는 대체 왜 필요함? 안 만들어도 상관없는 거 아닌가 (의문) 왜 1대1이어야만 하낭,,
 */		


/*		 Event의 출발점 
 * 		: this.getView().getModel(); -> 연결된 View의 Model 가져옴 
 *		  Model 내의 Javascript Data를 가져오고 싶음 -> oModel.getProperty("path(가져올 데이터의 경로)");
 *		  근데 우리 예제에서는 Event가 2개 발생함, 링크를 클릭했을 때 뜨는 Dialog와 상세 버튼을 클릭했을 때 뜨는 Datail.view 2개
 *		 상세 버튼을 클릭했을 때 뜨는 Detail.view를 위한 Path는 sPath = oEvent.mParameters.rowContext.sPath; 요런식으로 가져옴 
 *		 링크 클릭 시 뜨는 Detail Dialog의 path는 sPath = oEvent.getSource().getBindingContext().getPath(); 요런식으로 가져오는 경우 多
 *		 디버깅 해서 Path 찾는 법, 모델의 데이터가 잘 들어왔는지, getProperty를 하면 데이터를 잘 가져오는지 등을 확인하는 습관을 들이는 게 좋음 ****		
 */