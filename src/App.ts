import fs from 'fs'
import { Schema, config } from './schema'
import { Layer } from './types/Layer'
import { Style, StyleConf } from './types/Style'
import { variablesFromConfig, Variable } from './types/Variable'


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

  const layers: Layer[] = config.layers
    .map((layerConf) => new Layer(layerConf, styles, variables))


}

main()