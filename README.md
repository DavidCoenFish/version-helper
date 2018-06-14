version-helper(1) -- a semantic version helper
===========================================

## Install

```bash
npm install --save version-helper
````

## Usage

As a node module:

```js
const VersionHelper = require('version-helper')

const version = VersionHelper.new()
version.setPrePend("v")
version.incrementMajor()
version.toString() // "v1.0.0"
version.incrementMinor()
version.toString() // "v1.1.0"
version.incrementPatch()
version.toString() // "v1.1.1"
version.incrementMajor()
version.toString() // "v2.0.0"
version.addPreReleaseFactory(VersionHelper.FactoryConstant.factory("alpha"))
version.toString() // "v2.0.0-alpha"
version.addPreReleaseFactory(VersionHelper.FactoryCount.factory(9))
version.toString() // "v2.0.0-alpha.9"
version.clearPreRelease()
version.toString() // "v2.0.0"
version.addPreReleaseFactory(VersionHelper.FactoryConstant.factory("beta"))
version.addMetadataFactory(VersionHelper.FactoryDate.factory("UTCYYYYMMDDDDHHMMSS")) 
version.addMetadataFactory(VersionHelper.FactoryCount.factory())
version.addMetadataFactory(VersionHelper.FactoryConstant.factory("bar"))
version.toString() // "v2.0.0-beta+<UTCYYYYMMDDDDHHMMSS>.0.bar"
version.toString() // "v2.0.0-beta+<UTCYYYYMMDDDDHHMMSS>.0.bar"
version.update()
version.toString() // "v2.0.0-beta+<UTCYYYYMMDDDDHHMMSS>.1.bar"
```

As a command-line utility:

```
$ version-helper -h

Usage: version-helper [key] [options]
Prints a semantic version string after optional modification

version-helper 0.3.1+20180530085503.5
helper to generate Semantic Versioning 2.0.0 https://semver.org/
usage:
    version-helper [option [option param]]...
        prints the current version string or help text

sample:
    version-helper -a v0.0.0 -amd localYYYYMMDDHHMMSS -amb 0 -s versiondata.json
        assign version string v0.0.0 and add metadata for date and build count and save as versiondata.json

    version-helper -l versiondata.json -u -w package.json -s versiondata.json
        load versiondata.json and update, write to package.json and save as versiondata.json

options:
-h --help -?
    generate this text
-a --assign <input>
    assign a semantic version 2.0.0 string to the current version
-c --clear
    clear the current version
-u --update
    increment any build counts, and other factories that implement update
-im --incrementmajor
    increment the major value of the current version, sets minor and patch to zero
-in --incrementminor
    increment the minor value of the current version, sets patch to zero
-ip --incrementpatch
    increment the patch value of the current version
-cp --clearprerelease
    clear the prerelease portion of the current version
-cm --clearmetadata
    clear the metadata portion of the current version
-l --load <filepath>
    load json data from filepath into the current version
-s --save <filepath>
    save to json data at filepath from the current version
-r --readpackage <filepath>
    read the version string from package at filepath into the current version
-w --writepackage <filepath>
    set the version string into the package at filepath from the current version

-apc --addprereleaseconstant <input>
    preRelease portion Constant string: generate a static string input:<string [a-zA-Z0-9-]>
-apb --addprereleasebuildcount <input>
    preRelease portion Build count: generate a numeric that increments on each time the version data is parsed input:<0 <= numeric>
-apd --addprereleasedate <input>
    preRelease portion Date: generate a string based on the current date input:<localYYYYMMDD, localYYYYMMDDHHMMSS, localDDMMYYYY, UTCYYYYMMDD, UTCYYYYMMDDDDHHMMSS, UTCDDMMYYYY>
-amc --addmetadataconstant <input>
    metadata portion Constant string: generate a static string input:<string [a-zA-Z0-9-]>
-amb --addmetadatabuildcount <input>
    metadata portion Build count: generate a numeric that increments on each time the version data is parsed input:<0 <= numeric>
-amd --addmetadatadate <input>
    metadata portion Date: generate a string based on the current date input: <localYYYYMMDD, localYYYYMMDDHHMMSS, localDDMMYYYY, UTCYYYYMMDD, UTCYYYYMMDDDDHHMMSS, UTCDDMMYYYY>
```


