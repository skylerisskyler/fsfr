"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createScripts = void 0;
const ApplyContextScript_1 = require("./ApplyContextScript");
const ContextHandlerScripts_1 = require("./ContextHandlerScripts");
const InitializerScript_1 = require("./InitializerScript");
const ListenerScripts_1 = require("./ListenerScripts");
const Passthrough_1 = require("./Passthrough");
const VariableHandlerScripts_1 = require("./VariableHandlerScripts");
function createScripts(light) {
    const scripts = [];
    scripts.push((0, InitializerScript_1.createInitializerScript)(light));
    scripts.push(...(0, ApplyContextScript_1.applyContextToLightScripts)(light));
    //handlers
    scripts.push(...(0, ContextHandlerScripts_1.createSupHandlerScripts)(light));
    scripts.push(...(0, ContextHandlerScripts_1.createInfHandlerScripts)(light));
    //listeners
    scripts.push((0, ListenerScripts_1.createSuperiorContextOnListener)(light));
    scripts.push((0, ListenerScripts_1.createListenCurrContextOffScript)(light));
    scripts.push((0, ListenerScripts_1.createListenInfContextOffScript)(light));
    scripts.push((0, ListenerScripts_1.createListenInfContextOnScript)(light));
    scripts.push(...(0, VariableHandlerScripts_1.createVarAttachScripts)(light));
    scripts.push(...(0, VariableHandlerScripts_1.createVarDetachScripts)(light));
    scripts.push((0, Passthrough_1.createResetInfListenersScript)(light));
    return scripts;
}
exports.createScripts = createScripts;
