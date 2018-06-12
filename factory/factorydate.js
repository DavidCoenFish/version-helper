const sModuleNameDate = "factorydate"; //is there a better way to get module name
module.exports.name = sModuleNameDate;
module.exports.commandLineShortName = "d";
module.exports.commandLineLongName = "date";
module.exports.helpText = "Date: generate a string based on the current date input: <localYYYYMMDD, localYYYYMMDDHHMMSS, localDDMMYYYY, UTCYYYYMMDD, UTCYYYYMMDDDDHHMMSS, UTCDDMMYYYY>";

const factory = function(in_formatOrUndefined){
	return new FactoryDate(in_formatOrUndefined);
}
module.exports.factory = factory;

//can return undefined if we don't like the json input
module.exports.parse = function(in_json){
	if ((undefined === in_json) || (sModuleNameDate !== in_json.type)){
		return undefined;
	}
	return factory(in_json.format);
}

const EnumlocalYYYYMMDD = "localYYYYMMDD";
const EnumlocalYYYYMMDDHHMMSS = "localYYYYMMDDHHMMSS";
const EnumlocalDDMMYYYY = "localDDMMYYYY";
const EnumUTCYYYYMMDD = "UTCYYYYMMDD";
const EnumUTCYYYYMMDDDDHHMMSS = "UTCYYYYMMDDDDHHMMSS";
const EnumUTCDDMMYYYY = "UTCDDMMYYYY";
module.exports.format = {
	"localYYYYMMDD" : EnumlocalYYYYMMDD,
	"localYYYYMMDDHHMMSS" : EnumlocalYYYYMMDDHHMMSS,
	"localDDMMYYYY" : EnumlocalDDMMYYYY,
	"UTCYYYYMMDD" : EnumUTCYYYYMMDD,
	"UTCYYYYMMDDDDHHMMSS" : EnumUTCYYYYMMDDDDHHMMSS,
	"UTCDDMMYYYY" : EnumUTCDDMMYYYY,
};

const FactoryDate = function(in_formatOrUndefined){
	this.m_format = (undefined === in_formatOrUndefined) ? EnumYMDHMS : in_formatOrUndefined;
}

const zeroPad = function(in_numeric, in_length){
	var result = in_numeric.toString();
	while (result.length < in_length){
		result = "0" + result;
	}
	return result;
}

const trimZeroPad = function(in_numeric, in_length){
	var result = zeroPad(in_numeric, in_length);
	if (in_length < result.length){
		result = result.substring(result.length - in_length);
	}
	return result;
}

const dateToStringLocalYYYYMMDD = function(){
	const date = new Date();
	var result = "";
	result += zeroPad(date.getFullYear(), 4);
	result += zeroPad(date.getMonth() + 1, 2);
	result += zeroPad(date.getDate(), 2);
	return result;
}

const dateToStringLocalYYYYMMDDHHMMSS = function(){
	const date = new Date();
	var result = "";
	result += zeroPad(date.getFullYear(), 4);
	result += zeroPad(date.getMonth() + 1, 2);
	result += zeroPad(date.getDate(), 2);
	result += zeroPad(date.getHours(), 2);
	result += zeroPad(date.getMinutes(), 2);
	result += zeroPad(date.getSeconds(), 2);
	return result;
}

const dateToStringLocalDDMMYYYY = function(){
	const date = new Date();
	var result = "";
	result += zeroPad(date.getDate(), 2);
	result += zeroPad(date.getMonth() + 1, 2);
	result += zeroPad(date.getFullYear(), 4);
	return result;
}

const dateToStringUTCYYYYMMDD = function(){
	const date = new Date();
	var result = "U";
	result += zeroPad(date.getUTCFullYear(), 4);
	result += zeroPad(date.getUTCMonth() + 1, 2);
	result += zeroPad(date.getUTCDate(), 2);
	return result;
}

const dateToStringUTCYYYYMMDDDDHHMMSS = function(){
	const date = new Date();
	var result = "U";
	result += zeroPad(date.getUTCFullYear(), 4);
	result += zeroPad(date.getUTCMonth() + 1, 2);
	result += zeroPad(date.getUTCDate(), 2);
	result += zeroPad(date.getUTCHours(), 2);
	result += zeroPad(date.getUTCMinutes(), 2);
	result += zeroPad(date.getUTCSeconds(), 2);
	return result;
}

const dateToStringUTCDDMMYYYY = function(){
	const date = new Date();
	var result = "U";
	result += zeroPad(date.getUTCDate(), 2);
	result += zeroPad(date.getUTCMonth() + 1, 2);
	result += zeroPad(date.getUTCFullYear(), 4);
	return result;
}

FactoryDate.prototype.toString = function(){
	switch (this.m_format){
	default:
	case EnumlocalYYYYMMDD:
		return dateToStringLocalYYYYMMDD();
	case EnumlocalYYYYMMDDHHMMSS:
		return dateToStringLocalYYYYMMDDHHMMSS();
	case EnumlocalDDMMYYYY:
		return dateToStringLocalDDMMYYYY();
	case EnumUTCYYYYMMDD:
		return dateToStringUTCYYYYMMDD();
	case EnumUTCYYYYMMDDDDHHMMSS:
		return dateToStringUTCYYYYMMDDDDHHMMSS();
	case EnumUTCDDMMYYYY:
		return dateToStringUTCDDMMYYYY();
	};
	return "";
}

FactoryDate.prototype.toJson = function(){
	var result = {
		"type" : sModuleNameDate,
		"format" : this.m_format
	};
	return result;
}

FactoryDate.prototype.update = function(){
	return;
}
