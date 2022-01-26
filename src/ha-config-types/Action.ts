import { Condition } from './Condition'
import { Trigger } from './Trigger'

export interface ServiceAction {
  alias?: string;
  service?: string;
  service_template?: string;
  entity_id?: string | string[];
  target?: HassServiceTarget;
  data?: Record<string, any>;
}

export declare type HassServiceTarget = {
  entity_id?: string | string[];
  device_id?: string | string[];
  area_id?: string | string[];
}

export interface IChooseActionChoice {
  alias?: string;
  conditions: string | Condition[];
  sequence: Action | Action[];
}

export interface IChooseAction {
  alias?: string;
  choose: ChooseActionChoice | ChooseActionChoice[] | null;
  default?: Action | Action[];
}

export interface WaitForTriggerAction {
  alias?: string;
  wait_for_trigger: Trigger | Trigger[];
  timeout?: number;
  continue_on_timeout?: boolean;
}

export interface WaitAction {
  alias?: string;
  wait_template: string;
  timeout?: number;
  continue_on_timeout?: boolean;
}

export type Action =
  | Condition
  | ServiceAction
  | IChooseAction
  | WaitAction
  | WaitForTriggerAction
// | EventAction
// | DeviceAction
// | DelayAction
// | SceneAction
// | RepeatAction
// | VariablesAction
// | UnknownAction;

export class ChooseActionChoice implements IChooseActionChoice {
  alias?: string;
  conditions: Condition[];
  sequence: Action[];

  constructor(alias: string) {
    this.alias = alias
    this.conditions = []
    this.sequence = []
  }

  addCondition(condition: Condition) {
    this.conditions.push(condition)
    return this
  }

  addAction(action: Action) {
    this.sequence.push(action)
    return this
  }
}

export class ChooseAction implements IChooseAction{

  alias?: string;
  choose: ChooseActionChoice[]
  default: Action[];
  
  constructor(alias: string) {
    this.alias = alias
    this.choose = []
    this.default = []
  }

  addChoice(choice: ChooseActionChoice) {
    this.choose.push(choice)
    return this
  }

  addDefault(action: Action) {
    this.default.push(action)
    return this
  }
}