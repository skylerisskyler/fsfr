import { Layer } from "./Layer.ts";
import { Light } from "./Light.ts";
import { createSceneDeactivationAutomation } from "./scene/deactivation.ts";
import { Scene } from "./scene/Scene.ts";
import { createSceneToggles } from "./scene/toggle.ts";
import { Style } from "./Style.ts";
import { Automation } from "./types/home-assistant/Automation.ts";
import { InputBooleanInput } from "./types/home-assistant/InputBoolean.ts";
import { InputNumberProps } from "./types/home-assistant/InputNumber.ts";
import { Script } from "./types/home-assistant/Script.ts";
import { createVariableInput, Variable } from "./Variable.ts";

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
  createVariableInputs(variables, inputNumbers)


  return {
    automations,
    inputBooleans,
    inputNumbers
  }
}