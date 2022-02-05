"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
exports.config = {
    variables: [
        {
            namespace: "circadian-bri",
            type: "brightness",
            unit: "percentage"
        }
    ],
    styles: {
        'circadian-lighting': {
            brightness: "$circadian-bri",
            temperature: {
                namespace: 'circadian-temp',
                type: 'temperature',
                unit: 'kelvin'
            }
        }
    },
    layers: [
        {
            id: "primaryCircadian",
            context: 'circadian',
            style: "circadian-lighting"
        }
    ],
    lights: [
        {
            id: 'light.living_room',
            layers: [
                {
                    context: "theater",
                    style: {
                        temperature: '2700k',
                        brightness: {
                            namespace: 'theater-bri',
                            type: 'brightness',
                            unit: 'percentage'
                        }
                    }
                },
                "primaryCircadian"
            ]
        }
    ],
};
