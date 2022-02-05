"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createToggle = void 0;
const IdGenerators_1 = require("./IdGenerators");
function createToggle(context) {
    return {
        id: (0, IdGenerators_1.getContextToggleId)(context),
        icon: 'mdi: landscape',
        name: 'Toggle context: ' + context.id,
        initial: false
    };
}
exports.createToggle = createToggle;
