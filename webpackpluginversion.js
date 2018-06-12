const VersionHelper = require("./index.js");
const replaceToken = "__webpack_plugin_version__";

function WebpackVersionPlugin(in_options) {
	this.m_options = in_options;
}

WebpackVersionPlugin.prototype.apply = function (compiler) {
	var filepath = this.m_options.filepath;

	compiler.plugin("emit", function (compilation, callback) {
		version = VersionHelper.load(filepath);
		const versionString = version.toString();
		VersionHelper.save(version, filepath);

		for (var basename in compilation.assets) {
			let replaced = 0;

			const asset = compilation.assets[basename];
			const originalSource = asset.source();
			if (!originalSource || typeof originalSource.replace !== 'function') {
				continue;
			}
			const modFile = originalSource.replace(replaceToken, (tag) => {
				replaced += 1;
				return versionString;
			});

			asset.source = () => modFile;
			//console.log(`InjectByTag : match : ${basename} : replaced : ${replaced}`);
		}
		callback();
	});
};

module.exports = WebpackVersionPlugin;