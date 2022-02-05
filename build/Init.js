"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = void 0;
const fsfr_types_1 = require("./fsfr-types");
function init(config) {
    let variables = [];
    if (config.variables) {
        variables = variables.concat(config.variables.map((variableConf) => new fsfr_types_1.Variable(variableConf)));
    }
    let styles = [];
    if (config.styles) {
        styles = styles.concat(Object.entries(config.styles)
            .map(([id, styleProps]) => new fsfr_types_1.Style(id, styleProps, variables)));
    }
    const contexts = [];
    let layers = [];
    if (config.layers) {
        layers = config.layers
            .map(layerConf => new fsfr_types_1.Layer(layerConf, variables, styles, contexts));
    }
    const lights = config.lights
        .map((lightConf) => new fsfr_types_1.Light(lightConf, variables, styles, contexts, layers));
    return {
        styles,
        contexts,
        layers,
        lights,
        variables,
    };
}
exports.init = init;
