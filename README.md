# FSFR


## YAML Entities Configuration Example

### Expose Toggle

```yaml
input_boolean:
  fsfr_expose_<SCENE_ID>:
    name: "FSFR::<SCENE> status"
```
## Expose Activation

### Expose Activated Automation

```yaml
automation:
  - id: fsfr_expose_< _ID>_on
    alias: "FSFR::<SCENE_ID> Activated"
    trigger:
      - platform: state
        entity_id: input_boolean.fsfr_expose_<SCENE_ID>
        to: "on"
    action:
      - service: script.turn_on
        entity_id: script.fsfr_<expose>_group_activation
        data:
          variables:
            id_of_group: <ID_OF_GROUP>
            id_to_remove: <SCENE_ID>
    mode: single
```

## Expose Deactivation

### Expose Deactivated Automation

```yaml
automation:
  - id: fsfr_expose_<SCENE_ID>_off
    alias: "FSFR::<SCENE_ID> Deactivated"
    trigger:
      - platform: state
        entity_id: input_boolean.fsfr_expose_<SCENE_ID>
        to: "off"
    action:
      - service: script.turn_on
        entity_id: script.fsfr_<expose>_group_deactivation
        data:
          variables:
            var_name: <VAR_NAMESPACE>
            expose_id: <SCENE_ID>
      # - service: script.turn_on
      #   entity_id: script.check_current_expose
      #   data:
      #     variables:
      #       var_name: <VAR_NAMESPACE>
      #       expose_id: <SCENE_ID>
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
        object_id: "{{'<VARIABLE_NAME>' + '_' + <SCENE_ID>}}"
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
      object_id: "{{<VARIABLE_NAME> + "_" + <SCENE_ID>}}"
      entities: "{{state_attr('group.test', 'entity_id')|reject("equalto", "script.two")| list}}"
```

### Segment of Light Check Flow
```yaml
script:
  fsfr_check<SCENE>_<LIGHT_ID>:
    sequence:
      - choose:
          - conditions:
              - condition: state
                entity_id: input_boolean.fsfr_<SCENE_ID>
                state: 'on'
            sequence:
              - service: input_select.select_option
                data:
                  option: <SCENE_ID>
                  entity_id: input_select.phosphor_expose_light_skyler_room
              - service: script.phosphor_set_expose_doorbell_light_skyler_room
        default:
          service: script.turn_on
          target:
            entity_id: script.<NEXT_SCENE_IN_LIGHT_SCRIPT>
```


### Scene in light check flow
```yaml
alias: New Script
sequence:
  - choose:
      - conditions:
          - condition: state
            entity_id: input_boolean.scene
            state: 'on'
          - condition: state
            entity_id: input_select.<light>
            state: <scene_id>
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

### WIP
- [ ] variable state change handlers
- [ ] some good way to handle style props from config to HA data format
- [ ] startup initialization automations
- [ ] utility scripts for adding and remove lights from variable groups
- [ ] remove individual light group when a new higher priority scene becomes active

```yaml
script:
  alias: remove light from scene group for variable
  sequence:
    - wait_for_trigger:
        - platform: state
          entity_id: input_boolean.scene
          to: 'on'
    # remove light from scene variable group
    - service: script.turn_on
      entity_id: script.fsfr_REMOVE LIGHT FROM VAR SCENE GROUP
      data:
        variables:
          group_id: group.<var><scene><>
          light_to_remove: <LIGHT_ID>
  - service: script.turn_off
    entity_id: script.scene activation handler for light
  mode: single
```