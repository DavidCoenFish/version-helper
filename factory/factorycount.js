const Path = require("path");
const FileSystem = require("fs");
const Util = require("./../util.js");

const sModuleNameCount = "factorycount"; //is there a better way to get module name
module.exports.name = sModuleNameCount;
module.exports.commandLineShortName = "b";
module.exports.commandLineLongName = "buildcount";
module.exports.helpText = "Build count: generate a numeric that increments on each time the version object has update method called";

const factory = function(in_valueOrUndefined){
	const value = Util.cooerceNumeric(in_valueOrUndefined);
	return new FactoryCount(value);
}
module.exports.factory = factory;

//can return undefined if we don't like the json input
// we increment count on load
module.exports.parse = function(in_json){
	if ((undefined === in_json) || (sModuleNameCount !== in_json.type)){
		return undefined;
	}
	return factory(in_json.value);
}

const FactoryCount = function(in_valueOrUndefined){
	this.m_value = (undefined === in_valueOrUndefined) ? 0 : in_valueOrUndefined;
}

FactoryCount.prototype.toString = function(){
	return this.m_value;
}

FactoryCount.prototype.toJson = function(){
	var result = {
		"type" : sModuleNameCount,
		"value" : this.m_value
	};
	return result;
}

FactoryCount.prototype.update = function(){
	this.m_value = this.m_value + 1;
	return;
}
