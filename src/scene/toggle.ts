import { InputBooleanProps } from "../types/home-assistant/InputBoolean"
import { Scene } from "./Scene"

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

export const createSceneToggles = (scenes: Scene[], inputBooleans) => {
  scenes.forEach((scene: Scene) => {
    inputBooleans.push(createSceneToggle(scene))
  })
}
