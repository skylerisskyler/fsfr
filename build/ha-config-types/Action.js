"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChooseAction = exports.ChooseActionChoice = void 0;
// | EventAction
// | DeviceAction
// | DelayAction
// | ContextAction
// | RepeatAction
// | VariablesAction
// | UnknownAction;
class ChooseActionChoice {
    alias;
    conditions;
    sequence;
    constructor(alias) {
        this.alias = alias;
        this.conditions = [];
        this.sequence = [];
    }
    addCondition(condition) {
        this.conditions.push(condition);
        return this;
    }
    addAction(action) {
        this.sequence.push(action);
        return this;
    }
}
exports.ChooseActionChoice = ChooseActionChoice;
class ChooseAction {
    alias;
    choose;
    default;
    constructor(alias) {
        this.alias = alias;
        this.choose = [];
        this.default = [];
    }
    addChoice(choice) {
        this.choose.push(choice);
        return this;
    }
    addDefault(action) {
        this.default.push(action);
        return this;
    }
}
exports.ChooseAction = ChooseAction;
