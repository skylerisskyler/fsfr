import { ALIAS_PREFIX, ID_PREFIX } from "./src/App"
import { Layer } from "./src/Layer"
import { Light } from "./src/Light"
import { Action } from "./src/types/home-assistant/Action"
import { createInputBoolean, InputBooleanConf } from "./src/types/home-assistant/InputBoolean"
import { InputNumberConf } from "./src/types/home-assistant/InputNumber"
import { Script } from "./src/types/home-assistant/Script"
import { Variable } from "./src/Variable"



const createBaseId = (): string => 'fsfr'

const createLayerToggleId = (layer: Layer): string => 
  `${createBaseId()}_layer_${layer.ref}_status` 
  
  const createLayerDeactivationScriptId = (layer: Layer): string =>
    `${createBaseId()}_layer_${layer.ref}_deactivated`

const createLayerToggle = (layer: Layer): InputBooleanConf => {
  const id: string = createLayerToggleId(layer)
  const name: string = ALIAS_PREFIX + ':' + ' ' + layer.ref
  const icon: string = 'mdi:layers'
  return createInputBoolean({id, name, icon})
}

const createLayerDeactivationScript = (layer: Layer) => {
    const deactivationScript = new Script({
      id: createLayerDeactivationScriptId(layer),
      alias: `${ALIAS_PREFIX} Layer ${layer.ref} deactivated`,
    })

    layer.lights.forEach((light: Light) => {
      const action: Action = {
        
      }
      deactivationScript.addSequence()
    })
  
}


// const createVariableInput = (variable: Variable): InputNumberConf => {
//   return {
    
//   }
// } 