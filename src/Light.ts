import { Style } from "./Style.ts"
import { Layer, LayerProps } from "./Layer.ts"
import { Variable } from "./Variable.ts"
import { Scene } from "./scene/Scene.ts"

export interface LightConf {
  entityId: string | string[]
  layers: (LayerProps | string)[]
}

export class Light {
  entityId: string | string[]
  layers: Layer[]

  constructor(conf: LightConf, variables: Variable[], styles: Style[], scenes: Scene[], layers: Layer[]) {

    this.entityId = conf.entityId
    this.layers = []



    conf.layers.forEach((layerProps) => {
      if (typeof layerProps === 'string') {
        const layer: Layer | undefined = layers.find((layer) => layerProps === layer.id)
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