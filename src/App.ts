import { Light } from './Light.ts'
import { Schema, config } from './schema.ts'
import { Layer } from './Layer.ts'
import { Style, StyleConf } from './Style.ts'
import { Variable } from './Variable.ts'
import { build } from './Build.ts'
import { Scene } from './scene/Scene.ts'

export const ID_PREFIX = 'fsfr'
export const ALIAS_PREFIX = 'FSFR::'

import {
  parse as yamlParse,
  parseAll as yamlParseAll,
  stringify as yamlStringify,
} from 'https://deno.land/std@0.82.0/encoding/yaml.ts';


 
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

  await Deno.writeTextFile("./configuration.json", JSON.stringify(configuration));

}

main()