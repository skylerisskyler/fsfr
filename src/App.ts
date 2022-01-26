import { Light } from './fsfr-types/Light'
import { Schema, config } from './schema'
import { Layer } from './fsfr-types/Layer'
import { Style, StyleConf } from './Style'
import { Variable } from './fsfr-types/Variable'
import { build } from './Build'
import { Scene } from './fsfr-types/Scene'

export const ID_PREFIX = 'fsfr'
export const ALIAS_PREFIX = 'FSFR::'

 
async function main() {

  let variables: Variable[] = []
  if(config.variables) {
    variables = variables.concat(
      config.variables.map((variableConf) => new Variable(variableConf))
    )
  }
    
  let styles: Style[] = []
  if(config.styles) {
    styles = styles.concat(
      Object.entries(config.styles)
        .map(([id, styleProps]) => new Style(id, styleProps, variables))
    )
  }

  const scenes: Scene[] = []

  const layers: Layer[] = config.layers
    .map(layerConf => new Layer(layerConf, variables, styles, scenes))

  const lights: Light[] = config.lights
    .map((lightConf) => new Light(lightConf, variables, styles, scenes, layers))

  const configuration = build(variables, styles, scenes, layers, lights)

}

main()