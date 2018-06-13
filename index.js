const Path = require("path");
const FileSystem = require("fs");
const Version = require("./version.js")
const FactoryConstant = require("./factory/factoryconstant.js");
const FactoryCount = require("./factory/factorycount.js");
const FactoryDate = require("./factory/factorydate.js");
const FactoryGitVersion = require("./factory/factorygitversion.js");

module.exports.FactoryConstant = FactoryConstant;
module.exports.FactoryCount = FactoryConstant;
module.exports.FactoryDate = FactoryConstant;
module.exports.FactoryGitVersion = FactoryGitVersion;

module.exports.loadUpdateSaveReturnVersionString = function(in_filePath){
	const version = module.exports.load(in_filePath);
	version.update();
	module.exports.save(version, in_filePath);
	const versionString = version.toString();
	return versionString;
}

module.exports.new = function(){
	const result = Version.factory();
	return result;
}

module.exports.assign = function(in_version, in_string){
	in_version.parse(in_string);
	return in_version;
}

module.exports.clear = function(in_version){
	in_version.clear();
	return;
}

module.exports.update = function(in_version){
	in_version.update();
	return;
}

module.exports.incrementMajor = function(in_version){
	in_version.setMajor(in_version.getMajor() + 1);
	in_version.setMinor(0);
	in_version.setPatch(0);
	return;
}

module.exports.incrementMinor = function(in_version){
	in_version.setMinor(in_version.getMinor() + 1);
	in_version.setPatch(0);
	return;
}

module.exports.incrementPatch = function(in_version){
	in_version.setPatch(in_version.getPatch() + 1);
	return;
}

module.exports.addPreReleaseFactory = function(in_version, in_factory){
	in_version.addPreReleaseFactory(in_factory);
	return;
}

module.exports.clearPreRelease = function(in_version){
	in_version.clearPreRelease();
	return;
}

module.exports.addMetadataFactory = function(in_version, in_factory){
	in_version.addMetadataFactory(in_factory);
	return;
}

module.exports.clearMetadata = function(in_version){
	in_version.clearMetadata();
	return;
}

//return version
module.exports.jsonParse = function(in_json){
	var prePendOrUndefined = in_json["prepend"];
	var majorOrUndefined = in_json["major"];
	var minorOrUndefined = in_json["minor"];
	var patchOrUndefined = in_json["patch"];

	var arrayPreReleaseFactoryOrUndefined = undefined;
	var arrayPreReleaseOrUndefined = in_json["prerelease"];
	if (undefined !== arrayPreReleaseOrUndefined){
		arrayPreReleaseFactoryOrUndefined = [];
		for (var index = 0, total = arrayPreReleaseOrUndefined.length; index < total; index++) {
			var item = arrayPreReleaseOrUndefined[index];
			for (var subIndex = 0, subTotal = Version.arrayFactory.length; subIndex < subTotal; subIndex++) {
				var subItem = Version.arrayFactory[subIndex];
				var preReleaseFactory = subItem.parse(item);
				if (undefined === preReleaseFactory){
					continue;
				}
				arrayPreReleaseFactoryOrUndefined.push(preReleaseFactory);
			}
		}
	}

	var arrayMetadataFactoryOrUndefined = undefined;
	var arrayMetadataOrUndefined = in_json["metadata"];
	if (undefined !== arrayMetadataOrUndefined){
		arrayMetadataFactoryOrUndefined = [];
		for (var index = 0, total = arrayMetadataOrUndefined.length; index < total; index++) {
			var item = arrayMetadataOrUndefined[index];
			for (var subIndex = 0, subTotal = Version.arrayFactory.length; subIndex < subTotal; subIndex++) {
				var subItem = Version.arrayFactory[subIndex];
				var metadataFactory = subItem.parse(item);
				if (undefined === metadataFactory){
					continue;
				}
				arrayMetadataFactoryOrUndefined.push(metadataFactory);
			}
		}
	}

	version = Version.factory(prePendOrUndefined, majorOrUndefined, minorOrUndefined, patchOrUndefined, arrayPreReleaseFactoryOrUndefined, arrayMetadataFactoryOrUndefined);

	return version;
}

//return json object
module.exports.toJson = function(in_version){
	var result = {
		"prepend" : in_version.getPrePend(),
		"major" : in_version.getMajor(),
		"minor" : in_version.getMinor(),
		"patch" : in_version.getPatch()
		};

	var arrayItems = [];
	in_version.arrayPreReleaseFactoryForEach(function(in_element){
		arrayItems.push(in_element.toJson());
	});
	if (0 < arrayItems.length){
		result["prerelease"] = arrayItems;
	}

	arrayItems = [];
	in_version.arrayMetadataFactoryForEach(function(in_element){
		arrayItems.push(in_element.toJson());
	});
	if (0 < arrayItems.length){
		result["metadata"] = arrayItems;
	}

	return result;
}

module.exports.load = function(in_filePath){
	var jsonObject = {};
	try{
		const jsonString = FileSystem.readFileSync(in_filePath, "utf8");
		jsonObject = JSON.parse(jsonString);
	} catch (error){
		console.error(error);
	}
	const version = module.exports.jsonParse(jsonObject);
	return version;
}

module.exports.save = function(in_version, in_filePath){
	const jsonObject = module.exports.toJson(in_version);
	try{
		FileSystem.writeFileSync(in_filePath, JSON.stringify(jsonObject, null, 2));
	} catch (error){
		console.error(error);
	}
	return;
}

module.exports.readPackage = function(in_pathToPackage){
	var packageString;
	try{
		packageString = FileSystem.readFileSync(in_pathToPackage, "utf8");
	} catch (error){
		console.error(error);
	}
	const packageJson = JSON.parse(packageString);
	const version = module.exports.new();
	version.parse(packageJson["version"]);
	return version;
}

module.exports.writePackage = function(in_version, in_pathToPackage){
	var packageString;
	try{
		packageString = FileSystem.readFileSync(in_pathToPackage, "utf8");
	} catch (error){
		console.error(error);
	}
	const packageJson = JSON.parse(packageString);
	packageJson["version"] = in_version.toString();
	const packageStringNew = JSON.stringify(packageJson, null, 2);
	try{
		FileSystem.writeFileSync(in_pathToPackage, packageStringNew);
	} catch (error){
		console.error(error);
	}
		
	return;
}
