import { IVariable } from './Variable'
import { StyleConf, StyleProps } from './Style'
import { LayerConf } from './Layer'
import { LightConf } from './Light'


export interface Schema {
  lights: LightConf[]
  styles?: StyleConf
  layers?: LayerConf
  variables?: IVariable[]
}

export const config: Schema = {
  lights: [
    {
      entityId: 'light.living_room',
      layers: [
        {
          scene: "theater",
          style: {
            temperature: '2700k',
            brightness: '$theater-bri'
          }
        },
        "primaryCircadian"
      ]
    }
  ],
  styles: {
    'circadian-lighting': {
      brightness: "$circadian-bri",
      temperature: "$circadian-temp"
    }
  },
  layers: {
    primaryCircadian: {
      scene: 'circadian',
      style: "circadian-lighting"
    }
  },
  variables: [
    {
      namespace: "circadian-bri",
      type: "brightness",
      unit: "percentage"
    }
  ]
}