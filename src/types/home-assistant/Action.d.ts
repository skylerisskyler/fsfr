import { Condition } from './Condition'


export interface ServiceAction {
  alias?: string;
  service?: string;
  service_template?: string;
  entity_id?: string;
  target?: HassServiceTarget;
  data?: Record<string, any>;
}

export declare type HassServiceTarget = {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
};


export type Action =
  | Condition
  | ServiceAction
// | EventAction
// | DeviceAction
// | DelayAction
// | SceneAction
// | WaitAction
// | WaitForTriggerAction
// | RepeatAction
// | ChooseAction
// | VariablesAction
// | UnknownAction;