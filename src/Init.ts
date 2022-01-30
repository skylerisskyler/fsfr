import { Schema } from "./schema";
import {
  Style,
  Context,
  Layer,
  Light,
  Variable
} from "./fsfr-types";

export interface Abstractions {
  styles: Style[];
  contexts: Context[];
  layers: Layer[];
  lights: Light[];
  variables: Variable[];
}


export function init(config: Schema): Abstractions {

  let variables: Variable[] = []
  console.log(config.variables)
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

  let layers: Layer[] = []
  if(config.layers) {
  layers = config.layers
    .map(layerConf => new Layer(layerConf, variables, styles, contexts))
  }

  const lights: Light[] = config.lights
    .map((lightConf) => new Light(lightConf, variables, styles, contexts, layers))

  return {
    styles,
    contexts,
    layers,
    lights,
    variables,
  }
}