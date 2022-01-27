import { Style } from "../Style"
import { Layer, LayerConf } from "./Layer"
import { Variable } from "./Variable"
import { Scene } from "./Scene"
import { Script } from '../ha-config-types/Script'
import { createInfHandlerScripts, createSupHandlerScripts } from "../script-builders/SceneHandlerScripts"
import { createListenCurrSceneOffScript, createListenInfSceneOffScript, createListenInfSceneOnScript, createSuperiorSceneOnListener } from "../script-builders/ListenerScripts"
import { applySceneToLightScripts } from "../script-builders/ApplySceneScript"
import { getApplySceneToLightScriptId } from "../script-builders/IdGenerators"


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
    scenes: Scene[],
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
          scenes
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

  getNextScene(currentScene: Scene): Scene | undefined {
    const layerIdx = this.layers.findIndex(layer => currentScene.id === layer.scene.id)
    return this.layers[layerIdx + 1].scene
  }

  get scenes() {
    return this.layers.map(layer =>  layer.scene)
  }

  createScripts() {

    const scripts: Script[] = []

    scripts.push(...applySceneToLightScripts(this))
    scripts.push(...createSupHandlerScripts(this))
    scripts.push(...createInfHandlerScripts(this))
    scripts.push(createListenCurrSceneOffScript(this))
    scripts.push(createListenInfSceneOffScript(this))
    scripts.push(createListenInfSceneOnScript(this))


    // scripts.push(createSuperiorSceneOnListener(this))
    // scripts.push(...lightSceneApplyScripts(this))

    return scripts
  }
}

