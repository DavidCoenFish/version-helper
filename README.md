dsc-version(1) -- a semantic version helper
===========================================

## Install

```bash
npm install --save dsc-version
````

## Usage

As a node module:

```js
const VersionHelper = require('version-helper')

const foo = VersionHelper.new("foo")
foo.incrementMajor()
foo.toString() // "v1.0.0"
foo.incrementMinor()
foo.toString() // "v1.1.0"
foo.incrementPatch()
foo.toString() // "v1.1.1"
foo.incrementMajor()
foo.toString() // "v2.0.0"
foo.addPreRelease("alpha")
foo.toString() // "v2.0.0-alpha"
foo.addPreRelease("9")
foo.toString() // "v2.0.0-alpha.9"
foo.clearPreRelease()
foo.toString() // "v2.0.0"
foo.addPrerelease("beta")
foo.addMetadataFactory(VersionHelper.metadataFactoryDate) //factory is a function that returns a promice which resolves to a value which can be converted to a string
foo.addMetadataFactory(VersionHelper.metadataFactoryCounter)
foo.addMetadata("bar")
foo.toString() // "v2.0.0-beta+<20180518064239>.0.bar"
foo.toString() // "v2.0.0-beta+<iso date without punctuation>.1.bar"
const bar = dscVersion.open("foo")
bar.toString() // "v2.0.0-beta+<iso date without punctuation>.2.bar"
```

As a command-line utility:

```
$ dsc-version -h

Usage: version-helper [key] [options]
Prints a semantic version string after optional modification

--set <semantic version string>
--incrementMajor
--incrementMinor
--incrementPatch
--addPreRelease //[0-9A-Za-z-] numeric MUST NOT have leading zeros
--clearPreRelease
--addMetadata //[0-9A-Za-z-]
--addMetadataFactoryDate
--addMetadataFactoryCounter
--clearMetadata

```


