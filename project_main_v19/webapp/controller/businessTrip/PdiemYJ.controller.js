// 전여정 : 출장비 지급
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

			
			return Controller.extend("ExpenseManagement.controller.businessTrip.PdiemYJ", {

                   onInit : function() {
                   	
					//실행버튼  이름 바꾸기
					var oFilter = this.getView().byId("objectFilterYJ"),
         			that = this;
        	 		oFilter.addEventDelegate({
	            		"onAfterRendering": function(oEvent) {
		               		var oResourceBundle = that.getOwnerComponent().getModel("i18n").getResourceBundle();
		               		var oButton = oEvent.srcControl._oSearchButton;
		               		oButton.setText(oResourceBundle.getText("조회"));
		            			}
	        			 });
	        			 
					// 모델링
				      var yesterday = (function(){this.setDate(1); return this}).call(new Date);
                	  var oData = {
                			  oToday: yesterday,
							  oToday2: new Date(),
							  displayFormat: "yyyy.MM",
							  oCAC: [],
							 selectTableData : [],
							 pay : {emppay:""},
							 fragInfo : [],
							 accountData : [],
							 paybtn: false
                	      };
	                	var oModel= new JSONModel(oData);  
						this.getView().setModel(oModel , "PaymentJYJ");
						this.getView().setModel(new JSONModel({
												    "RequestListJYJ": []
												 }), "pdiemJYJ");
						
						//근무연월 설정                    
		               var todayDate = new Date();
		               var yyyy = todayDate.getFullYear();
		               var mm = todayDate.getMonth()+1 >= 10 ? todayDate.getMonth()+1 : "0"+(todayDate.getMonth()+1) ;
		               this.getView().getModel("PaymentJYJ").setProperty("/oToday", yyyy+"-"+mm);			 
						
					    //라디오버튼
						this.getView().getModel("PaymentJYJ").setProperty("/RadioButtonGroup", 1);
						
						this.getView().getModel("pdiemJYJ").setProperty("/visibleComboData", false);
						this.getView().getModel("pdiemJYJ").setProperty("/visibleTextData", true);
						
						this.detailComboDataCall();
					   },
					   
					   onAfterRendering : function(){
					   	 
					   	 this.onFilterBarSearch();
					   	 this.accountRFC();
					   	 
					   	
					   },
					   
					   onPageBack : function(){
						var oHistory  = new History.getInstance();
						var sPreviousHash = oHistory.getPreviousHash();
			
						if (sPreviousHash !== undefined) {
							window.history.go(-1);
						} else {
							var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
							oRouter.navTo("home");
						}
					},
				
					 onFilterBarSearch : function(oEvent) {
				 		var that = this;
						var oModel = this.getView().getModel("PaymentJYJ");
	                    var sDateInfo = oModel.getProperty("/oToday").replace("-", "");  
	                    var EMPNO = oModel.getProperty("/inputData");
						
						if(!EMPNO){
							EMPNO = "";
						}
							
						var RadioButtonGroup = this.getView().getModel("PaymentJYJ").getProperty("/RadioButtonGroup");
						var RadioButtonGroupData = "";

						if( RadioButtonGroup === 1 ){
							RadioButtonGroupData="B";
						}else if(RadioButtonGroup === 2){
							RadioButtonGroupData="D";
						}
					
					    	var that = this;
							var mEmployee = this.getView().getModel("pdiemJYJ");
							var Request = mEmployee.getProperty("/RequestListJYJ");
							
							console.log(EMPNO+"/"+sDateInfo+"/"+RadioButtonGroupData );
							
							
							
							 this.getOwnerComponent().rfcCall("ZB_GET_PAYMENT", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
						        //RFC Import 데이터
						        I_EMPNO : EMPNO,
						        I_WORKYM: sDateInfo,
						        I_MODE: RadioButtonGroupData
						          
						     }).done(function(oResultData){   // RFC호출 완료
						    	console.log(oResultData.T_PDIEM);
						    	for(var i=0 ; i < oResultData.T_PDIEM.length ; i++){
						    		var yyyy = oResultData.T_PDIEM[i].WORKYM.substring(0, 4); 
						    	    var mm = oResultData.T_PDIEM[i].WORKYM.substring(4, 6);
						    	    oResultData.T_PDIEM[i].WORKYM = yyyy +"-"+ mm;
						    	    oResultData.T_PDIEM[i].PDIEM = parseInt(oResultData.T_PDIEM[i].PDIEM) * 100;
						    	}
						    	 mEmployee.setProperty("/RequestListJYJ", oResultData.T_PDIEM);
						    	
					     }).fail(function(sErrorMessage){// 호출 실패
					        alert(sErrorMessage);
					     }).then(function(){
					     	var radioData = oModel.getProperty("/RadioButtonGroup");
							if( radioData === 1 ){
								that.byId("perdiemJYJ").setMode("MultiSelect");
								that.getView().getModel("pdiemJYJ").setProperty("/visibleComboData", true);
								that.getView().getModel("pdiemJYJ").setProperty("/visibleTextData", false);
								oModel.setProperty("/paybtn" , true );
							} else {
								that.getView().getModel("pdiemJYJ").setProperty("/visibleComboData", false);
								that.getView().getModel("pdiemJYJ").setProperty("/visibleTextData", true);
								that.byId("perdiemJYJ").setMode("None");
						    	oModel.setProperty("/paybtn" , false );
							}
					
					     	mEmployee.refresh();
					     	//that.searchChange();
					     	// .onFilterBarSearch();
					        // 여기다가 rfc 호출후 작업코딩
					        // console.log(mEmployee.getProperty("/RequestListJYJ"));
					        that.getView().byId("perdiemJYJ").removeSelections();
					     });
		
					},
				  
				  onSelectionChange : function(oEvent){
					  	var pathData = oEvent.oSource._aSelectedPaths;
					  	var JYJModel = this.getView().getModel("PaymentJYJ");
					  	var pdiemModel = this.getView().getModel("pdiemJYJ");
					  	var selectData = JYJModel.getProperty("/selectTableData");
					  	
						  	selectData.splice(0, selectData.length);
						  	
						  	for(var i=0 ; i < pathData.length; i++){
						  		selectData.push(pdiemModel.getProperty(pathData[i]));
						  	}
						  	JYJModel.refresh();         
						  	console.log(selectData);
				  },
				  
				  	  onClickPayment: function(oEvent){   
				  	  	  var oTable = this.getView().byId("perdiemJYJ");
				    	  //var iSelectedIndex = oTable.getSelectedIndex();
				        	var that = this;
							var JYJModel = this.getView().getModel("PaymentJYJ");
							var selectData = JYJModel.getProperty("/selectTableData");
							console.log(selectData);
				    	if(selectData.length == 0){
				    		MessageBox.error("데이터를 선택해주세요.");
								return;
			    		}
				    	   //선택했을 때는 index(0.1.2...5), 선택하지 않았을 때는 -1
						for(var i=0; i<selectData.length; i++){
							if(!selectData[i].CACCT){
								MessageBox.error("회사계좌를 선택해주세요.");
								return; //멈춘다
		    				}
			    		 }
			    		 MessageBox.confirm("지급하시겠습니까?" , {
							actions:[MessageBox.Action.YES, MessageBox.Action.NO],
							onClose: function(sAction) {
									var mEmployee = that.getView().getModel("pdiemJYJ");
									
							switch(sAction){
								case "YES" : 
									 var RequestListJYJ = mEmployee.getProperty("/RequestListJYJ");
									 
								 for(var i=0 ; i < selectData.length ; i++){
						    		var yyyy = selectData[i].WORKYM.substring(0, 4); 
						    	    var mm = selectData[i].WORKYM.substring(5);
						    	    selectData[i].WORKYM = yyyy.toString()+mm.toString();
						    	    selectData[i].PDIEM = parseInt(selectData[i].PDIEM) / 100;
						    	    selectData[i].CACCT2 = selectData[i].CACCT
						    	    for(var j=0 ; j < JYJModel.getProperty("/accountData").length ; j++ ){
						    	    	if(selectData[i].CACCT2 === JYJModel.getProperty("/accountData/"+j+"/CACCT")){
						    	    		selectData[i].BANKL = JYJModel.getProperty("/accountData/"+j+"/BANKL");
						    	    	}
						    	    }
						    	}
						    	console.log(selectData);
									
									that.getOwnerComponent().rfcCall("ZB_SAVE_PAYMENT", {	
										// 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
										//RFC Import 데이터
										T_PDIEM: selectData
									}).done(function(oResultData){	// RFC호출 완료
										console.log(oResultData);
										switch(oResultData.E_RETURN.TYPE){
											case "S" : 
												MessageBox.success("지급 완료");
												
												
												break;
											case "E" : 
												MessageBox.error("지급 실패");
												break;
										}
										}).fail(function(sErrorMessage){// 호출 실패
											alert(sErrorMessage);
										}).then(function(){
											that.onFilterBarSearch();
										});
										break;
								}
							}			
						});
			  		 },
			  		 
			 handleValueHelp : function(oEvent){
			 	
			 	console.log("handleValueHelp");
	            // var targetData = target.replace("__table0-rows-row","").trim();
	            var oView = this.getView();

	            if (!this.byId("helloDialog")) {
	               Fragment.load({
	                  id: oView.getId(),
	                  name: "ExpenseManagement.view.businessTrip.detail_YJ",
	                  controller: this
	               }).then(function (oDialog) {
	                  oView.addDependent(oDialog);
	                  oDialog.open();
	               });
	            } else {
	               this.byId("helloDialog").open();
	            }
		      },
		      
		      onCloseDialog : function () {
				   var oModel = this.getView().getModel("PaymentJYJ");
				   oModel.setProperty("/inputData", "");
				   this.byId("helloDialog").close();
			   },
			   
			   onAddData : function(){
			   	   // var oModel = this.getView().getModel();
				   // this.byId("helloDialog").close();
				   var oModel = this.getView().getModel("PaymentJYJ");
				   var empnoData = oModel.getProperty("/oRow/EMPNO");
				   oModel.setProperty("/inputData", empnoData);
				   this.byId("helloDialog").close();
			   },
			   
			   detailComboDataCall : function(){
			   		var oModel = this.getView().getModel("PaymentJYJ");
			   	
				   	this.getOwnerComponent().rfcCall("ZB_GCODE_96", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
					   //RFC Import 데이터
					}).done(function(oResultData){   // RFC호출 완료
						console.log(oResultData);
					   var odata = oModel.setProperty("/comboDataItems", oResultData.T_ZBMDT0020)
	
					
					}).fail(function(sErrorMessage){// 호출 실패
					   alert(sErrorMessage);
					}).then(function(){
					   // 여기다가 rfc 호출후 작업코딩
					});
			   },
			   
			   onSearch : function(){
   
				   var oModel = this.getView().getModel("PaymentJYJ");
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
				
				// 프레그먼트 서치필드 라이브체인지 이벤트
				onSearchChange : function(){
				   var SearchFiled = this.getView().getModel("PaymentJYJ").getProperty("/nameSearch");
				   // build filter array
				   var aFilter = [];
				
				   if (SearchFiled) {
				      aFilter.push(new Filter("ENAME", FilterOperator.Contains, SearchFiled));
				   }
				
				   // filter binding
				   var oList = this.byId("fragTable");
				   var oBinding = oList.getBinding("rows");
				   oBinding.filter(aFilter);
				
				
				},
				
				onRowSelection : function(oEvent){
				   var sPath = oEvent.mParameters.rowContext.sPath;
				   var oModel = this.getView().getModel("PaymentJYJ");
				   var selectData = oModel.getProperty(sPath);
					console.log(selectData);
				   oModel.setProperty("/oRow",selectData);
				 
				},
				
				accountRFC : function(){
					var oModel = this.getView().getModel("PaymentJYJ");
					this.getOwnerComponent().rfcCall("ZB_ACCOUNT_PAYMENT", {   // 본인이 호출하고 싶은 RFC명 입력. 여기서는 예제로 zbsfm20_03를 사용
				     
				   }).done(function(oResultData){   // RFC호출 완료
				     console.log(oResultData);
				     oModel.setProperty("/accountData", oResultData.TAB1);
				   }).fail(function(sErrorMessage){// 호출 실패
				      alert(sErrorMessage);
				   }).then(function(){
				      // 여기다가 rfc 호출후 작업코딩
				   });
				}
				  
			   
			});

		});