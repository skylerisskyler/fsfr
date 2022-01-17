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
import { Group } from './types/home-assistant/Group.ts'
import { createVariableInput, getVariableInputId } from './Variable.ts'
import {
  parse as yamlParse,
  parseAll as yamlParseAll,
  stringify as yamlStringify,
} from 'https://deno.land/std@0.82.0/encoding/yaml.ts';

const getSceneCheckScripts = (lights: Light[]) => {

  const scripts: Script[] = []

  lights.forEach(light => {

    light.layers.forEach((layer, idx, layers) => {

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
              light_id: light.id,
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
          entity_id: light.entityId
        })
      }

      const checkScript: Script = new Script({
        id: `${light.id} ${layer.scene.id} check script`,
        alias: 'some alias'
      })

      checkScript.addAction(chooseAction)

      scripts.push(checkScript)

    })
  })
  return scripts
}

const getVariableGroups = (variables: Variable[], scenes: Scene[]) => {

  const getVariableParentGroupId = (variable: Variable) => `fsfr_var_${variable.namespace}`
  const getVariableSceneGroupId = (variable: Variable, scene: Scene) => `fsfr_var_${variable.namespace}_scene_${scene.id}`

  const groups: Group[] = []

  variables.forEach((variable) => {

    const childEntities: string[] = []

    scenes.forEach(scene => {

      let sceneHasVariable = false

      scene.layers.forEach(layer => {
        layer.lights.forEach(light => {
          light.layers.forEach(lightLayer => {
            lightLayer.style.variables.forEach(styleVariable => {
              if(variable.namespace === styleVariable.namespace) {

                if(sceneHasVariable === false) {
                  childEntities.push('group.' + getVariableSceneGroupId(variable, scene))
                  const variableSceneGroup: Group = {
                    id: getVariableSceneGroupId(variable, scene),
                    name: 'some name or something',
                    entities: []
                  }
                  groups.push(variableSceneGroup)
                }

                sceneHasVariable = true

              }
            })
          })
        })
      })

    })

    const variableGroup: Group =  {
      id: getVariableParentGroupId(variable),
      name: variable.namespace,
      entities: childEntities
    }

    groups.push(variableGroup)

  })

  return groups

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

  const variableGroups: Group[] = getVariableGroups(variables, scenes)

  const variablesInputs: InputNumberProps[] = variables.map((variable => createVariableInput(variable)))

  const variableChangeAutomations: Automation[] = variables.map((variable) => {
    const automation = new Automation({
      id: `${variable.namespace}_handle_change`,
      alias: `some alias`
    })
    automation.addTrigger({
      platform: 'state',
      entity_id: `input_number.${getVariableInputId(variable)}`
    })

    automation.addAction({
      service: 'light.turn_on',
      //todo: specify the data
      data: {[variable.unit]: 'event_data'}
    })

    return automation

  })

  const removeChildGroupScript: Script = new Script({
    id: 'fsfr_remove_group',
    alias: 'my alias',
  })
  .addAction({
    service: 'group.set',
    data: {
      object_id: `{{ 'fsfr_var_' + scene_id + '_scene_' + var_namespace }}`,
      entities: []
    }
  })

  const addChildGroupScript: Script = new Script({
    id: 'fsfr_add_group',
    alias: 'my alias'
  })
  .addAction({
    service: 'group.set',
    data: {
      object_id: "{{ 'fsfr_var_' + scene_id + '_scene_' + var_namespace }}",
      entities: "{{ state_attr('fsfr_var_' + scene_id + '_scene_' + var_namespace, 'entity_id') | list + [light_id] }}"
    }
  })

  const removeSpecificLight: Script = new Script({
    id: 'fsfr_remove_specific_light',
    alias: 'my alias'
  })
  .addAction({
    service: 'group.set',
    data: {
      object_id: "{{ 'fsfr_var_' + scene_id + '_scene_' + var_namespace }}",
      entities: "{{state_attr('group.var_' + var_name + 'scene' + scene_id, 'entity_id')|reject('equalto', light_id)| list}}"
    }
  })

  const configuration = {
    input_boolean: toDict(sceneToggles),
    automation: [
      ...sceneOffAutomations.map((a) => a.compile()),
      ...variableChangeAutomations.map(a => a.compile())
    ],
    script: {
      ...toDict(sceneCheckScripts.map((s) => s.compile())),
      ...toDict([removeChildGroupScript.compile()]),
      ...toDict([addChildGroupScript.compile()]),
      ...toDict([removeSpecificLight.compile()]),
    },
    groups: toDict(variableGroups),
    input_number: toDict(variablesInputs)
  }

  const yamlForm = yamlStringify(configuration)
    .replaceAll("'{{", '"{{')
    .replaceAll("}}'", '}}"')
    .replaceAll("''", "'")


  Deno.writeTextFile('./configuration.yaml', yamlForm)
}


const toDict = (list: (InputBooleanInput | Automation  | any)[]) => {
  return list.reduce((prev, curr) => {
    let newObj: any = curr
    const id = newObj.id
    delete newObj.id
    return {...prev, [id]: newObj}
  }, {})
}
