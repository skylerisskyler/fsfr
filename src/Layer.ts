import { Light } from "./Light"
import { Style, StyleProps } from "./Style"
import { Variable } from "./Variable"


export interface LayerProps {
  ref: string
  style: StyleProps | string
}

export interface LayerConf {
  [id: string]: LayerProps
}



export class Layer {
  id: string | null
  ref: string
  style: Style
  lights: Light[]

  constructor(id: string | null, layerProps: LayerProps, variables: Variable[], styles: Style[]) {
    this.id = id
    this.ref = layerProps.ref

    if (typeof layerProps.style === 'string') {
      const style: Style = styles.find((style) => layerProps.style === style.id)
      if (!style) {
        throw new Error('Style is not defined')
      } else {
        this.style = style
      }
    } else {
      this.style = new Style(null, layerProps.style, variables)
    }
  }
}