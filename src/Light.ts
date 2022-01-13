import { Style } from "./Style"
import { Layer, LayerProps } from "./Layer"
import { Variable } from "./Variable"
import { Scene } from "./scene/Scene"
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
    this.layers = []

    lightConf.layers.forEach((layerProps) => {
      if (typeof layerProps === 'string') {
        const layer: Layer = layers.find((layer) => layerProps === layer.id)
        if (!layer) {
          throw new Error('layer is not defined')
        } else {
          this.layers.push(layer)
        }
      } else {
        const layer = new Layer(null, layerProps, variables, styles, scenes)
        layer.lights.push(this)
        this.layers.push(layer)
      }
    })

  }
}