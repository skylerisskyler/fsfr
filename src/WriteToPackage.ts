import YAML from 'yaml'
import fs from 'fs'

import { 
  Automation,
  InputBoolean,
  Script,
  InputNumber
} from './ha-config-types'
import { ScriptProps } from './ha-config-types/Script';

export interface ConfigPackage {
  input_boolean: InputBoolean[];
  automation: Automation[];
  script: ScriptProps[];
  input_number: InputNumber[];
}

interface Dict {
  [key: string]: any
}

const toDict = (prevDict: Dict, curr: Dict) => {
  let dict: Dict = curr
  const id = dict.id
  delete dict.id
  return {...prevDict, [id]: dict}
}

export function writeToPackage(configPackage: ConfigPackage) {

  const pkg = {
    automation: configPackage.automation,
    script: configPackage.script.reduce(toDict, {}),
    input_boolean: configPackage.input_boolean.reduce(toDict, {}),
    input_number: configPackage.input_number.reduce(toDict, {}),
  }

  const packageString = YAML.stringify(pkg)
    .replaceAll(': on', ": 'on'")
  fs.writeFileSync('./configuration.yaml', packageString)
}

