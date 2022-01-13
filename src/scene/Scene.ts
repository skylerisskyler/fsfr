import { ALIAS_PREFIX, ID_PREFIX } from "../App"
import { Layer } from "../Layer"
import { Light } from "../Light"
import { Automation } from "../types/home-assistant/Automation"
import { InputBooleanInput, InputBooleanProps } from "../types/home-assistant/InputBoolean"
import { Script } from "../types/home-assistant/Script"
import { Variable } from "../Variable"



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
}