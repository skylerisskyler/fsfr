# FSFR

### Background
FSFR is a tool which aims to make writing complex lighting automations simpler with a more imperative approach.

FSFR is not an automation engine. It is configured using it's own paradigm of abstraction and transpiled to a Home Assistant Core native YAML package which leverages conventional entities (`automation`, `script`, `input_number`, `input_boolean`). The end result is that you will need to write less than 1/10 of the YAML.

With this you can control many lights in complex ways using `input_boolean` (context) and `input_number` (variable) to use across Home Assistant and alternative automation engines.

### Getting Started

#### Install

Copy this repository into the `/addon` directory of a Home Assistant instance.

[How to manually install Add-ons ](TD)

<!-- (WIP) Get FSFR on Addon Store -->

#### Addon Configuration
(WIP)

### Configuration Examples

#### Circadian Lighting

```yaml
lights:
  - id: light.<id> #light entity id
    - layers:
      - context: circadian
        style:
          temperature: $circadian-temp
          brightness: $circadian-bri
variables:
  - namespace: circadian-temp
    type: temperature
    unit: kelvin
  - namespace: circadian-bri
    type: brightness
    unit: percentage
```
