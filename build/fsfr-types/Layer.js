"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layer = void 0;
const Context_1 = require("./Context");
const Style_1 = require("./Style");
class Layer {
    id;
    style;
    context;
    lights;
    constructor(conf, variables, styles, contexts) {
        if (conf.id) {
            this.id = conf.id;
        }
        else {
            this.id = null;
        }
        this.lights = [];
        //handle style
        if (typeof conf.style === 'string') {
            const style = styles.find((style) => conf.style === style.id);
            if (!style) {
                throw new Error('Style is not defined');
            }
            else {
                this.style = style;
            }
        }
        else {
            this.style = new Style_1.Style(null, conf.style, variables);
        }
        //handle context
        let context = contexts.find((context) => context.id === conf.context);
        if (!context) {
            context = new Context_1.Context(conf.context);
        }
        this.context = context;
        context.addLayer(this);
        contexts.push(context);
    }
}
exports.Layer = Layer;
