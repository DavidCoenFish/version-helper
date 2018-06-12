const Util = require("./../util.js");

const sModuleNameConstant = "factoryconstant"; //is there a better way to get module name
module.exports.name = sModuleNameConstant;
module.exports.commandLineShortName = "c";
module.exports.commandLineLongName = "constant";
module.exports.helpText = "Constant string: generate a static string input:<string [a-zA-Z0-9\-]>";

const factory = function(in_valueOrUndefined){
	const value = Util.cleanString(in_valueOrUndefined);
	return new FactoryConstant(value);
}
module.exports.factory = factory;

//can return undefined if we don't like the json input
module.exports.parse = function(in_json){
	if ((undefined === in_json) || (sModuleNameConstant !== in_json.type)){
		return undefined;
	}
	return factory(in_json.value);
}

const FactoryConstant = function(in_valueOrUndefined){
	this.m_value = (undefined === in_valueOrUndefined) ? "" : in_valueOrUndefined;
}

FactoryConstant.prototype.toString = function(){
	return this.m_value;
}

FactoryConstant.prototype.toJson = function(){
	var result = {
		"type" : sModuleNameConstant,
		"value" : this.m_value
	};
	return result;
}

FactoryConstant.prototype.update = function(){
	return;
}
