import { Light } from "./Light"
import { Scene } from "./Scene"
import { Style, StyleProps } from "./Style"
import { Variable } from "./Variable"


export interface LayerProps {
  scene: Scene | string
  style: StyleProps | string
}

export interface LayerConf {
  [id: string]: LayerProps
}



export class Layer {
  id: string | null
  style: Style
  scene: Scene
  lights: Light[]

  constructor(id: string | null, props: LayerProps, variables: Variable[], styles: Style[], scenes: Scene[]) {
    this.id = id

    //handle style
    if (typeof props.style === 'string') {
      const style: Style = styles.find((style) => props.style === style.id)
      if (!style) {
        throw new Error('Style is not defined')
      } else {
        this.style = style
      }
    } else {
      this.style = new Style(null, props.style, variables)
    }

    //handle scene

    let scene = scenes.find((scene: Scene) => scene.id === props.scene)
    if (!scene) {
      scene = new Scene(props.scene)
    }
    scene.addLayer(this)
    scenes.push(scene)
  }
}