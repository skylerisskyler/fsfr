interface InputBooleanProps {
  id?: string
  name: string;
  icon: string;
  initial?: boolean;
}

export interface InputBooleanInput extends InputBooleanProps {
  id: string
  name: string;
  icon: string;
  initial?: boolean;
}

export interface InputBooleanConf {
  [id: string]: InputBooleanProps
}



export const createInputBoolean = (props: InputBooleanInput): InputBooleanConf => {
  const id = props.id
  delete props.id

  return {
    [id]: props
  }
}