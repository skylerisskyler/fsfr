import { config } from './schema'
import { build } from './Build'
import { Abstractions, init } from './Init'
import { ConfigPackage, writeToPackage } from './WriteToPackage'
 import fs from 'fs'
 import YAML from 'yaml'

function getConfig() {
  const config = fs.readFileSync('./simple.yaml', 'utf8')
  return YAML.parse(config)
}

async function main() {

  const config = getConfig()


  const abstractions: Abstractions = init(config)

  const configuration: ConfigPackage = build(abstractions)

  writeToPackage(configuration)

}

main()