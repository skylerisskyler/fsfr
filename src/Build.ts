import { Layer } from "./Layer";
import { Light } from "./Light";
import { createSceneDeactivationAutomation } from "./scene/deactivation";
import { Scene } from "./scene/Scene";
import { createSceneToggles } from "./scene/toggle";
import { Style } from "./Style";
import { Automation } from "./types/home-assistant/Automation";
import { InputBooleanInput } from "./types/home-assistant/InputBoolean";
import { InputNumberProps } from "./types/home-assistant/InputNumber";
import { Script } from "./types/home-assistant/Script";
import { createVariableInput, Variable } from "./Variable";

const createSceneAutomations = (scenes: Scene[],automations: Automation[]) =>
  scenes.forEach(scene => 
    createSceneDeactivationAutomation(scene, automations)
  )

const createVariableInputs = (variables: Variable[], inputNumbers: InputNumberProps[]) =>
  variables.forEach(variable =>
    createVariableInput(variable, inputNumbers)
  )


const automations: Automation[] = []
const scripts: Script[] = []
const inputNumbers: InputNumberProps[] = []
const inputBooleans: InputBooleanInput[] = []

export function build(
    variables: Variable[],
    styles: Style[],
    scenes: Scene[],
    layers: Layer[],
    lights: Light[]
) 
{
  createSceneToggles(scenes, inputBooleans)
  createSceneAutomations(scenes, automations)
  console.log(variables)
  createVariableInputs(variables, inputNumbers)


  return {
    automations,
    inputBooleans,
    inputNumbers
  }
}