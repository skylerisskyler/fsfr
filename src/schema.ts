import { IVariable } from './types/Variable'
import { StyleConf, StyleProps } from './types/Style'
import { LayerConf } from './types/Layer'
import { LightConf } from './Lights'

// interface StyleProps {
//   brightness?: string | number
//   color?: string
//   temperature?: string
// }




// interface Styles {
//   [styleProp: string]: StyleProps | string
// }



export interface Schema {
  lights: LightConf[]
  styles?: StyleConf
  layers?: LayerConf[]
  variables?: IVariable[]
}

export const config: Schema = {
  lights: [
    {
      entityId: 'light.living_room',
      layers: [
        {
          ref: "theater",
          style: {
            temperature: '2700k',
            brightness: '$theater-bri'
          }
        },
        {
          ref: "circadian",
          style: 'circadian-lighting'
        }
      ]
    },
    {
      entityId: 'light.dining_room',
      layers: ['circadian']
    }
  ],
  styles: {
    'circadian-lighting': {
      brightness: "$circadian-bri",
      temperature: "$circadian-temp"
    }
  },
  layers: [
    {
      ref: 'circadian',
      style: "circadian-lighting"
    }
  ],
  variables: [
    {
      namespace: "circadian-bri",
      type: "brightness",
      unit: "percentage"
    }
  ]
}