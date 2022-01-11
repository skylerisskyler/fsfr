import { ALIAS_PREFIX, ID_PREFIX } from "./App"
import { Layer } from "./Layer"
import { Light } from "./Light"
import { Automation } from "./types/home-assistant/Automation"
import { InputBooleanInput } from "./types/home-assistant/InputBoolean"
import { Script } from "./types/home-assistant/Script"

export const createLayerToggleId = (scene: Scene): string => 
  `${ID_PREFIX}_scene_${scene.id}_status` 

export class Scene {
  id: string
  layers: Layer[]

  constructor(id) {
    this.id = id
    this.layers = []
  }

  addLayer(layer: Layer) {
    this.layers.push(layer)
  }

  compile(inputBooleans: InputBooleanInput[], automations: Automation[], script: Script[]) {

    const sceneToggleId = createLayerToggleId(this)

    const input: InputBooleanInput = {
      id: sceneToggleId,
      name: ALIAS_PREFIX + ':' + ' ' + this.id,
      icon: 'mdi:layers'
    }
    inputBooleans.push(input)

    const deactivateAutomationInput = {
      id: `automation_id ${this.id}`,
      name: 'name of automation'
    }

    const deactivateAutomation = new Automation(deactivateAutomationInput)
      .addTrigger({
        platform: "state",
        entity_id: sceneToggleId,
        to: "off"
      })
    
    console.log(this.layers)
    
    // this.layers.forEach((layer: Layer) => 
    //   layer.lights.forEach((light: Light) => {
    //     deactivateAutomation.addAction({
    //       service: 'script.myscript'
    //     })
    //   })
    // )

    automations.push(deactivateAutomation)

  }
}