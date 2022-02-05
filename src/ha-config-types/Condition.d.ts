export interface ForDict {
  days?: number;
  hours?: number;
  minutes?: number;
  seconds?: number;
  milliseconds?: number;
}

interface BaseCondition {
  condition: string;
  alias?: string;
}

export interface TemplateCondition extends BaseCondition {
  condition: "template";
  value_template: string;
}

export interface StateCondition extends BaseCondition {
  condition: "state";
  entity_id: string;
  attribute?: string;
  state: string | number | string[];
  for?: string | number | ForDict;
}

export type Condition =
  | StateCondition
  | TemplateCondition
// | NumericStateCondition
// | SunCondition
// | ZoneCondition
// | TimeCondition
// | DeviceCondition
// | LogicalCondition
// | TriggerCondition;

