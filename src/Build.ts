import { Layer } from "./Layer";
import { Light } from "./Light";
import { createSceneToggles, Scene, sceneToggleId } from "./Scene";
import { Style } from "./Style";
import { Action, ServiceAction } from "./types/home-assistant/Action";
import { Automation } from "./types/home-assistant/Automation";
import { StateCondition } from "./types/home-assistant/Condition";
import { InputBooleanConf, InputBooleanInput } from "./types/home-assistant/InputBoolean";
import { InputNumberProps } from "./types/home-assistant/InputNumber";
import { Script } from "./types/home-assistant/Script";
import { Trigger } from "./types/home-assistant/Trigger";
import { Variable } from "./Variable";

export function build(variables: Variable[], styles: Style[], scenes: Scene[], layers: Layer[], lights: Light[]) {
  const automations: Automation[] = []
  const scripts: Script[] = []
  const inputNumbers: InputNumberProps[] = []
  const inputBooleans: InputBooleanInput[] = []

  createSceneToggles(scenes, inputBooleans)

  const sceneDeactivationAutomationId = (scene: Scene): string => 
    `fsfr_${scene.id}_deactivation`


  const sceneDeactivation = (scene: Scene, automations) => {
    
    const automation = new Automation({
      id: sceneDeactivationAutomationId(scene)
    })

    automation.addTrigger({
      platform: 'state',
      entity_id: `automation.${sceneToggleId(scene)}`,
      to: 'off'
    })

    const variablesInScene = scene.getVariables()

    variablesInScene.forEach((variable) => {
      automation.addAction({
        service: 'script.turn_on',
        entity_id: `script.fsfr_${scene.id}_var_${variable.namespace}_deactivation`,
        data: {
          variables: {
            namespace: variable.namespace,
            scene: scene.id
          }
        }
      })
    })

    // scene.layers.forEach((sceneLayer) => {
    //   sceneLayer.lights.forEach((sceneLight) => {
    //     // console.log(sceneLight)
    //   const idx = sceneLight.layers.findIndex(sceneLight => sceneLight.scene.id === scene.id)
    //   const nextScene: Scene = sceneLight.layers[idx + 1].scene
    //   if(!nextScene) {
    //     automation.addAction({
    //       service: 'light.turn_off',
    //       entity_id: sceneLight.entityId[0]  //todo fix array issue  
    //     })
    //   } else {
    //     automation.addAction({
    //       service: `script.${sceneLight.entityId}_${nextScene}_check`
    //     })
    //   }
    //   })
    // })
  

    automations.push(automation)
  }

  const createSceneAutomations = (scenes: Scene[], automations: Automation[]) => {
    scenes.forEach((scene: Scene) => {
      sceneDeactivation(scene, automations)
    })
  }

  createSceneAutomations(scenes, automations)
  console.log(automations)



  return {
    automations,
    inputBooleans
  }
}