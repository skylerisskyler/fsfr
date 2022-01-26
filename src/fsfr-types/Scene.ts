import { ALIAS_PREFIX, ID_PREFIX } from "../App"
import { Layer } from "./Layer"
import { Light } from "./Light"
import { Automation } from "../ha-config-types/Automation"
import { InputBooleanInput, InputBooleanProps } from "../ha-config-types/InputBoolean"
import { Script } from "../ha-config-types/Script"
import { Variable } from "./Variable"

interface SceneConf {
  id: string
}

export const getSceneToggleId = (scene: Scene) => {
  return `fsfr_scene_${scene.id}`
}
export const getSceneOffAutomationId = (scene: Scene): string => 
`fsfr_${scene.id}_off`

export const getSceneOnAutomationId = (scene: Scene): string => 
`fsfr_${scene.id}_on`

export const getSceneCheckScriptId = (light: Light, scene: Scene): string => 
`fsfr_${light.id}_check_${scene.id}`

export const getLightSceneSelectorId = (light: Light) =>
  `fsfr_${light.id}_scenes`

export class Scene {
  id: string
  layers: Layer[]

  constructor({id}: SceneConf) {
    this.id = id
    this.layers = []
  }

  addLayer(layer: Layer) {
    this.layers.push(layer)
  }

  createToggle(): InputBooleanInput {
    return {
      id: getSceneToggleId(this),
      icon: 'mdi:<some-icon>',
      name: 'some name'
    }
  }

  get lights() {
    return this.layers.reduce((allLights, layer) => {
      return [...allLights, ...layer.lights]
    }, [] as Light[])
  }

  createOnAutomation(): Automation {
    const automation: Automation = new Automation({
      id: getSceneOnAutomationId(this)
    })

    automation.addTrigger({
      platform: 'state',
      entity_id: `input_boolean.${getSceneToggleId(this)}`,
      to: 'on'
    })

    this.lights.forEach(light => {
      const firstScene = light.layers[0].scene
      automation.addAction({
        service: `script.${getSceneCheckScriptId(light, firstScene)}`
      })
    })

    return automation
  }

  createOffAutomation(): Automation {
    
    const automation: Automation = new Automation({
      id: getSceneOffAutomationId(this)
    })

    automation.addTrigger({
      platform: 'state',
      entity_id: `input_boolean.${getSceneToggleId(this)}`,
      to: 'off'
    })

    this.variables.forEach((variable) => {
      automation.addAction({
        service: 'script.turn_on',
        entity_id: `script.fsfr_variable_group_deactivation`,
        data: {
          variables: {
            var_namespace: variable.namespace,
            scene_id: this.id
          }
        }
      })
    })

    this.lights.forEach(light => {
      const nextScene = light.getNextScene(this)
      if(nextScene) {
        automation.addAction({
          service: `script.check_next_${light.id}_${nextScene.id}`
        })
      } else {
        automation.addAction({
          service: 'light.turn_off',
          entity_id: light.entityId
        })
      }
    })

    return automation
  }

  get variables(): Variable[] {
    return this.layers.reduce((foundVariables: Variable[], layer: Layer) => {
      layer.style.variables
        .forEach((variable) => {
          const existingVariable = foundVariables
            .find((foundVariable) => foundVariable.namespace === variable.namespace)
          if(!existingVariable) {
            foundVariables.push(variable)
          }
        })
      return foundVariables
    }, [])
  }
}