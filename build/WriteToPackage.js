"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.writeToPackage = void 0;
const yaml_1 = __importDefault(require("yaml"));
const fs_1 = __importDefault(require("fs"));
const toDict = (prevDict, curr) => {
    let dict = curr;
    const id = dict.id;
    delete dict.id;
    return { ...prevDict, [id]: dict };
};
function writeToPackage(configPackage) {
    const pkg = {
        automation: configPackage.automation,
        script: configPackage.script.reduce(toDict, {}),
        input_boolean: configPackage.input_boolean.reduce(toDict, {}),
        input_number: configPackage.input_number.reduce(toDict, {}),
        group: configPackage.group.reduce(toDict, {}),
    };
    const packageString = yaml_1.default.stringify(pkg)
        .replace(/[": on"]/g, ": 'on'")
        .replace(/[": off"]/g, ": 'off'")
    fs_1.default.writeFileSync('./configuration.yaml', packageString);
}
exports.writeToPackage = writeToPackage;
