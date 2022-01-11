
import { Layer } from "./Layer";
import { Light } from "./Light";
import { Scene } from "./Scene";
import { Style } from "./Style";
import { Automation } from "./types/home-assistant/Automation";
import { InputBooleanConf, InputBooleanInput } from "./types/home-assistant/InputBoolean";
import { InputNumberProps } from "./types/home-assistant/InputNumber";
import { Script } from "./types/home-assistant/Script";
import { Variable } from "./Variable";

export function build(variables: Variable[], styles: Style[], scenes: Scene[], layers: Layer[], lights: Light[]) {
  const automations: Automation[] = []
  const scripts: Script[] = []
  const inputNumbers: InputNumberProps[] = []
  const inputBooleans: InputBooleanInput[] = []

  // Scene toggle
  // Activation automation
  scenes.forEach((scene: Scene) => {
    scene.compile(inputBooleans, automations, scripts)
  })

  console.log(automations)
}