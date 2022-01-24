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

    scripts.push(...createInferiorCheckScripts(this))
    scripts.push(...createSuperiorChecksScripts(this))
    scripts.push(createSuperiorSceneOnListener(this))
    scripts.push(createInferiorSceneListener(this))
    scripts.push(...lightSceneApplyScripts(this))

    return scripts
  }
}


const getInferiorScriptListenerId = (light: Light) => `${light.id}_inf_scene_listener`
const getSuperiorScriptListenerId = (light: Light) => `${light.id}_sup_scene_listener`
const getInferiorCheckScriptId = (light: Light, scene: Scene) => `check_inf_${light.id}_${scene.id}`


function createSuperiorChecksScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .reverse()
    .slice(1)
    .map((layer, idx, layers) => {

      const { scene } = layer

      const checkScript: Script = new Script({
        id: `sup_${light.id}_${scene.id}_check`,
        alias: 'some alias'
      })
      .addAction({
        service: 'script.turn_on',
        target: {entity_id: `script.watch this scene is on`},
        data: {
          variables: {}
        }
      })

      return checkScript
    })

  return scripts
}

function createInferiorCheckScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .slice(1)
    .map((layer, idx, layers) => {

      const { scene } = layer

      const inferiorCheckScript: Script = new Script({
        id: getInferiorCheckScriptId(light, scene),
        alias: 'some alias'
      })

      const offChoice = new ChooseActionChoice(`if ${scene.id} is off`)
        .addCondition({
          condition: 'state',
          entity_id: 'input_boolean.' + getSceneToggleId(layer.scene),
          state: 'off'
        })

      const nextLayer: Layer | undefined = layers[idx + 1]

      if(nextLayer) {
        offChoice.addAction({
          service: 'script.turn_on',
          target: {entity_id: 'script.' + getInferiorCheckScriptId(light, nextLayer.scene)},
          data: {
            variables: {}
          }
        })
        offChoice.addAction({
          service: 'script.turn_on',
          target: {entity_id: getInferiorScriptListenerId(light) },
          data: {
            variables: {
              scene_toggle_id: scene.id,
              first_inf_scene: nextLayer.scene.id
            }
          }
        })
      }

      const onChoice = new ChooseActionChoice(`if ${scene.id} is on`)
        .addCondition({
          condition: 'state',
          entity_id: 'input_boolean.' + getSceneToggleId(layer.scene),
          state: 'on'
        })
        .addAction({
          service: 'script.turn_on',
          target: {entity_id: `script.watch current scene off`},
          data: {
            variables: {}
          }
        })
  
      inferiorCheckScript
        .addAction(
          new ChooseAction('some alias')
          .addChoice(offChoice)
          .addChoice(onChoice)
        )

      return inferiorCheckScript
    })

  return scripts
}

function createSuperiorSceneOnListener(light: Light) {

  const superiorSceneListener: Script = new Script({
    id: getSuperiorScriptListenerId(light),
    alias: 'some alias'
  })
  .addAction({
    wait_template: "{{ is_state(scene_toggle_id, 'on') }}"
  })
  .addAction({
    service: 'script.turn_on',
    target: {entity_id: `script.apply_scene_to_light`},
    data: {
      variables: {}
    }
  })

  return superiorSceneListener
}

function createInferiorSceneListener(light: Light) {

  const inferiorSceneListener: Script = new Script({
    id: getInferiorScriptListenerId(light),
    alias: 'some alias'
  })
  .addAction({
    wait_template: "{{ is_state(scene_toggle_id, 'on') }}"
  })
  .addAction({
    service: 'script.turn_on',
    target: {entity_id: `"{{script.check_inf_${light.id}_ + next_scene_id}}"`},
    data: {
      variables: {
        
      }
    }
  })

  return inferiorSceneListener
}

function lightSceneApplyScripts(light: Light) {
  return light.layers.map((layer) => {

    const script: Script = new Script({
      id: `${layer.scene.id}_apply_${light.id}`,
      alias: 'some alias'
    })
    .addAction({
      service: "script.turn_off",
      target: {
        entity_id: 'script.' + getInferiorScriptListenerId(light)
      }
    })
    .addAction({
      service: "script.turn_off",
      target: {
        entity_id: 'script.' + getSuperiorScriptListenerId(light)
      }
    })

    layer.style.variables.forEach((variable: Variable) => {
      script.addAction({
        service: 'script.turn_on',
        target: {entity_id: `script.util_rmv_light_scene`},
        data: {
          variables: {
            var_namespace: variable.namespace,
            scene_id: layer.scene.id
          }
        }
      })
    })

    script.addAction({
      service: "light.turn_on",
      target: {entity_id: light.entityId},
      data: layer.style.data
    })

    return script
  })
}