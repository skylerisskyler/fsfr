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

    scripts.push(...createInfCheckScripts(this))
    scripts.push(...createSuperiorChecksScripts(this))
    scripts.push(createSuperiorSceneOnListener(this))
    scripts.push(createListenInfSceneOnScript(this))
    scripts.push(...lightSceneApplyScripts(this))

    return scripts
  }
}

const getInfSceneOnListenerId = (light: Light) => `${light.id}_inf_scene_on_listener`
const getInfSceneOffListenerId = (light: Light) => `${light.id}_inf_scene__off_listener`
const getCurrSceneOffListenerId = (light: Light) => `${light.id}_curr_scene__off_listener`

const FIRST_INF_SCENE_SCRIPT = "first_inf_scene_script"
const CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE = "current_scene_toggle_id"

const getSuperiorScriptListenerId = (light: Light) => `${light.id}_sup_scene_listener`
const getInferiorCheckScriptId = (light: Light, scene: Scene) => `check_inf_${light.id}_${scene.id}`
const getApplySceneToLightScriptId = (scene: Scene, light: Light) => `apply_scene_${scene.id}_to_light_${light.id}`
const getInitInfSceneCheckId = (light: Light) => `init_inf_scene_checks_${light.id}`
const getInfSceneCheckId = (light: Light) => `init_inf_scene_checks_${light.id}`

function createSuperiorChecksScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .reverse()
    .slice(1)
    .map(layer => {

      const { scene } = layer

      const script: Script = new Script({
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

      return script
    })

  return scripts
}

function createInfCheckScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .slice(1)
    .map((layer, idx, layers) => {

      const { scene } = layer

      const script: Script = new Script({
        id: getInferiorCheckScriptId(light, scene),
        alias: 'some alias'
      })

      const offChoice = new ChooseActionChoice(`if ${scene.id} is off`)
        .addCondition({
          condition: 'state',
          entity_id: 'input_boolean.' + getSceneToggleId(scene),
          state: 'off'
        })
        .addAction({
          alias: "Initialize this scene on listener",
          service: 'script.turn_on',
          target: {entity_id: getInfSceneOnListenerId(light) },
          data: {
            variables: {
              scene_toggle_id: getSceneToggleId(scene),
              [FIRST_INF_SCENE_SCRIPT]: `{{ ${FIRST_INF_SCENE_SCRIPT} }}`
            }
          }
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

      }

      const onChoice = new ChooseActionChoice(`if ${scene.id} is on`)
        .addCondition({
          condition: 'state',
          entity_id: 'input_boolean.' + getSceneToggleId(scene),
          state: 'on'
        })
        .addAction({
          service: 'script.turn_on',
          target: {entity_id: getCurrSceneOffListenerId(light)},
          data: {
            variables: {
              apply_scene_script_id: getApplySceneToLightScriptId(scene, light)
            }
          }
        })
        .addAction({
          service: 'script.turn_on',
          target: {entity_id: getInfSceneOffListenerId(light)},
          data: {
            variables: {
              apply_scene_script_id: getApplySceneToLightScriptId(scene, light)
            }
          }
        })
  
      script
        .addAction(
          new ChooseAction('some alias')
          .addChoice(offChoice)
          .addChoice(onChoice)
        )

      return script
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



function createListenInfSceneOnScript(light: Light) {

  const script: Script = new Script({
    id: getInfSceneOnListenerId(light),
    alias: 'some alias'
  })
  .addAction({
    wait_template: "{{ is_state(scene_toggle_id, 'on') }}"
  })
  .addAction({
    service: 'script.turn_on',
    target: {entity_id: getInitInfSceneCheckId(light)},
    data: {
      variables: {
        [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT,
        [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`
      }
    }
  })

  return script
}

function createListenInfSceneOffScript(light: Light) {

  const script: Script = new Script({
    id: getInfSceneOffListenerId(light),
    alias: 'some alias',
    mode: 'parallel'
  })
  .addAction({
    wait_template: "{{ is_state(scene_toggle_id, 'off') }}"
  })
  .addAction({
    service: 'script.turn_on',
    target: {entity_id: getInitInfSceneCheckId(light)},
    data: {
      variables: {
        [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT,
        [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`
      }
    }
  })

  return script
}



function createInitInfSceneChecks(light: Light) {

  const script: Script = new Script({
    id: getInitInfSceneCheckId(light),
    alias: 'some alias'
  })
  .addAction({
    service: "script.turn_off",
    target: {
      entity_id: 'script.' + getInfSceneOnListenerId(light)
    }
  })
  .addAction({
    service: "script.turn_off",
    target: {
      entity_id: 'script.' + getInfSceneOffListenerId(light)
    }
  })
  .addAction({
    service: "script.turn_off",
    target: {
      entity_id: 'script.' + getCurrSceneOffListenerId(light)
    }
  })
  .addAction({
    service: "script.turn_on",
    target: {
      entity_id: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`
    }
  })

  return script

}

function lightSceneApplyScripts(light: Light) {
  return light.layers.map((layer) => {

    const script: Script = new Script({
      id: getApplySceneToLightScriptId(layer.scene, light),
      alias: 'some alias'
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
    //add this stuff man
    return script
  })
}