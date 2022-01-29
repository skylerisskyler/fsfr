import { IVariable } from './fsfr-types/Variable'
import { StyleConf, StyleProps } from './Style'
import { LayerConf } from './fsfr-types/Layer'
import { LightConf } from './fsfr-types/Light'


export interface Schema {
  lights: LightConf[]
  styles?: StyleConf
  layers: LayerConf[]
  variables?: IVariable[]
}

export const config: Schema = {
  variables: [
    {
      namespace: "circadian-bri",
      type: "brightness",
      unit: "percentage"
    }
  ],
  styles: {
    'circadian-lighting': {
      brightness: "$circadian-bri",
      temperature: {
        namespace: 'circadian-temp',
        type: 'temperature',
        unit: 'kelvin'
      }
    }
  },
  layers: [
    {
      id: "primaryCircadian",
      context: 'circadian',
      style: "circadian-lighting"
    }
  ],
  lights: [
    {
      id: 'light.living_room',
      layers: [
        {
          context: "theater",
          style: {
            temperature: '2700k',
            brightness: {
              namespace: 'theater-bri',
              type: 'brightness',
              unit: 'percentage'
            }
          }
        },
        "primaryCircadian"
      ]
    }
  ],
}

