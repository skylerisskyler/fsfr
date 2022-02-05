"use strict";
// export const getContextCheckScriptId = (light: Light, context: Context): string => 
// `fsfr_${light.id}_check_${context.id}`
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
// export const getLightContextSelectorId = (light: Light) =>
//   `fsfr_${light.id}_contexts`
class Context {
    id;
    layers;
    constructor(id) {
        this.id = id;
        this.layers = [];
    }
    addLayer(layer) {
        this.layers.push(layer);
    }
    get lights() {
        return this.layers.reduce((allLights, layer) => {
            return [...allLights, ...layer.lights];
        }, []);
    }
    get variables() {
        return this.layers.reduce((foundVariables, layer) => {
            layer.style.variables
                .forEach((variable) => {
                const existingVariable = foundVariables
                    .find((foundVariable) => foundVariable.namespace === variable.namespace);
                if (!existingVariable) {
                    foundVariables.push(variable);
                }
            });
            return foundVariables;
        }, []);
    }
}
exports.Context = Context;
