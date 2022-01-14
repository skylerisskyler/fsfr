import { Automation } from "../types/home-assistant/Automation.ts"
import { Scene } from "./Scene.ts"
import { getSceneToggleId } from "./toggle.ts"

export const getSceneDactAutoId = (scene: Scene): string => 
`fsfr_${scene.id}_deactivation`


export const createSceneDeactivationAutomation = (scene: Scene, automations: Automation[]) => {

  const automation = new Automation({
    id: getSceneDactAutoId(scene)
  })

  automation.addTrigger({
    platform: 'state',
    entity_id: `automation.${getSceneToggleId(scene)}`,
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
