import { Light } from '../fsfr-types/Light'
import { Context } from '../fsfr-types/Context'
import { Variable } from '../fsfr-types/Variable'


// Context handler ids
export const getInfContextHandlerScriptId = (light: Light, context: Context) => `handle_${light.id}_inf_${context.id}`
export const getSupContextHandlerScriptId = (light: Light, context: Context) => `handle_${light.id}_sup_${context.id}`

export const getInitializerScriptId = (light: Light) => `init_${light.id}`

// context listener ids
export const getSupContextOnListenerScript = (light: Light) => `listen_${light.id}_sup_context_on`
export const getInfContextOnListenerId = (light: Light) => `listen_${light.id}_inf_context_on`
export const getInfContextOffListenerId = (light: Light) => `listen_${light.id}_inf_context_off`
export const getInfCurrContextOffListenerId = (light: Light) => `listen_${light.id}_curr_context_off`


export const getApplyContextToLightScriptId = (context: Context, light: Light) => `apply_${context.id}_${light.id}`
export const getDefaultScriptId = (light: Light) => `apply_default_${light.id}`

export const getTurnOffInfListenersPassthroughId = (light: Light)  => `stop_inf_listen_passthrough_${light.id}`

export const getVariableInputId = (variable: Variable) => `var_${variable.namespace}_${variable.type}`

export const getContextToggleId = (context: Context) => `context_${context.id}`

export const addVariableToGroupId = `add_variable_to_group`
export const removeVariableFromGroupId = `remove_variable_from_group`

export const getVarAttachScriptId = (light: Light, context: Context) => `ATTACH LIGHT TO VARIABLES IN layer`
export const getVarDetachScriptId = (light: Light, context: Context) => `DETACH LIGHT FROM VARIABLES IN Layer`

export const getVariableGroupId = (variable: Variable) => `var_${variable.namespace}_group`


export const toInputNumberEntityId = (id: string) => `input_number.${id}`
export const toGroupEntityId = (id: string) => `group.${id}`
export const toScriptEntityId = (id: string) => `script.${id}`
export const toInputBooleanEntityId = (id: string) => `input_boolean.${id}`
