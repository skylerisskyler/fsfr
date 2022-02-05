import { Light } from "./Light"
import { Context } from "./Context"
import { Style, StyleProps } from "./Style"
import { Variable } from "./Variable"


export interface LayerConf {
  id?: string | null
  context: string
  style: StyleProps | string
}

export interface LayerProps {
  context: Context | string
  style: StyleProps | string
}

export interface LayerFormat {
  [id: string]: LayerProps
}

export class Layer {
  id: string | null
  style: Style
  context: Context
  lights: Light[]

  constructor(
    conf: LayerConf,
    variables: Variable[],
    styles: Style[],
    contexts: Context[]
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

    //handle context

    let context: Context | undefined = contexts.find((context: Context) => context.id === conf.context)
    if (!context) {
      context = new Context(conf.context)
    }
    this.context = context

    context.addLayer(this)
    contexts.push(context)
  }

  
}