import fs from 'fs'
import { Light } from './Lights'
import { Schema, config } from './schema'
import { Layer } from './Layer'
import { Style, StyleConf } from './Style'
import { variablesFromConfig, Variable } from './Variable'


// const styleFromConfig = (styleConf: IStyle[]) => {

//   return styleConf.map((variableProps: IVariable) => {
//     return new Variable(variableProps)
//   })
// }

async function main() {

  const variables: Variable[] = config.variables
    .map((variableConf) => new Variable(variableConf))

  const styles: Style[] = Object.entries(config.styles)
    .map(([id, styleProps]) => new Style(id, styleProps, variables))

  const layers: Layer[] = Object.entries(config.layers)
    .map(([id, layerProps]) => new Layer(id, layerProps, variables, styles))

  const lights: Light[] = config.lights
    .map((lightConf) => new Light(lightConf, variables, styles, layers))


}

main()