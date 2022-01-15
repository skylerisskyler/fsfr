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
import {
  parse as yamlParse,
  parseAll as yamlParseAll,
  stringify as yamlStringify,
} from 'https://deno.land/std@0.82.0/encoding/yaml.ts';

const getSceneCheckScripts = (lights: Light[]) => {

  const scripts: Script[] = []

  const scriptsForLight: any = lights.map(light => {

    const checkScripts = light.layers.map((layer, idx, layers) => {

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
        entity_id: 'input_select.' + getLightSceneSelectorId(light),
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

      chooseActionChoice.addSequence({
        service: 'light.turn_on',
        target: {
          entity_id: light.entityId
        },
        data: layer.style.data
      })



      const chooseAction: ChooseAction = new ChooseAction('my alias')
      chooseAction.addChoice(chooseActionChoice)
      
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
        id: `${light.entityId} ${layer.scene.id} check script`,
        alias: 'some alias'
      })

      checkScript.addAction(chooseAction)

      scripts.push(checkScript)

    })

    
  })
  return scripts
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

  const sceneToggles: InputBooleanInput[] = scenes
    .map(scene => scene.createToggle())

  const sceneOffAutomations: Automation[] = scenes
    .map(scene => scene.createOffAutomation())

  const sceneOnAutomations: Automation[] = scenes
    .map(scene => scene.createOnAutomation())

  const sceneCheckScripts: Script[] = getSceneCheckScripts(lights)


  const configuration = {
    input_boolean: yamlize(sceneToggles),
    automation: yamlize(sceneOffAutomations.map((s) => s.compile())),
    script: yamlize(sceneCheckScripts.map((s) => s.compile()))
  }

  console.log(configuration)
  const yamlForm = yamlStringify(configuration)
  Deno.writeTextFile('./configuration.yaml', yamlForm)
}


const yamlize = (list: (InputBooleanInput | Automation  | any)[]) => {
  return list.reduce((prev, curr) => {
    let newObj: any = curr
    const id = newObj.id
    delete newObj.id
    return {...prev, [id]: newObj}
  }, {})

}