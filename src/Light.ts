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

    scripts.push(...createInfHandlerScripts(this))
    scripts.push(...createSuperiorHandlerScripts(this))
    scripts.push(createSuperiorSceneOnListener(this))
    scripts.push(createListenInfSceneOnScript(this))
    scripts.push(...lightSceneApplyScripts(this))

    return scripts
  }
}

//////////////////////////////
//////////////////////////////
/////////////////////////////
//////////////////////////////



const FIRST_INF_SCENE_SCRIPT = "first_inf_scene_script"
const CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE = "current_scene_toggle_id"
const INF_SCENE_TOGGLE_ID_VAR_NAMESPACE = "inf_scene_toggle_id"
const APPLY_SCENE_SCRIPT_ID = "apply_scene_script_id"
const ATTACH_VARS_IN_SCENE_ID = "attach_vars_in_scene_id"
const DETACH_VARS_IN_SCENE_ID = "detach_vars_in_scene_id"

const infSceneLoopVariables = {
  [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`,
  [FIRST_INF_SCENE_SCRIPT]: `{{ ${FIRST_INF_SCENE_SCRIPT} }}`
}


// Scene handler ids
const getInfSceneHandlerScriptId = (light: Light, scene: Scene) => `handle_inf_${light.id}_${scene.id}`
const getSupSceneHandlerScriptId = (light: Light, scene: Scene) => `handle_sup_${light.id}_${scene.id}`

// scene listener ids
const getSupSceneOnListenerScript = (light: Light) => `${light.id}_sup_scene_listener`
const getInfSceneOnListenerId = (light: Light) => `${light.id}_inf_scene_on_listener`
const getInfSceneOffListenerId = (light: Light) => `${light.id}_inf_scene__off_listener`
const getInfCurrSceneOffListenerId = (light: Light) => `${light.id}_curr_scene__off_listener`

const getApplySceneToLightScriptId = (scene: Scene, light: Light) => `apply_scene_${scene.id}_to_light_${light.id}`

const getDefaultId = (light: Light) => `default_layer_${light.id}`

const getTurnOffInfListenersPassthroughId = (light: Light)  => `passthrough_${light.id}`

const getVarAttachScriptId = (light: Light, scene: Scene) => `ATTACH LIGHT TO VARIABLES IN layer`
const getVarDetachScriptId = (light: Light, scene: Scene) => `DETACH LIGHT FROM VARIABLES IN Layer`


const toScriptEntityId = (id: string) => `script.${id}`



function createInfHandlerScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .slice(1)
    .map((layer, idx, layers) => {

      const { scene } = layer

      const script: Script = new Script({
        id: getInfSceneHandlerScriptId(light, scene),
        alias: 'some alias'
      })

      const onChoice = new ChooseActionChoice(`if ${scene.id} is on`)
        .addCondition({
          alias: `CONDITION: check ${scene.id} is on`,
          condition: 'state',
          entity_id: 'input_boolean.' + getSceneToggleId(scene),
          state: 'on'
        })
        .addAction({
          alias: `ACTION: initialize current scene off listener`,
          service: 'script.turn_on',
          target: {entity_id: getInfCurrSceneOffListenerId(light)},
          data: {
            variables: {
              ...infSceneLoopVariables,
              callback: getApplySceneToLightScriptId(scene, light)
            }
          }
        })
        .addAction({
          alias: `ACTION: initialize ${scene.id} scene off listener`,
          service: 'script.turn_on',
          target: {entity_id: getInfSceneOffListenerId(light)},
          data: {
            variables: {
              ...infSceneLoopVariables
              // what other variables should we pass through?
            }
          }
        })

      const offChoice = new ChooseActionChoice(`if ${scene.id} is off`)
      .addCondition({
        alias: `CONDITION: check ${scene.id} is off`,
        condition: 'state',
        entity_id: 'input_boolean.' + getSceneToggleId(scene),
        state: 'off'
      })
      .addAction({
        alias: "ACTION: Initialize this scene on listener",
        service: 'script.turn_on',
        target: {entity_id: getInfSceneOnListenerId(light) }, //add to script
        data: {
          variables: {
            ...infSceneLoopVariables,
            [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT,
            [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE,
          }
        }
      })

    const nextLayer: Layer | undefined = layers[idx + 1]

    if(nextLayer) {

      offChoice.addAction({
        alias: `ACTION: turn on next scene ${nextLayer.scene.id} handler`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getInfSceneHandlerScriptId(light, nextLayer.scene))},
        data: {
          variables: {
            ...infSceneLoopVariables,
          }
        }
      })
    } else {
      offChoice.addAction({
        alias: `ACTION: Turn on default layer of none other exists`,
        service: 'script.turn_on',
        target: {entity_id: toScriptEntityId(getDefaultId(light))},
      })
    }

    script
      .addAction(
        new ChooseAction('Is inferior scene on or off?')
        .addChoice(offChoice)
        .addChoice(onChoice)
      )

    return script
  })

  const defaultScript: Script = new Script({
    alias: `SCRIPT: default`,
    id: getDefaultId(light),
  })

  if(!light.default) {
    defaultScript.addAction({
      alias: `ACTION: turn off ${light.id}`,
      service: 'light.turn_off',
      target: {entity_id: light.entityId}
    })
  }
    
  scripts.push(defaultScript)

  return scripts
}




function createListenInfSceneOnScript(light: Light) {

  const script: Script = new Script({
    id: getInfSceneOnListenerId(light),
    alias: 'SCRIPT: Listen for inf scene on'
  })
  .addAction({
    wait_template: `{{ is_state(${INF_SCENE_TOGGLE_ID_VAR_NAMESPACE}, 'on') }}`
  })
  .addAction({
    service: 'script.turn_on',
    target: {entity_id: getTurnOffInfListenersPassthroughId(light)},
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
    target: {entity_id: getTurnOffInfListenersPassthroughId(light)},
    data: {
      variables: {
        [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT,
        [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: `{{ ${CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE} }}`
      }
    }
  })

  return script
}



function createTurnOffInfListenersPassthrough(light: Light) {

  const script: Script = new Script({
    id: getTurnOffInfListenersPassthroughId(light),
    alias: 'some alias'
  })
  .addAction({
    alias: "ACTION: Turn off inferior scene on listener",
    service: "script.turn_off",
    target: {
      entity_id: toScriptEntityId(getInfSceneOnListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Turn off inferior scene off listener",
    service: "script.turn_off",
    target: {
      entity_id: toScriptEntityId(getInfSceneOffListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Turn off current scene off listener",
    service: "script.turn_off",
    target: {
      entity_id:  toScriptEntityId(getInfCurrSceneOffListenerId(light))
    }
  })
  .addAction({
    alias: "ACTION: Call apply scene or scene handler",
    service: "script.turn_on",
    target: {
      entity_id: `{{ call_back }}`
    },
    data: {
      variables: {
        [FIRST_INF_SCENE_SCRIPT]: FIRST_INF_SCENE_SCRIPT
      }
    }
  })

  return script

}


function lightSceneApplyScripts(light: Light) {
  return light.layers.map((layer, idx, layers) => {

    const { scene } = layer

    const script: Script = new Script({
      id: getApplySceneToLightScriptId(scene, light),
      alias: `SCRIPT: Apply scene ${scene.id} to light`
    })
    .addAction({
      alias: "ACTION: Turn off superior scene on listener",
      service: "script.turn_off",
      target: {
        entity_id: toScriptEntityId(getSupSceneOnListenerScript(light))
      }
    })
    .addAction({
      alias: `ACTION: Detach variables of ${light} in ${scene}`,
      service: `{{ ${DETACH_VARS_IN_SCENE_ID} }}`,
    })
    .addAction({
      alias: `ACTION: Attach variables of ${light} in ${scene}`,
      service: `{{ ${ATTACH_VARS_IN_SCENE_ID} }}`,
    })
    .addAction({
      alias: `ACTION: turn on light ${light.id} with data of ${scene}`,
      service: "light.turn_on",
      target: {entity_id: light.entityId},
      data: layer.style.data
    })

    const firstSuperiorLayer: Layer | undefined = layers[idx +1]

    if(firstSuperiorLayer) {
      script.addAction({
        alias: "ACTION: Turn on the first inferior scene handler",
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getSupSceneHandlerScriptId(light, firstSuperiorLayer.scene))},
        data: {
          variables: {
            [CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE]: getSceneToggleId(scene),
            [FIRST_INF_SCENE_SCRIPT]: getInfSceneHandlerScriptId(light, scene)
          }
        }
      })
    }

    const firstInferiorLayer: Layer | undefined = layers[idx - 1]

    if(firstInferiorLayer) {
      script.addAction({
        alias: `ACTION: Turn on the first inferior scene handler`,
        service: "script.turn_on",
        target: {entity_id: toScriptEntityId(getInfSceneHandlerScriptId(light, firstInferiorLayer.scene))},
        data: {
          variables: {
            CURRENT_SCENE_TOGGLE_ID_VAR_NAMESPACE, //this is prob not it
            next_inf_scene_script: getInfSceneHandlerScriptId
          }
        }
      })
    }

    return script
  })
}









function createVarAttachScripts(light: Light): Script[] {

  return light.layers.map(layer => {
    
    const { scene } = layer

    const script: Script = new Script({
      id: getVarAttachScriptId(light, scene),
      alias: 'some alias'
    })

    layer.style.variables.forEach((variable: Variable) => {
      script.addAction({
        service: 'script.turn_on',
        target: {entity_id: `script.util_add_light_to_var`},
        data: {
          variables: {
            light_to_add: light.entityId
          }
        }
      })
    })

    return script
    
  })
}

function createVarDetachScripts(light: Light): Script[] {

  return light.layers.map(layer => {
    
    const { scene } = layer

    const script: Script = new Script({
      id: getVarDetachScriptId(light, scene),
      alias: 'some alias'
    })

    layer.style.variables.forEach((variable: Variable) => {
      script.addAction({
        service: 'script.turn_on',
        target: {entity_id: `script.util_remove_light_from_var`},
        data: {
          variables: {
            light_to_remove: light.entityId
          }
        }
      })
    })

    return script
    
  })
}















function createSuperiorHandlerScripts(light: Light) {

  const scripts: Script[] =  light.layers
    .reverse()
    .slice(1)
    .map(layer => {

      const { scene } = layer

      const script: Script = new Script({
        id: `sup_${light.id}_${scene.id}_handle`,
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

function createSuperiorSceneOnListener(light: Light) {

  const superiorSceneListener: Script = new Script({
    id: getSupSceneOnListenerScript(light),
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
