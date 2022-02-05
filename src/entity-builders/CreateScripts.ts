import { Light } from "../fsfr-types"
import { Script } from "../ha-config-types"
import { ScriptProps } from "../ha-config-types/Script"
import { applyContextToLightScripts } from "./ApplyContextScript"
import { createInfHandlerScripts, createSupHandlerScripts } from "./ContextHandlerScripts"
import { createInitializerScript } from "./InitializerScript"
import { createListenCurrContextOffScript, createListenInfContextOffScript, createListenInfContextOnScript, createSuperiorContextOnListener } from "./ListenerScripts"
import { createResetInfListenersScript } from "./Passthrough"

import { createVarAttachScripts, createVarDetachScripts } from "./VariableHandlerScripts"

export function createScripts(light: Light): ScriptProps[] {

  const scripts: ScriptProps[] = []
  
  scripts.push(createInitializerScript(light))

  scripts.push(...applyContextToLightScripts(light))

  //handlers
  scripts.push(...createSupHandlerScripts(light))
  scripts.push(...createInfHandlerScripts(light))

  //listeners
  scripts.push(createSuperiorContextOnListener(light))
  scripts.push(createListenCurrContextOffScript(light))
  scripts.push(createListenInfContextOffScript(light))
  scripts.push(createListenInfContextOnScript(light))

  scripts.push(...createVarAttachScripts(light))
  scripts.push(...createVarDetachScripts(light))

  scripts.push(createResetInfListenersScript(light))

  return scripts
}