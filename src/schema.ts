import { IVariable } from './Variable.ts'
import { StyleConf, StyleProps } from './Style.ts'
import { LayerConf } from './Layer.ts'
import { LightConf } from './Light.ts'


export interface Schema {
  lights: LightConf[]
  styles?: StyleConf
  layers: LayerConf
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
  layers: {
    primaryCircadian: {
      scene: 'circadian',
      style: "circadian-lighting"
    }
  },
  lights: [
    {
      entityId: 'light.living_room',
      layers: [
        {
          scene: "theater",
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