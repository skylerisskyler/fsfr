import { Style } from "./Style.ts"
import { Layer, LayerConf } from "./Layer.ts"
import { Variable } from "./Variable.ts"
import { Scene, getSceneToggleId, getLightSceneSelectorId } from "./scene/Scene.ts"
import { Script } from './types/home-assistant/Script.ts'
import {ChooseAction, ChooseActionChoice} from './types/home-assistant/Action.ts'

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
    layers: Layer[]
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


  getNextScene(currentScene: Scene): Scene | undefined {
    const layerIdx = this.layers.findIndex(layer => currentScene.id === layer.scene.id)
    return this.layers[layerIdx + 1].scene
  }

  get scenes() {
    return this.layers.map(layer =>  layer.scene)
  }

  createScripts() {

    const scripts: Script[] = []

    scripts.push(...createInferiorChecks(this))

    return scripts
  }
}


function createInferiorChecks(light: Light) {

  const checkScripts: Script[] = []

  const { layers } = light


  const scripts: Script[] =  light.layers
    .slice(1)
    .map((layer, idx, layers) => {

      const { scene } = layer

      const checkScript: Script = new Script({
        id: `check_${light.id}_${scene.id}_check`,
        alias: 'some alias'
      })

      const offChoice = new ChooseActionChoice(`if ${scene.id} is off`)
        .addCondition({
          condition: 'state',
          entity_id: 'input_boolean.' + getSceneToggleId(layer.scene),
          state: 'off'
        })
        .addSequence({
          service: 'script.turn_on',
          target: {entity_id: `script.watch this scene is on`},
          data: {
            variables: {}
          }
        })

      const nextLayer: Layer | undefined = layers[idx + 1]

      if(nextLayer) {
        offChoice.addSequence({
          service: 'script.turn_on',
          target: {entity_id: `script.watch this scene is on`},
          data: {
            variables: {}
          }
        })
      }

      const onChoice = new ChooseActionChoice(`if ${scene.id} is on`)
        .addCondition({
          condition: 'state',
          entity_id: 'input_boolean.' + getSceneToggleId(layer.scene),
          state: 'on'
        })
        .addSequence({
          service: 'script.turn_on',
          target: {entity_id: `script.watch current scene off`},
          data: {
            variables: {}
          }
        })
  
      checkScript
        .addAction(
          new ChooseAction('some alias')
          .addChoice(offChoice)
          .addChoice(onChoice)
        )

      return checkScript
    })

  return scripts
}