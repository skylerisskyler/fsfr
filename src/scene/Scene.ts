import { ALIAS_PREFIX, ID_PREFIX } from "../App.ts"
import { Layer } from "../Layer.ts"
import { Light } from "../Light.ts"
import { Automation } from "../types/home-assistant/Automation.ts"
import { InputBooleanInput, InputBooleanProps } from "../types/home-assistant/InputBoolean.ts"
import { Script } from "../types/home-assistant/Script.ts"
import { Variable } from "../Variable.ts"

interface SceneConf {
  id: string
}

export const getSceneToggleId = (scene: Scene) => {
  return `fsfr_scene_${scene.id}`
}
export const getSceneDactAutoId = (scene: Scene): string => 
`fsfr_${scene.id}_deactivation`


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

  createOffAutomation(): Automation {
    
  const automation: Automation = new Automation({
    id: getSceneDactAutoId(this)
  })

  automation.addTrigger({
    platform: 'state',
    entity_id: `automation.${getSceneToggleId(this)}`,
    to: 'off'
  })

  const variablesInScene = this.getVariables()

  variablesInScene.forEach((variable) => {
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

  this.layers.forEach((sceneLayer) => {
    sceneLayer.lights.forEach((sceneLight) => {
      // console.log(sceneLight)
    const idx = sceneLight.layers.findIndex(sceneLight => sceneLight.scene.id === this.id)
    const nextScene: Scene = sceneLight.layers[idx + 1].scene
    if(!nextScene) {
      automation.addAction({
        service: 'light.turn_off',
        entity_id: sceneLight.entityId[0]  //todo fix array issue  
      })
    } else {
      automation.addAction({
        service: `script.${sceneLight.entityId}_${nextScene}_check`
      })
    }
    })
  })


    return automation
  }

  getVariables(): Variable[] {
    return this.layers.reduce((foundVariables: Variable[], layer: Layer) => {
      Object.entries(layer.style.variables)
        .forEach(([_, variable]) => {
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