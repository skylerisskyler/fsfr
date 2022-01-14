import { Light } from './Light.ts'
import { Schema, config } from './schema.ts'
import { Layer } from './Layer.ts'
import { Style, StyleConf } from './Style.ts'
import { Variable } from './Variable.ts'
import { build } from './Build.ts'
import { Scene } from './scene/Scene.ts'

export const ID_PREFIX = 'fsfr'
export const ALIAS_PREFIX = 'FSFR::'


 
function main() {

  // let variables: Variable[] = []
  // if(config.variables) {
  //   variables.concat(
  //     config.variables.map((variableConf) => new Variable(variableConf))
  //   )
  // }
    
  // let styles: Style[] = []
  // if(config.styles) {
  //   styles.concat(
  //     Object.entries(config.styles)
  //       .map(([id, styleProps]) => new Style(id, styleProps, variables))
  //   )
  // }

  // console.log(variables)
  
  // const scenes: Scene[] = []
    
  // const layers: Layer[] = Object.entries(config.layers)
  //   .map(([id, layerProps]) => new Layer(id, layerProps, variables, styles, scenes))

    
  // const lights: Light[] = config.lights
  //   .map((lightConf) => new Light(lightConf, variables, styles, scenes, layers))
  
  // console.log(lights)
  
  // const configuration = build(variables, styles, scenes, layers, lights)



  // fs.writeFileSync('./configuration.yaml', yaml.stringify(config))
  // fs.writeFileSync('./configuration.yaml', yaml.stringify(configuration))
}

main()