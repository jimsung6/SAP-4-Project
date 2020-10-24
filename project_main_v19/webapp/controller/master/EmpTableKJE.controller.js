//김지언 : 사원정보 마스터
sap.ui.define([
   "sap/base/Log",
   "sap/ui/core/mvc/Controller",
   "sap/ui/model/json/JSONModel",
   "sap/m/MessageToast",
   "sap/ui/core/format/DateFormat",
   "sap/ui/thirdparty/jquery",
   "sap/ui/model/Filter",
   "sap/ui/model/FilterOperator"
], function(Log, Controller, JSONModel, MessageToast, DateFormat, jQuery, Filter, FilterOperator) {
   "use strict";

	return Controller.extend("ExpenseManagement.controller.master.EmpTableKJE", {
		
		onInit : function() {
			
			var oModel = new JSONModel();
			this.getView().setModel(oModel, "employeeKJE");
			
			this.getOwnerComponent().rfcCall("ZB_GET_EMP", {
				//RFC Import 데이터
			}).done(function(oResultData){	// RFC호출 완료
				console.log(oResultData);
				oModel.setData(oResultData);
			}).fail(function(sErrorMessage){// 호출 실패
				alert(sErrorMessage);
			});

			this._oGlobalFilter = null;
        	this._oPriceFilter = null;
		},
		
		onfilter : function(oEvent) {
			
           var filterData = this.getView().getModel("EMP").getProperty("/filterData");

           var aFilter = [];
           
           	if (filterData) {
				aFilter.push(new Filter("ENAME", FilterOperator.Contains, filterData));
			}
			
			// filter binding
			var oList = this.byId("EmpTable");
			var oBinding = oList.getBinding("rows");
			oBinding.filter(aFilter);
            
            
         },
         
         onfilter2 : function(oEvent) {
			
           var filterData2 = this.getView().getModel("EMP").getProperty("/filterData2");

           var aFilter = [];
           
           	if (filterData2) {
				aFilter.push(new Filter("GCODE", FilterOperator.Contains, filterData2));
			}
			
			// filter binding
			var oList = this.byId("EmpTable");
			var oBinding = oList.getBinding("rows");
			oBinding.filter(aFilter);
			
         },
		
		onSwitch : function(oEvent) {
			var SelectedValue = oEvent.getSource().getState();
			var oTable = this.byId("productlist");
			//if문 없애고 3항연산자 써서 해도 됨
			//var sMode = SelectedValue === true ? "Delete" : "SingleSelect" -> oTable.setMode(sMode) 이런식으로 해도 가능쓰
			
			if(SelectedValue === true) {
				oTable.setMode("Delete");
			} else {
				oTable.setMode("None");
			}
		},
		
		// onFilterSearch : function(oEvent) {
		// 	var oFilterData = this.getView().getModel("TEST").getData().filterbar;
		// 	var sDeliveryDate = oFilterData.deliveryDate;
		// 	var sCategory = oFilterData.category;
		// 	//javascript => 객체 내 property로 접근할 때 . 으로 접근 가능하다는 것 잊지 말기
		// 	var iStatus = oFilterData.status;
		// 	var sStatus = "";
			
		// 	if(iStatus === 1) {
		// 		sStatus = "Available";
		// 	}else if(iStatus === 2) {
		// 		sStatus = "Unavailable";
		// 	}

		// 	var aFilterbarFilter = [];
			
		// 	if(sDeliveryDate) {
		// 		aFilterbarFilter.push(new Filter("DateOfSale", FilterOperator.EQ, sDeliveryDate));
		// 	}
		// 		//1파라미터 - 필터 생성할 필드 / 2파라미터 - 필터 생성할 방법 / 3파라미터 - 필터 생성값
		// 	if(sCategory) {
		// 		aFilterbarFilter.push(new Filter("Category", FilterOperator.EQ, sCategory));
		// 	}
			
		// 	if(sStatus) {
		// 		aFilterbarFilter.push(new Filter("Status", FilterOperator.EQ, sStatus));
		// 	}
			
		// 	var aFilter = new Filter({
		// 		filters : aFilterbarFilter,
		// 		and : true
		// 	});
		// 	var oList = this.byId("productlist");
		// 	var oBinding = oList.getBinding("items");
		// 	oBinding.filter(aFilter);
		// },
		
		onChangeComboBox : function(oEvent) {
			var sSelectedKey = oEvent.getSource().getSelectedKey(); //Change 이벤트가 발생했을 때 선택된 키 (우리가 콤보박스에서 선태한 키값)
			var aSelectItems = this.getView().getModel("TEST").getProperty("/selectItems2");
			var aChildren = [];
			
			
			for(var i=0; i<aSelectItems.length; i++) {
				if(sSelectedKey === aSelectItems[i].parentItemCode) {
				   aChildren.push(aSelectItems[i]);
				}
			  this.getView().getModel("TEST").setProperty("/childrenItems", aChildren);
			}
		},
		
		onValueHelp : function(oEvent) {
			var HelpValue = oEvent.getSource().getValue();
			alert(HelpValue);
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