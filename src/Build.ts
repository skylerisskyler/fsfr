

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
import { createToggle } from './entity-builders/CreateToggle';
import { createVariableInput } from './fsfr-types/Variable';
import { createScripts } from './entity-builders/CreateScripts';
import { ScriptProps } from './ha-config-types/Script';
import { createAddLightToVarScript, createRemoveLightFromVarScript } from './entity-builders/VariableGroupHandlers';
import { variableUpdateAutomation } from './entity-builders/VariableUpdateAutomation';
import { createVariableGroup } from './entity-builders/VariableGroup';


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

  const addLightToVarScript = createAddLightToVarScript()
  const removeLightFromVarScript = createRemoveLightFromVarScript()
  
  const variablesInputs: InputNumber[] = variables.map((variable => createVariableInput(variable)))

  const variableUpdateAutomations = variables.map(variable => variableUpdateAutomation(variable))

  const variableGroups = variables.map(variable => createVariableGroup(variable))

  const configuration = {
    automation: [...variableUpdateAutomations],
    script: [
      ...lightScripts,
      addLightToVarScript,
      removeLightFromVarScript
    ],
    input_number: [...variablesInputs],
    input_boolean: [...contextToggles],
    group: [...variableGroups]
  }

  return configuration

}