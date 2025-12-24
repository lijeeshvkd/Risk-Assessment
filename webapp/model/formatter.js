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

		formatRiskLevel: function(sRisklevel, sLikelihood, sSeverity) {
			var sReturn = "",
				sFinalReurn = "";

			if (sLikelihood) {
				switch (sLikelihood.trim()) {
					case '1':
						sReturn = sReturn + " Acceptable";
						break;
					case '2':
						sReturn = sReturn + " Further Review";
						break;
					case '3':
						sReturn = sReturn + " Unacceptable Risk";
						break;
					default:
						break;
				}
			}

			if (sSeverity) {
				switch (sSeverity.trim()) {
					case '1':
						sReturn = sReturn + " Acceptable";
						break;
					case '2':
						sReturn = sReturn + " Further Review";
						break;
					case '3':
						sReturn = sReturn + " Unacceptable Risk";
						break;
					default:
						break;
				}
			}
			
			if (sReturn) {
				sFinalReurn = sRisklevel + " -" + sReturn;
			}

			return sFinalReurn.trim();
		},

		formatRiskLevelState: function(sRisklevel) {
			var sReturn = "None";

			if (sRisklevel && (parseInt(sRisklevel) >= 1 && parseInt(sRisklevel) <= 4) ) {
				sReturn = "Success";
			} else if (sRisklevel && (parseInt(sRisklevel) >= 5 && parseInt(sRisklevel) <= 10) ) {
				sReturn = "Warning";
			} else if (sRisklevel && (parseInt(sRisklevel) >= 12 && parseInt(sRisklevel) <= 25) ) {
				sReturn = "Error";
			} else {
				sReturn = "None";
			}

			return sReturn;
		}
	};
});