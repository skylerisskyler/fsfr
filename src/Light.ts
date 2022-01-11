import { Style } from "./Style"
import { Layer, LayerConf, LayerProps } from "./Layer"
import { Variable } from "./Variable"
import { Scene } from "./Scene"
import _ from 'lodash'

export interface LightConf {
  entityId: string | string[]
  layers: (LayerProps | string)[]
}

export class Light {
  entityId: string | string[]
  layers: Layer[]

  constructor(lightConf: LightConf, variables: Variable[], styles: Style[], scenes: Scene[], layers: Layer[]) {

    this.entityId = lightConf.entityId

    this.layers = lightConf.layers.map((layerProps) => {
      if (typeof layerProps === 'string') {
        const layer = layers.find((layer) => layerProps === layer.id)
        if (!layer) {
          throw new Error('layer is not defined')
        } else {
          return layer
        }
      } else {
        return new Layer(null, layerProps, variables, styles, scenes)
      }
    })

  }
}