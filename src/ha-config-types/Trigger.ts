import { ForDict } from './Misc'


export interface BaseTrigger {
  platform: string;
  id?: string;
}

export interface StateTrigger extends BaseTrigger {
  platform: "state";
  entity_id: string;
  attribute?: string;
  from?: string | number;
  to?: string | string[] | number;
  for?: string | number | ForDict;
}

export interface HassTrigger extends BaseTrigger {
  platform: "homeassistant";
  event: "start" | "shutdown";
}



export type Trigger =
  | StateTrigger
  | HassTrigger
// | MqttTrigger
// | GeoLocationTrigger
// | NumericStateTrigger
// | SunTrigger
// | TimePatternTrigger
// | WebhookTrigger
// | ZoneTrigger
// | TagTrigger
// | TimeTrigger
// | TemplateTrigger
// | EventTrigger
// | DeviceTrigger;