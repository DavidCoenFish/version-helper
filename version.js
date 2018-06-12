const Path = require("path");
const FileSystem = require("fs");
const Util = require("./util.js");
const FactoryConstant = require("./factory/factoryconstant.js");

/*
aim is to be a dumb class with accessors and not too much logic,
go as far to have toString/parse, but not have toJson/parseJson at this level (see index.js)
or should we bring to/from json to this level?
 */

module.exports.factory = function(
	in_prePendOrUndefined, //"v", "=", undefined
	in_majorOrUndefined, //[0,1,2...
	in_minorOrUndefined, //[0,1,2...
	in_patchOrUndefined, //[0,1,2...
	in_arrayPreReleaseFactoryOrUndefined, //array of factories that return a string or numeric [a-zA-Z0-9/-] no leading zero on numeric
	in_arrayMetadataFactoryOrUndefined //array of factories that return a string or numeric [a-zA-Z0-9/-]
	){
	return new DscVersion(
		in_prePendOrUndefined,
		in_majorOrUndefined,
		in_minorOrUndefined,
		in_patchOrUndefined,
		in_arrayPreReleaseFactoryOrUndefined,
		in_arrayMetadataFactoryOrUndefined
		);
}

const WalkSync = function (currentDirPath, callback) {
	FileSystem.readdirSync(currentDirPath).forEach(function (name) {
		var filePath = Path.join(currentDirPath, name);
		var stat = FileSystem.statSync(filePath);
		if (stat.isFile()) {
			callback(filePath, name);
		}
	});
}

const GatherArrayModules = function(in_path, inout_arrayModules) {
	const searchPath = Path.join(__dirname, in_path);
	//console.log("searchPath:" + searchPath);
	WalkSync(searchPath, function(filePath, name){
		var testPath = "./" + Path.relative(__dirname, filePath).replace(/\\/g, "/");
		//console.log("testPath:" + name);
		try{
			const module = require(testPath);
			inout_arrayModules.push(module);
		}catch (err){
			console.log("testPath:" + testPath + " threw:" + err);
		}
	});
	return;
}

var sArrayFactory = [];
GatherArrayModules("\\factory\\", sArrayFactory);
module.exports.arrayFactory = sArrayFactory;

const DscVersion = function(
	in_prePendOrUndefined, //"v", "=", undefined
	in_majorOrUndefined, //[0,1,2...
	in_minorOrUndefined, //[0,1,2...
	in_patchOrUndefined, //[0,1,2...
	in_arrayPreReleaseFactoryOrUndefined, //array of factories that return a string or numeric [a-zA-Z0-9/-] no leading zero on numeric
	in_arrayMetadataFactoryOrUndefined //array of factories that return a string or numeric [a-zA-Z0-9/-]
	){
	this.m_prePend = undefined;
	this.m_major = undefined;
	this.m_minor = undefined;
	this.m_patch = undefined;
	this.m_arrayPreReleaseFactory = (undefined === in_arrayPreReleaseFactoryOrUndefined) ? [] : in_arrayPreReleaseFactoryOrUndefined;
	this.m_arrayMetadataFactory = (undefined === in_arrayMetadataFactoryOrUndefined) ? [] : in_arrayMetadataFactoryOrUndefined;

	this.setPrePend(in_prePendOrUndefined);
	this.setMajor(in_majorOrUndefined);
	this.setMinor(in_minorOrUndefined);
	this.setPatch(in_patchOrUndefined);

	return;
}

arrayFactoryToString = function(in_prePend, in_arrayFactory){
	if (in_arrayFactory.length <= 0){
		return "";
	}
	var temp = [];
	for (var index = 0, total = in_arrayFactory.length; index < total; index++) {
		var item = in_arrayFactory[index];
		temp.push(item.toString());
	}
	var result = in_prePend + temp.join(".");
	return result;
}

DscVersion.prototype.toString = function(){
	var result = this.m_prePend + this.m_major.toString() + "." + this.m_minor.toString() + "." + this.m_patch.toString();
	result += arrayFactoryToString("-", this.m_arrayPreReleaseFactory);
	result += arrayFactoryToString("+", this.m_arrayMetadataFactory);
	return result;
}

DscVersion.prototype.parse = function(in_string){
	this.clear();

	var traceString = "" + in_string;
	var splitArray = traceString.split("+");
	if (1 < splitArray.length){
		innerDataArray = splitArray[1].split(".");
		for (var index = 0, total = innerDataArray.length; index < total; index++) {
			var innerData = innerDataArray[index];
			this.addMetadataFactory(FactoryConstant.factory(innerData));
		}
	}

	traceString = splitArray[0];
	splitArray = traceString.split("-");
	if (1 < splitArray.length){
		innerDataArray = splitArray[1].split(".");
		for (var index = 0, total = innerDataArray.length; index < total; index++) {
			var innerData = innerDataArray[index];
			this.addPreReleaseFactory(FactoryConstant.factory(innerData));
		}
	}

	traceString = splitArray[0];
	splitArray = traceString.split(".");
	if (3 <= splitArray.length){
		this.setPatch(splitArray[2]);
	} 
	if (2 <= splitArray.length){
		this.setMinor(splitArray[1]);
	} 
	if (1 <= splitArray.length){
		var majorString = splitArray[0];
		var firstChar = majorString.charAt();
		if (false === Util.isNumeric(firstChar)){
			this.setPrePend(firstChar);
			majorString = majorString.substring(1);
		}
		this.setMajor(majorString);
	} 

	return;
}

//this is internal to version (not index) as here we hopefully have knowledge of EVERYTHING that needs to be cleared
DscVersion.prototype.clear = function(){
	this.m_prePend = "";
	this.m_major = 0;
	this.m_minor = 0;
	this.m_patch = 0;
	this.m_arrayPreReleaseFactory = [];
	this.m_arrayMetadataFactory = [];
	return;
}

DscVersion.prototype.setPrePend = function(in_valueOrUndefined){
	this.m_prePend = (undefined === in_valueOrUndefined) ? "" : in_valueOrUndefined;
	return;
}

DscVersion.prototype.getPrePend = function(){
	return this.m_prePend;
}

DscVersion.prototype.setMajor = function(in_valueOrUndefined){
	this.m_major = Util.cooerceNumeric(in_valueOrUndefined);
	return;
}

DscVersion.prototype.getMajor = function(){
	return this.m_major;
}

DscVersion.prototype.setMinor = function(in_valueOrUndefined){
	this.m_minor = Util.cooerceNumeric(in_valueOrUndefined);
	return;
}

DscVersion.prototype.getMinor = function(){
	return this.m_minor;
}

DscVersion.prototype.setPatch = function(in_valueOrUndefined){
	this.m_patch = Util.cooerceNumeric(in_valueOrUndefined);
	return;
}

DscVersion.prototype.getPatch = function(){
	return this.m_patch;
}

DscVersion.prototype.addPreReleaseFactory = function(in_factory){
	this.m_arrayPreReleaseFactory.push(in_factory);
	return;
}

DscVersion.prototype.clearPreRelease = function(){
	this.m_arrayPreReleaseFactory = [];
	return;
}

DscVersion.prototype.arrayPreReleaseFactoryForEach = function(in_callback){
	this.m_arrayPreReleaseFactory.forEach(in_callback);
	return;
}

DscVersion.prototype.addMetadataFactory = function(in_factory){
	this.m_arrayMetadataFactory.push(in_factory);
	return;
}

DscVersion.prototype.clearMetadata = function(){
	this.m_arrayMetadataFactory = [];
	return;
}

DscVersion.prototype.arrayMetadataFactoryForEach = function(in_callback){
	this.m_arrayMetadataFactory.forEach(in_callback);
	return;
}

DscVersion.prototype.update = function(){
	this.arrayPreReleaseFactoryForEach(function(in_item){
		in_item.update();
	});
	this.arrayMetadataFactoryForEach(function(in_item){
		in_item.update();
	});
	return;
}