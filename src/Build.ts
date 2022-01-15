import { Layer } from "./Layer.ts";
import { Light } from "./Light.ts";
import { Scene, getSceneToggleId, getLightSceneSelectorId } from "./scene/Scene.ts";
import { Style } from "./Style.ts";
import { Automation } from "./types/home-assistant/Automation.ts";
import { InputBooleanInput } from "./types/home-assistant/InputBoolean.ts";
import { InputNumberProps } from "./types/home-assistant/InputNumber.ts";
import { Script } from "./types/home-assistant/Script.ts";
import { Variable } from "./Variable.ts";
import {ChooseAction, ChooseActionChoice} from './types/home-assistant/Action.ts'

import * as YAML from 'https://deno.land/std@0.82.0/encoding/yaml.ts';


const getSceneCheckScripts = (lights: Light[]) => {
  const scriptsForLight = lights.map(light => {
    light.layers.map((layer, idx, layers) => {
      console.log(layer.scene.id)
      const script: Script = new Script({
        id: `check script ${layer.scene.id}`,
        alias: 'my_alias',
      })

      const chooseActionChoice = new ChooseActionChoice('my new choice')
      chooseActionChoice.addCondition({
        condition: 'state',
        entity_id: 'input_boolean.' + getSceneToggleId(layer.scene),
        state: 'on'
      })
      chooseActionChoice.addCondition({
        condition: 'state',
        entity_id: 'input_boolean.' + getLightSceneSelectorId(light),
        state: layer.scene.id
      })
      layer.scene.variables.forEach(variable => {
        chooseActionChoice.addSequence({
          service: 'script.turn_on',
          entity_id: 'util_script_for_var',
          data: {
            variables: {
              var_name: variable.namespace,
              light_id: light.entityId,
              scene_id: layer.scene.id
            }
          }
        })
      })

      
      const chooseAction: ChooseAction = new ChooseAction('my alias')
      chooseAction.addDefault(chooseActionChoice)
      
      const nextLayer: Layer | undefined = layers[idx + 1]
      if(nextLayer) {
        chooseAction.addDefault({
          service: `script.check_${nextLayer.id}`
        })
      } else {
        chooseAction.addDefault({
          service: 'light.turn_off',
          entity_id: light.entityId[0]
        })
      }

      const checkScript: Script = new Script({
        id: 'id for the check script',
        alias: 'some alias'
      })

      checkScript.addAction(chooseAction)

      return checkScript

    })

    return scriptsForLight

  })
}

const automations: Automation[] = []
const scripts: Script[] = []
const inputNumbers: InputNumberProps[] = []
const inputBooleans: InputBooleanInput[] = []

export function build(
    variables: Variable[],
    styles: Style[],
    scenes: Scene[],
    layers: Layer[],
    lights: Light[]
) 
{

  // const sceneToggles: InputBooleanInput[] = scenes
  //   .map(scene => scene.createToggle())

  // const sceneOffAutomations: Automation[] = scenes
  //   .map(scene => scene.createOffAutomation())

  // const sceneOnAutomations: Automation[] = scenes
  //   .map(scene => scene.createOnAutomation())

  const sceneCheckScripts = getSceneCheckScripts(lights)

  // createSceneToggles(scenes, inputBooleans)
  // createSceneAutomations(scenes, automations)
  // createVariableInputs(variables, inputNumbers)

  // console.log(scenes)
  // console.log(Deno.inspect(automations))

  // const output = YAML.stringify({
  //   input_boolean: inputBooleans,
  //   script: scripts,
  //   automations
  // })
  // console.log(output)
  // Deno.writeTextFile("./configuration.json", JSON.stringify({sceneToggles, sceneOffAutomations}));

}