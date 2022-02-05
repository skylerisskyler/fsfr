"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Automation = void 0;
class Automation {
    id;
    alias;
    description;
    trigger;
    condition;
    action;
    mode;
    max;
    max_exceeded;
    variables;
    constructor(props) {
        this.id = props.id;
        this.alias = this.alias;
        this.description = this.description;
        this.trigger = [];
        this.condition = [];
        this.action = [];
    }
    addTrigger(trigger) {
        this.trigger.push(trigger);
        return this;
    }
    addAction(action) {
        this.action.push(action);
        return this;
    }
    addCondition(condition) {
        this.condition.push(condition);
        return this;
    }
    compile() {
        const compilation = {};
        compilation.id = this.id;
        compilation.trigger = this.trigger;
        compilation.action = this.action;
        if (this.condition.length) {
            compilation.condition = this.condition;
        }
        return compilation;
    }
}
exports.Automation = Automation;
