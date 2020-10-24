sap.ui.define([], function() {
	"use strict";
	
	return {
		
		changeDateFormat : function(sDate) {
			if(sDate){
				//var oDate = new Date(sDate);
				
	 			//return (oDate.getMonth()+1)+"."+oDate.getDate()+"."+oDate.getFullYear();
				var oDate = sDate.split("-");
				return oDate[2]+"."+oDate[1]+"."+oDate[0];
				
			}else{
				var oToday = new Date();
				var iTodayYear = oToday.getFullYear();
				var iTodayMonth = oToday.getMonth()+1;
				var iTodayDate = oToday.getDate();
				
				var oTodayFin = (iTodayMonth<10 ? "0" +iTodayMonth : iTodayMonth) + "." + (iTodayDate<10 ? "0"+iTodayDate : iTodayDate) + "." + iTodayYear;
				return oTodayFin;
			}
		
		}
	};
});