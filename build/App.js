"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Build_1 = require("./Build");
const Init_1 = require("./Init");
const WriteToPackage_1 = require("./WriteToPackage");
const fs_1 = __importDefault(require("fs"));
const yaml_1 = __importDefault(require("yaml"));
function getConfig() {
    const config = fs_1.default.readFileSync('./simple.yaml', 'utf8');
    return yaml_1.default.parse(config);
}
async function main() {
    const config = getConfig();
    const abstractions = (0, Init_1.init)(config);
    const configuration = (0, Build_1.build)(abstractions);
    (0, WriteToPackage_1.writeToPackage)(configuration);
}
main();
