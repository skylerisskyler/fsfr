import fs from 'fs'

import { config } from './schema'
import { build } from './Build'
import { Abstractions, init } from './Init'
import { ConfigPackage, writeToPackage } from './WriteToPackage'
import YAML from 'yaml'

function getConfig() {
  const config = fs.readFileSync('./fsfr.yaml', 'utf-8')
  // const config = fs.readFileSync('/config/fsfr/config.json', 'utf-8')
  return YAML.parse(config)
  return JSON.parse(config)
}

async function main() {

  const config = getConfig()

  const abstractions: Abstractions = init(config)

  const configuration: ConfigPackage = build(abstractions)

  writeToPackage(configuration)

}

main()