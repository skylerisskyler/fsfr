import { Light } from "./Light"
import { Scene } from "./Scene"
import { Style, StyleProps } from "../Style"
import { Variable } from "./Variable"


export interface LayerConf {
  id?: string | null
  scene: string
  style: StyleProps | string
}

export interface LayerProps {
  scene: Scene | string
  style: StyleProps | string
}

export interface LayerFormat {
  [id: string]: LayerProps
}


export class Layer {
  id: string | null
  style: Style
  scene: Scene
  lights: Light[]

  constructor(
    conf: LayerConf,
    variables: Variable[],
    styles: Style[],
    scenes: Scene[]
  )
  {
    if(conf.id) {
      this.id = conf.id
    } else {
      this.id = null
    }

    this.lights = []

    //handle style
    if (typeof conf.style === 'string') {
      const style: Style | undefined = styles.find((style) => conf.style === style.id)
      if (!style) {
        throw new Error('Style is not defined')
      } else {
        this.style = style
      }
    } else {
      this.style = new Style(null, conf.style, variables)
    }

    //handle scene

    let scene = scenes.find((scene: Scene) => scene.id === conf.scene)
    if (!scene) {
      scene = new Scene({id: conf.scene})
    }
    this.scene = scene

    scene.addLayer(this)
    scenes.push(scene)
  }

  
}