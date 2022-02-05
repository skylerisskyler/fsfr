"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Script = void 0;
class Script {
    id;
    alias;
    sequence;
    icon;
    mode;
    max;
    constructor(props) {
        this.id = props.id;
        this.alias = props.alias;
        this.icon = props.icon;
        this.mode = props.mode;
        this.max = props.max;
        this.sequence = [];
    }
    addAction(action) {
        this.sequence.push(action);
        return this;
    }
    compile() {
        const compilation = {};
        if (this.mode) {
            compilation.mode = this.mode;
        }
        compilation.alias = this.alias;
        compilation.id = this.id;
        compilation.sequence = this.sequence;
        return compilation;
    }
}
exports.Script = Script;
