import { Light } from "../fsfr-types"
import { Script } from "../ha-config-types"
import { ScriptProps } from "../ha-config-types/Script"
import { applyContextToLightScripts } from "./ApplyContextScript"
import { createInfHandlerScripts, createSupHandlerScripts } from "./ContextHandlerScripts"
import { createInitializerScript } from "./InitializerScript"
import { createListenCurrContextOffScript, createListenInfContextOffScript, createListenInfContextOnScript, createSuperiorContextOnListener } from "./ListenerScripts"
import { createPassthroughScript } from "./PassthroughScript"

export function createScripts(light: Light): ScriptProps[] {

  const scripts: ScriptProps[] = []

  scripts.push(...applyContextToLightScripts(light))
  scripts.push(...createSupHandlerScripts(light))
  scripts.push(createSuperiorContextOnListener(light))
  scripts.push(...createInfHandlerScripts(light))

  scripts.push(createListenCurrContextOffScript(light))
  scripts.push(createListenInfContextOffScript(light))
  scripts.push(createListenInfContextOnScript(light))
  scripts.push(createPassthroughScript(light))

  scripts.push(createInitializerScript(light))

  return scripts
}