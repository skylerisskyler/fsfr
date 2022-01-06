import { Style, StyleProps } from "./Style"
import { Variable } from "./Variable"


export interface LayerConf {
  ref: string
  style: StyleProps | string
}


export class Layer {

  ref: string
  style: Style

  constructor(layerConfig: LayerConf, styles: Style[], variables: Variable[]) {
    this.ref = layerConfig.ref

    if (typeof layerConfig.style === 'string') {
      const style: Style = styles.find((style) => layerConfig.style === style.id)
      if (!style) {
        throw new Error('Style is not defined')
      } else {
        this.style = style
      }
    } else {
      this.style = new Style(null, layerConfig.style)
    }
  }
}