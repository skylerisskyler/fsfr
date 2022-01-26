import fs from 'fs'
import Yaml from 'yaml'

import { Layer } from "./fsfr-types/Layer";
import { Light } from "./fsfr-types/Light";
import { Scene, getSceneToggleId, getLightSceneSelectorId } from "./fsfr-types/Scene";
import { Style } from "./Style";
import { Automation } from "./ha-config-types/Automation";
import { InputBooleanInput } from "./ha-config-types/InputBoolean";
import { InputNumberProps } from "./ha-config-types/InputNumber";
import { Script } from "./ha-config-types/Script";
import { Variable } from "./fsfr-types/Variable";
import {ChooseAction, ChooseActionChoice} from './ha-config-types/Action'
import { Group } from './ha-config-types/Group'
import { createVariableInput, getVariableInputId } from './fsfr-types/Variable'


const getSceneCheckScripts = (lights: Light[]) => {

  const scripts: Script[] = []

  lights.forEach(light => {
    
    light.layers.forEach((layer, idx, layers) => {

      const checkScript: Script = new Script({
        id: `${light.id} ${layer.scene.id} check script`,
        alias: 'some alias'
      })

      const chooseActionChoice = new ChooseActionChoice('my new choice')
      
      chooseActionChoice.addCondition({
        condition: 'state',
        entity_id: 'input_boolean.' + getSceneToggleId(layer.scene),
        state: 'on'
      })

      chooseActionChoice.addCondition({
        condition: 'state',
        entity_id: 'input_boolean.' + getSceneToggleId(layer.scene),
        state: 'off'
      })

      chooseActionChoice.addCondition({
        condition: 'state',
        entity_id: 'input_select.' + getLightSceneSelectorId(light),
        state: layer.scene.id
      })

      layer.scene.variables.forEach(variable => {
        chooseActionChoice.addAction({
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

      chooseActionChoice.addAction({
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

  const sceneCheckScripts: Script[] = lights
    .reduce((scripts: Script[], light: Light) => {
      return scripts.concat(light.createScripts())
    }, [])

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

  const configuration = {
    // input_boolean: toDict(sceneToggles),
    // automation: [
    //   ...sceneOffAutomations.map((a) => a.compile()),
    //   ...variableChangeAutomations.map(a => a.compile())
    // ],
    script: {
      ...toDict(sceneCheckScripts.map((s) => s.compile())),
      // ...toDict([removeChildGroupScript.compile()]),
      // ...toDict([addChildGroupScript.compile()]),
      // ...toDict([removeSpecificLight.compile()]),
    },
    // groups: toDict(variableGroups),
    // input_number: toDict(variablesInputs)
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