"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Light = void 0;
const Layer_1 = require("./Layer");
class Light {
    id;
    layers;
    constructor(conf, variables, styles, contexts, layers) {
        const entityIdToId = (id) => id.replace('light.', '');
        if (Array.isArray(conf.id)) {
            if (conf.id.length > 1) {
                this.id = conf.id.map((id) => entityIdToId(id));
            }
            else {
                this.id = entityIdToId(conf.id[0]);
            }
        }
        else {
            this.id = entityIdToId(conf.id);
        }
        this.layers = [];
        conf.layers.forEach((layerConf) => {
            if (typeof layerConf === 'string') {
                const layer = layers.find((layer) => layerConf === layer.id);
                if (!layer) {
                    throw new Error('layer is not defined');
                }
                else {
                    this.layers.push(layer);
                }
            }
            else {
                const layer = new Layer_1.Layer(layerConf, variables, styles, contexts);
                layer.lights.push(this);
                this.layers.push(layer);
            }
        });
    }
    get entityId() {
        if (Array.isArray(this.id)) {
            return this.id.map((id) => 'light.' + id);
        }
        else {
            return 'light.' + this.id;
        }
    }
    get default() {
        return false;
    }
    getNextContext(currentContext) {
        const layerIdx = this.layers.findIndex(layer => currentContext.id === layer.context.id);
        return this.layers[layerIdx + 1].context;
    }
    get contexts() {
        return this.layers.map(layer => layer.context);
    }
}
exports.Light = Light;
