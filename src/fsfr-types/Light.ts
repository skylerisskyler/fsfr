import { Style } from "./Style"
import { Layer, LayerConf } from "./Layer"
import { Variable } from "./Variable"
import { Context } from "./Context"
import { Script } from '../ha-config-types/Script'
import { createInfHandlerScripts, createSupHandlerScripts } from "../entity-builders/ContextHandlerScripts"
import { createListenCurrContextOffScript, createListenInfContextOffScript, createListenInfContextOnScript, createSuperiorContextOnListener } from "../entity-builders/ListenerScripts"
import { applyContextToLightScripts } from "../entity-builders/ApplyContextScript"
import { createInitializerScript } from "../entity-builders/InitializerScript"


export interface LightConf {
  id: string | string[]
  layers: (LayerConf | string)[]

}

export class Light {
  id: string | string[]
  layers: Layer[]

  constructor(
    conf: LightConf,
    variables: Variable[],
    styles: Style[],
    contexts: Context[],
    layers: Layer[],
  )
  {

    const entityIdToId = (id: string) => id.replace('light.', '')

    if(Array.isArray(conf.id)) {
      if(conf.id.length > 1) {
        this.id = conf.id.map((id) => entityIdToId(id))
      } else {
        this.id = entityIdToId(conf.id[0])
      }
    } else {
      this.id = entityIdToId(conf.id)
    }

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
          contexts
        )
        layer.lights.push(this)
        this.layers.push(layer)
      }
    })



  }

  get entityId() {
    if(Array.isArray(this.id)) {
      return this.id.map((id) => 'light.' + id)
    } else {
      return 'light.' +  this.id
    }
  }

  get default() {
    return false
  }

  getNextContext(currentContext: Context): Context | undefined {
    const layerIdx = this.layers.findIndex(layer => currentContext.id === layer.context.id)
    return this.layers[layerIdx + 1].context
  }

  get contexts() {
    return this.layers.map(layer =>  layer.context)
  }

}