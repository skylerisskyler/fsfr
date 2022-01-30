import { config } from './schema'
import { build } from './Build'
import { Abstractions, init } from './Init'
import { ConfigPackage, writeToPackage } from './WriteToPackage'
 
async function main() {

  const abstractions: Abstractions = init(config)

  const configuration: ConfigPackage = build(abstractions)

  writeToPackage(configuration)

}

main()