

import { Abstractions } from './Init';

import { 
  Automation,
  InputBoolean,
  Script 
} from './ha-config-types'

import { InputNumber } from './ha-config-types';

import { 
  Light,
} from './fsfr-types';
import { createToggle } from './script-builders/CreateToggle';
import { createVariableInput } from './fsfr-types/Variable';
import { createScripts } from './script-builders/CreateScripts';
import { ScriptProps } from './ha-config-types/Script';


interface Package {
  input_boolean: InputBoolean[];
  automation: Automation[];
  script: Script[];
  input_number: InputNumber[];
}


export function build({
  styles,
  contexts,
  layers,
  lights,
  variables
}: Abstractions) {

  const contextToggles: InputBoolean[] = contexts
    .map(context => createToggle(context))

  const lightScripts: ScriptProps[] = lights
    .reduce((scripts: ScriptProps[], light: Light) => {
      return scripts.concat(createScripts(light))
    }, [])

  const variablesInputs: InputNumber[] = variables.map((variable => createVariableInput(variable)))

  const configuration = {
    automation: [],
    script: [...lightScripts],
    input_number: [...variablesInputs],
    input_boolean: [...contextToggles],
  }

  return configuration

}