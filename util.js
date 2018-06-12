//stack overflow
module.exports.isNumeric = function(in_string){
	var localString = "" + in_string;
	return ((in_string - 0) == in_string) && (0 < localString.trim().length);
}

//result is greater than or equal to zero
module.exports.cooerceNumeric = function(in_string){
	var result = (in_string - 0);
	if ((true === Number.isNaN(result)) || (result < 0)){
		result = 0;
	}
	return result;
}

// Identifiers MUST comprise only ASCII alphanumerics and hyphen
//[a-zA-Z0-9%-]
module.exports.cleanString = function(in_string){
	if (undefined === in_string){
		return "";
	}
	const regex = new RegExp("[^a-zA-Z0-9\-]", "g");
	const cleanString = ("" + in_string).replace(regex, "");
	return cleanString;
}

