import { Script } from "vm";
import { Layer } from "./Layer";
import { Automation } from "./types/home-assistant/Automation";
import { InputBooleanConf, InputBooleanInput } from "./types/home-assistant/InputBoolean";
import { InputNumberProps } from "./types/home-assistant/InputNumber";

export function build(variables, styles, layers, lights) {
  const automations: Automation[] = []
  const scripts: Script[] = []
  const inputNumbers: InputNumberProps[] = []
  const inputBooleans: InputBooleanInput[] = []
}