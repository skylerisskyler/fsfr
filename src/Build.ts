import { Layer } from "./Layer.ts";
import { Light } from "./Light.ts";
import { Scene } from "./scene/Scene.ts";
import { Style } from "./Style.ts";
import { Automation } from "./types/home-assistant/Automation.ts";
import { InputBooleanInput } from "./types/home-assistant/InputBoolean.ts";
import { InputNumberProps } from "./types/home-assistant/InputNumber.ts";
import { Script } from "./types/home-assistant/Script.ts";
import { createVariableInput, Variable } from "./Variable.ts";

import * as YAML from 'https://deno.land/std@0.82.0/encoding/yaml.ts';


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

  const sceneToggles: InputBooleanInput[] = scenes
    .map(scene => scene.createToggle())
  
  const sceneOffAutomations: Automation[] = scenes
    .map(scene => scene.createOffAutomation())

  console.log(sceneOffAutomations)
  // createSceneToggles(scenes, inputBooleans)
  // createSceneAutomations(scenes, automations)
  // createVariableInputs(variables, inputNumbers)

  // console.log(scenes)
  // console.log(Deno.inspect(automations))

  // const output = YAML.stringify({
  //   input_boolean: inputBooleans,
  //   script: scripts,
  //   automations
  // })
  // console.log(output)
  // // Deno.writeTextFile("../configuration.yaml", output);

}