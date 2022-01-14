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

export class Scene {
  id: string
  layers: Layer[]

  constructor(conf: any) {
    this.id = conf.id
    this.layers = []
  }

  addLayer(layer: Layer, scene: Scene) {
    this.layers.push(layer)
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