import { Light } from "../fsfr-types"
import { Script } from "../ha-config-types"
import { ScriptProps } from "../ha-config-types/Script"
import { applyContextToLightScripts } from "./ApplyContextScript"
import { createInfHandlerScripts, createSupHandlerScripts } from "./ContextHandlerScripts"
import { createInitializerScript } from "./InitializerScript"
import { createListenCurrContextOffScript, createListenInfContextOffScript, createListenInfContextOnScript, createSuperiorContextOnListener } from "./ListenerScripts"
import { createPassthroughScript } from "./PassthroughScript"
import { createVarAttachScripts, createVarDetachScripts } from "./VariableHandlerScripts"

export function createScripts(light: Light): ScriptProps[] {

  const scripts: ScriptProps[] = []
  
  scripts.push(createInitializerScript(light))

  scripts.push(...applyContextToLightScripts(light))
  scripts.push(...createSupHandlerScripts(light))
  scripts.push(createSuperiorContextOnListener(light))
  scripts.push(...createInfHandlerScripts(light))

  scripts.push(createListenCurrContextOffScript(light))
  scripts.push(createListenInfContextOffScript(light))
  scripts.push(createListenInfContextOnScript(light))
  scripts.push(createPassthroughScript(light))

  scripts.push(createPassthroughScript(light))

  scripts.push(...createVarAttachScripts(light))
  scripts.push(...createVarDetachScripts(light))

  return scripts
}