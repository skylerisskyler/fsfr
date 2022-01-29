# FSFR

## YAML Entities Configuration Example

### Expose Toggle

```yaml
input_boolean:
  fsfr_expose_<CONTEXT_ID>:
    name: "FSFR::<CONTEXT> status"
```

## Expose Activation

### Expose Activated Automation

```yaml
automation:
  - id: fsfr_expose_< _ID>_on
    alias: "FSFR::<CONTEXT_ID> Activated"
    trigger:
      - platform: state
        entity_id: input_boolean.fsfr_expose_<CONTEXT_ID>
        to: "on"
    action:
      - service: script.turn_on
        entity_id: script.fsfr_<expose>_group_activation
        data:
          variables:
            id_of_group: <ID_OF_GROUP>
            id_to_remove: <CONTEXT_ID>
    mode: single
```

## Expose Deactivation

### Expose Deactivated Automation

```yaml
automation:
  - id: fsfr_expose_<CONTEXT_ID>_off
    alias: "FSFR::<CONTEXT_ID> Deactivated"
    trigger:
      - platform: state
        entity_id: input_boolean.fsfr_expose_<CONTEXT_ID>
        to: "off"
    action:
      - service: script.turn_on
        entity_id: script.fsfr_<expose>_group_deactivation
        data:
          variables:
            var_name: <VAR_NAMESPACE>
            expose_id: <CONTEXT_ID>
      # - service: script.turn_on
      #   entity_id: script.check_current_expose
      #   data:
      #     variables:
      #       var_name: <VAR_NAMESPACE>
      #       expose_id: <CONTEXT_ID>
    mode: single
```

### Generic removal of entity from variable group

```yaml
script:
  fsfr_remove_group_from_variable:
    alias: FSFR:: <light> <expose> deactivation
  sequence:
    - service: group.set
      data:
        object_id: "{{'<VARIABLE_NAME>' + '_' + <CONTEXT_ID>}}"
        entities: []
  mode: parallel
```

### Util generic Add light to group in variable
```yaml
script:
  fsfr_util_add_light_to_variable:
  - service: group.set
    data:
      object_id: "{{ group_id }}"
      entities: "{{ state_attr("group_id", "entity_id") | list + [light_id] }}"
```
### Util generic Remove light to group in variable
```yaml
script:
  fsfr_util_add_light_to_variable:
  - service: group.set
    data:
      object_id: "{{<VARIABLE_NAME> + "_" + <CONTEXT_ID>}}"
      entities: "{{state_attr('group.test', 'entity_id')|reject("equalto", "script.two")| list}}"
```

### Segment of Light Check Flow
```yaml
script:
  fsfr_check<CONTEXT>_<LIGHT_ID>:
    sequence:
      - choose:
          - conditions:
              - condition: state
                entity_id: input_boolean.fsfr_<CONTEXT_ID>
                state: 'on'
            sequence:
              - service: input_select.select_option
                data:
                  option: <CONTEXT_ID>
                  entity_id: input_select.phosphor_expose_light_skyler_room
              - service: script.phosphor_set_expose_doorbell_light_skyler_room
        default:
          service: script.turn_on
          target:
            entity_id: script.<NEXT_CONTEXT_IN_LIGHT_SCRIPT>
```


### Context in light check flow
```yaml
alias: New Script
sequence:
  - choose:
      - conditions:
          - condition: state
            entity_id: input_boolean.context
            state: 'on'
          - condition: state
            entity_id: input_select.<light>
            state: <context_id>
        sequence:
          - service: script.turn_on
            target:
              entity_id: script.two
          - service: light.turn_on
            target:
              entity_id: light.living_room
            data:
              brightness_pct: 49
    default:
      - service: script.next_script_in_check
mode: single
```

<!-- - [ ] variable state change handlers
- [ ] some good way to handle style props from config to HA data format
- [ ] startup initialization automations
- [ ] utility scripts for adding and remove lights from variable groups
- [ ] remove individual light group when a new higher priority context becomes active -->

```yaml
script:
  alias: remove light from context group for variable
  sequence:
    - wait_for_trigger:
        - platform: state
          entity_id: input_boolean.context
          to: 'on'
    # remove light from context variable group
    - service: script.turn_on
      entity_id: script.fsfr_REMOVE LIGHT FROM VAR CONTEXT GROUP
      data:
        variables:
          group_id: group.<var><context>
          light_to_remove: <LIGHT_ID>
  - service: script.turn_off
    entity_id: script.context activation handler for light
  mode: single
```

#### substitute for config check flow 

activate light

```yaml
script:
  sequence:
    - wait_for_trigger:
      - platform: state
        entity_id: input_boolean.context
        to: 'on'
```

```javascript
if currently 'on'
wait 'on'
```

```yaml
script:
  fsfr_check<CONTEXT>_<LIGHT_ID>:
    sequence:
      - choose:
          - conditions:
              - condition: state
                entity_id: input_boolean.fsfr_<CONTEXT_ID>
                state: 'on'
            sequence:
              - service: script.turn_on
                data:
                  entity_id: script.wait_current_context_off
                  variables:
              - service: script.wait_this_context_off
                data:
              - condition: state
                entity_id: input_boolean.fsfr_<CONTEXT_ID>
                state: 'off'
                
              - service: script.wait_this_context_off
                data:
        default:
          service: script.turn_on
          target:
            entity_id: script.<NEXT_CONTEXT_IN_LIGHT_SCRIPT>
```
### Example nested choose for check flow
```yaml
alias: New Script
sequence:
  - choose:
      - conditions:
          - condition: state
            entity_id: input_boolean.context_one
            state: 'off'
        sequence:
          - service: script.turn_on
            target:
              entity_id: script.await_on
      - conditions:
          - condition: state
            entity_id: input_boolean.context_one
            state: 'on'
          sequence:
            # on this context off script

            # on current context off script // switch to this script
            - service: script.turn_on
              data:
                variables: 
                  current_context: "{{ current_context }}"
    default: []
mode: single
```