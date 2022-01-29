import { Light } from './fsfr-types/Light'
import { Schema, config } from './schema'
import { Layer } from './fsfr-types/Layer'
import { Style, StyleConf } from './Style'
import { Variable } from './fsfr-types/Variable'
import { build } from './Build'
import { Context } from './fsfr-types/Context'

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

  const contexts: Context[] = []

  const layers: Layer[] = config.layers
    .map(layerConf => new Layer(layerConf, variables, styles, contexts))

  const lights: Light[] = config.lights
    .map((lightConf) => new Light(lightConf, variables, styles, contexts, layers))

  const configuration = build(variables, styles, contexts, layers, lights)

}

main()