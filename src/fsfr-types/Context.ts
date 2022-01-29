import { ALIAS_PREFIX, ID_PREFIX } from "../App"
import { Layer } from "./Layer"
import { Light } from "./Light"
import { Automation } from "../ha-config-types/Automation"
import { InputBooleanInput, InputBooleanProps } from "../ha-config-types/InputBoolean"
import { Script } from "../ha-config-types/Script"
import { Variable } from "./Variable"
import { getContextToggleId, toInputBooleanEntityId } from "../script-builders/IdGenerators"

interface ContextConf {
  id: string
}


export const getContextOffAutomationId = (context: Context): string => 
`fsfr_${context.id}_off`

export const getContextOnAutomationId = (context: Context): string => 
`fsfr_${context.id}_on`

export const getContextCheckScriptId = (light: Light, context: Context): string => 
`fsfr_${light.id}_check_${context.id}`

export const getLightContextSelectorId = (light: Light) =>
  `fsfr_${light.id}_contexts`

export class Context {
  id: string
  layers: Layer[]

  constructor({id}: ContextConf) {
    this.id = id
    this.layers = []
  }

  addLayer(layer: Layer) {
    this.layers.push(layer)
  }

  createToggle(): InputBooleanInput {
    return {
      id: getContextToggleId(this),
      icon: 'mdi: landscape',
      name: 'Toggle context: ' + this.id,
      initial: false
    }
  }

  get lights() {
    return this.layers.reduce((allLights, layer) => {
      return [...allLights, ...layer.lights]
    }, [] as Light[])
  }

  createOnAutomation(): Automation {
    const automation: Automation = new Automation({
      id: getContextOnAutomationId(this)
    })

    automation.addTrigger({
      platform: 'state',
      entity_id: toInputBooleanEntityId(getContextToggleId(this)),
      to: 'on'
    })

    this.lights.forEach(light => {
      const firstContext = light.layers[0].context
      automation.addAction({
        service: `script.${getContextCheckScriptId(light, firstContext)}`
      })
    })

    return automation
  }

  createOffAutomation(): Automation {
    
    const automation: Automation = new Automation({
      id: getContextOffAutomationId(this)
    })

    automation.addTrigger({
      platform: 'state',
      entity_id: `input_boolean.${getContextToggleId(this)}`,
      to: 'off'
    })

    this.variables.forEach((variable) => {
      automation.addAction({
        service: 'script.turn_on',
        entity_id: `script.fsfr_variable_group_deactivation`,
        data: {
          variables: {
            var_namespace: variable.namespace,
            context_id: this.id
          }
        }
      })
    })

    this.lights.forEach(light => {
      const nextContext = light.getNextContext(this)
      if(nextContext) {
        automation.addAction({
          service: `script.check_next_${light.id}_${nextContext.id}`
        })
      } else {
        automation.addAction({
          service: 'light.turn_off',
          entity_id: light.entityId
        })
      }
    })

    return automation
  }

  get variables(): Variable[] {
    return this.layers.reduce((foundVariables: Variable[], layer: Layer) => {
      layer.style.variables
        .forEach((variable) => {
          const existingVariable = foundVariables
            .find((foundVariable) => foundVariable.namespace === variable.namespace)
          if(!existingVariable) {
            foundVariables.push(variable)
          }
        })
      return foundVariables
    }, [])
  }
}