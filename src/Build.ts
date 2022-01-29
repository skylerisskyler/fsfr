import fs from 'fs'
import Yaml from 'yaml'

import { Layer } from "./fsfr-types/Layer";
import { Light } from "./fsfr-types/Light";
import { Context, getLightContextSelectorId } from "./fsfr-types/Context";
import { Style } from "./Style";
import { Automation } from "./ha-config-types/Automation";
import { InputBooleanInput } from "./ha-config-types/InputBoolean";
import { InputNumberProps } from "./ha-config-types/InputNumber";
import { Script } from "./ha-config-types/Script";
import { Variable } from "./fsfr-types/Variable";
import {ChooseAction, ChooseActionChoice} from './ha-config-types/Action'
import { Group } from './ha-config-types/Group'
import { createVariableInput, getVariableInputId } from './fsfr-types/Variable'

const automations: Automation[] = []
const scripts: Script[] = []
const inputNumbers: InputNumberProps[] = []
const inputBooleans: InputBooleanInput[] = []

export function build(
  variables: Variable[],
  styles: Style[],
  contexts: Context[],
  layers: Layer[],
  lights: Light[]
) {

  const contextToggles: InputBooleanInput[] = contexts
    .map(context => context.createToggle())

  const lightScripts: Script[] = lights
    .reduce((scripts: Script[], light: Light) => {
      return scripts.concat(light.createScripts())
    }, [])

  const variablesInputs: InputNumberProps[] = variables.map((variable => createVariableInput(variable)))

  const configuration = {
    input_number: toDict(variablesInputs),
    input_boolean: toDict(contextToggles),
    script: {
      ...toDict(lightScripts.map((s) => s.compile())),
    },
  }

  const yamlForm = Yaml.stringify(configuration)

  fs.writeFileSync('./configuration.yaml', yamlForm)
}

const toDict = (list: (InputBooleanInput | Automation  | any)[]) => {
  return list.reduce((prev, curr) => {
    let newObj: any = curr
    const id = newObj.id
    delete newObj.id
    return {...prev, [id]: newObj}
  }, {})
}