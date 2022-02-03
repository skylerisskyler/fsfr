import { Light } from '../fsfr-types/Light'
import { Context } from '../fsfr-types/Context'
import { Variable } from '../fsfr-types/Variable'


export const getInitializerScriptId = (light: Light) => `init_${light.id}`

// Context handler ids
export const getInfContextHandlerScriptId = (light: Light, context: Context) => `inf_handler_${light.id}_${context.id}`
export const getDefaultHandlerScriptId = (light: Light) => `inf_handler_${light.id}_default`
export const getSupContextHandlerScriptId = (light: Light, context: Context) => `sup_handler_${light.id}_${context.id}`


// sup context listener ids
export const getSupContextOnListenerScript = (light: Light) => `listen_${light.id}_sup_context_on`
// inf context listener ids
export const getInfContextOnListenerId = (light: Light) => `listen_${light.id}_inf_context_on`
export const getInfContextOffListenerId = (light: Light) => `listen_${light.id}_inf_context_off`
export const getInfCurrContextOffListenerId = (light: Light) => `listen_${light.id}_curr_context_off`

export const getInfListerEntityIds = (light: Light) => [
  toScriptEntityId(getInfContextOnListenerId(light)),
  toScriptEntityId(getInfContextOffListenerId(light)),
  toScriptEntityId(getInfCurrContextOffListenerId(light))
]



export const getTurnOffInfListenersPassthroughId = (light: Light)  => `stop_inf_listen_passthrough_${light.id}`

export const getApplyContextToLightScriptId = (context: Context, light: Light) => `apply_${context.id}_${light.id}`
export const getApplyDefaultToLightScriptId = (light: Light) =>
  `apply_default_${light.id}`

export const getVariableInputId = (variable: Variable) => `var_${variable.namespace}_${variable.type}`

export const getContextToggleId = (context: Context) => `context_${context.id}`

export const addVariableToGroupId = `add_variable_to_group`
export const removeVariableFromGroupId = `remove_variable_from_group`

export const getVarAttachScriptId = (light: Light, context: Context) =>   
  `attach_${light.id}_${context.id}`
export const getVarDetachScriptId = (light: Light, context: Context) =>
  `detach_${light.id}_${context.id}`

export const getVariableGroupId = (variable: Variable) =>
  `var_${variable.namespace}_group`



export const toInputNumberEntityId = (id: string) => `input_number.${id}`
export const toGroupEntityId = (id: string) => `group.${id}`
export const toScriptEntityId = (id: string) => `script.${id}`
export const toInputBooleanEntityId = (id: string) => `input_boolean.${id}`

export const ID_PREFIX = 'fsfr'
export const ALIAS_PREFIX = 'FSFR::'