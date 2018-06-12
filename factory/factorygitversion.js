const sModuleName = "factorygitversion"; //is there a better way to get module name
module.exports.name = sModuleName;
module.exports.commandLineShortName = "g";
module.exports.commandLineLongName = "gitversion";
module.exports.helpText = "unimplement: get the git version string for current dir? input:<?>";

/*
todo: generate a string indicating the current git version
 */

const factory = function(){
	return new FactoryGitVersion();
}
module.exports.factory = factory;

//can return undefined if we don't like the json input
module.exports.parse = function(in_json){
	if ((undefined === in_json) || (sModuleName !== in_json.type)){
		return undefined;
	}
	return factory();
}

const FactoryGitVersion = function(){
}

FactoryGitVersion.prototype.toString = function(){
	return "unimplemented";
}

FactoryGitVersion.prototype.toJson = function(){
	var result = {
		"type" : sModuleName
	};
	return result;
}

