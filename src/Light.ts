import { Style } from "./Style.ts"
import { Layer, LayerConf } from "./Layer.ts"
import { Variable } from "./Variable.ts"
import { Scene } from "./scene/Scene.ts"

export interface LightConf {
  entityId: string | string[]
  layers: (LayerConf | string)[]
}

export class Light {
  entityId: string | string[]
  layers: Layer[]

  constructor(
    conf: LightConf,
    variables: Variable[],
    styles: Style[],
    scenes: Scene[],
    layers: Layer[]
  )
  {

    this.entityId = conf.entityId
    this.layers = []

    conf.layers.forEach((layerConf) => {
      if (typeof layerConf === 'string') {
        const layer: Layer | undefined = layers.find((layer) => layerConf === layer.id)
        if (!layer) {
          throw new Error('layer is not defined')
        } else {
          this.layers.push(layer)
        }
      } else {
        const layer = new Layer(
          layerConf,
          variables,
          styles,
          scenes
          )
        layer.lights.push(this)
        this.layers.push(layer)
      }
    })

  }

  getNextScene(currentScene: Scene): Scene | undefined {
    const layerIdx = this.layers.findIndex(layer => currentScene.id === layer.scene.id)
    return this.layers[layerIdx + 1].scene
  }
}