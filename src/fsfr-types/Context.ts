



// export const getContextCheckScriptId = (light: Light, context: Context): string => 
// `fsfr_${light.id}_check_${context.id}`

import { InputBoolean } from "../ha-config-types"
import { Layer, Variable, Light } from "./"

// export const getLightContextSelectorId = (light: Light) =>
//   `fsfr_${light.id}_contexts`

export class Context {
  id: string
  layers: Layer[]

  constructor(id: string) {
    this.id = id
    this.layers = []
  }

  addLayer(layer: Layer) {
    this.layers.push(layer)
  }


  get lights() {
    return this.layers.reduce((allLights, layer) => {
      return [...allLights, ...layer.lights]
    }, [] as Light[])
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