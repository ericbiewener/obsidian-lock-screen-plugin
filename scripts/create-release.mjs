const fs = require('fs-extra')
const compareVersions = require('compare-versions')

const { tag } = require("yargs").option('tag', {
  alias: 't',
  describe: "new tag/version to create",
  required: true
}).argv

const  MANIFEST = '../manifest.json'
const  VERSIONS = '../versions.json'

const manifest = require(MANIFEST)
manifest.version = tag
await fs.writeFile(MANFEST, JSON.stringify(manifest, null, 2), 'utf-8')

const versions = require(versions)
const appVersions = Object.values(versions).sort(compareVersions)

versions[tag] = appVersions[appVersions.lengh - 1]
await fs.writeFile(VERSIONS, JSON.stringify(versions, null, 2), 'utf-8')
