import fs from 'fs'
import { Light } from './Light'
import { Schema, config } from './schema'
import { Layer } from './Layer'
import { Style, StyleConf } from './Style'
import { variablesFromConfig, Variable } from './Variable'
import { build } from './Build'
import { Scene } from './Scene'

export const ID_PREFIX = 'fsfr'
export const ALIAS_PREFIX = 'FSFR::'



function main() {

  const variables: Variable[] = config.variables
    .map((variableConf) => new Variable(variableConf))

  const styles: Style[] = Object.entries(config.styles)
    .map(([id, styleProps]) => new Style(id, styleProps, variables))

  const scenes: Scene[] = []

  const layers: Layer[] = Object.entries(config.layers)
    .map(([id, layerProps]) => new Layer(id, layerProps, variables, styles, scenes))


  const lights: Light[] = config.lights
    .map((lightConf) => new Light(lightConf, variables, styles, scenes, layers))
  
  lights.forEach(l => console.log(l.layers))


  // build(variables, styles, scenes, layers, lights)

}

main()