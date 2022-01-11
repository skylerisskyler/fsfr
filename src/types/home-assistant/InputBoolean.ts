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

// class InputBoolean implements InputBooleanProps {
//   id: string
//   name: string;
//   icon: string;
//   initial?: boolean;

//   constructor(props: InputBooleanInput) {
//     this.id = props.id,
//     this.name = props.name
//     this.icon = props.icon  
//   }


//   toConf() {
//     return 
//   }

// }


export const createInputBoolean = (props: InputBooleanInput): InputBooleanConf => {
  const id = props.id
  delete props.id

  return {
    [id]: props
  }
}