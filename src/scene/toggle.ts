import { InputBooleanProps } from "../types/home-assistant/InputBoolean.ts"
import { Scene } from "./Scene.ts"

export const getSceneToggleId = (scene: Scene) => {
  return `fsfr_scene_${scene.id}`
}

const createSceneToggle = (scene: Scene): InputBooleanProps => {
  return {
    id: getSceneToggleId(scene),
    icon: 'mdi:<some-icon>',
    name: 'some name'
  }
}

export const createSceneToggles = (scenes: Scene[], inputBooleans: InputBooleanProps[]) => {
  scenes.forEach((scene: Scene) => {
    inputBooleans.push(createSceneToggle(scene))
  })
}
