import { ALIAS_PREFIX, ID_PREFIX } from "./App"
import { Layer } from "./Layer"
import { Light } from "./Light"
import { Automation } from "./types/home-assistant/Automation"
import { InputBooleanInput, InputBooleanProps } from "./types/home-assistant/InputBoolean"
import { Script } from "./types/home-assistant/Script"
import { Variable } from "./Variable"

export const createLayerToggleId = (scene: Scene): string => 
  `${ID_PREFIX}_scene_${scene.id}_status` 

export const sceneToggleId = (scene: Scene) => {
  return `fsfr_scene_${scene.id}`
}

export const createSceneToggles = (scenes: Scene[], inputBooleans) => {
  scenes.forEach((scene: Scene) => {
    inputBooleans.push(createSceneToggle(scene))
  })
}

const createSceneToggle = (scene: Scene): InputBooleanProps => {
  return {
    id: sceneToggleId(scene),
    icon: 'mdi:<some-icon>',
    name: 'some name'
  }
}

export class Scene {
  id: string
  layers: Layer[]

  constructor(id) {
    this.id = id
    this.layers = []
  }

  addLayer(layer: Layer, scene: Scene) {
    this.layers.push(layer)
  }

  getVariables(): Variable[] {
    return this.layers.reduce((foundVariables, layer) => {
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

  get() {
    return {
      id: this.id,
      layers: this.layers.map(layer => layer.get())
    }
  }

}