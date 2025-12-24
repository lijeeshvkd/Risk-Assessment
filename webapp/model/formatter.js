sap.ui.define([], () => {
	"use strict";

	return {
		statusText(sStatus) {
			switch (sStatus) {
				case "00":
					return "Void";
				case "01":
					return "New";
				case "02":
					return "In Process";
                case "03":
					return "Closed";
				default:
					return sStatus;
			}
		}, 

        getStatusCode(sStatusText) {
			switch (sStatusText) {
				case "Void":
					return "00";
				case "New":
					return "01";
				case "In Process":
					return "02";
                case "Closed":
					return "03";
				default:
					return sStatus;
			}
		},

		formatRiskLevel: function(sRisklevel) {
			var sReturn = "",
				sFinalReurn = "";

			if (sRisklevel) {
				if (parseInt(sRisklevel) >= 1 && parseInt(sRisklevel) <= 4 ) {
					sReturn = sReturn + " Acceptable";
				} else if (parseInt(sRisklevel) >= 5 && parseInt(sRisklevel) <= 10 ) {
					sReturn = sReturn + " Further Review";
				} else if (parseInt(sRisklevel) >= 12 && parseInt(sRisklevel) <= 25 ) {
					sReturn = sReturn + " Unacceptable Risk";
				} else {
					sReturn = "";
				}
			}
			
			if (sReturn) {
				sFinalReurn = sRisklevel + " -" + sReturn;
			}

			return sFinalReurn.trim();
		}
	};
});