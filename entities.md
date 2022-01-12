# YAML Entities Configuration Example

### Expose Toggle

```yaml
input_boolean:
  fsfr_expose_<EXPOSE_ID>:
    name: "FSFR::<EXPOSE> status"
```
## Expose Activation

### Expose Activated Automation

```yaml
automation:
  - id: fsfr_expose_<EXPOSE_ID>_on
    alias: "FSFR::<EXPOSE_ID> Activated"
    trigger:
      - platform: state
        entity_id: input_boolean.fsfr_expose_<EXPOSE_ID>
        to: "on"
    action:
      - service: script.turn_on
        entity_id: script.fsfr_<expose>_group_activation
        data:
          variables:
            id_of_group: <ID_OF_GROUP>
            id_to_remove: <EXPOSE_ID>
    mode: single
```

## Expose Deactivation

### Expose Deactivated Automation

```yaml
automation:
  - id: fsfr_expose_<EXPOSE_ID>_off
    alias: "FSFR::<EXPOSE_ID> Deactivated"
    trigger:
      - platform: state
        entity_id: input_boolean.fsfr_expose_<EXPOSE_ID>
        to: "off"
    action:
      - service: script.turn_on
        entity_id: script.fsfr_<expose>_group_deactivation
        data:
          variables:
            var_name: <VAR_NAMESPACE>
            expose_id: <EXPOSE_ID>
      # - service: script.turn_on
      #   entity_id: script.check_current_expose
      #   data:
      #     variables:
      #       var_name: <VAR_NAMESPACE>
      #       expose_id: <EXPOSE_ID>
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
        object_id: "{{'<VARIABLE_NAME>' + '_' + <EXPOSE_ID>}}"
        entities: []
  mode: parallel
```

### Add light to group in variable
```yaml
script:
  fsfr_add_light_to_variable:
  - service: group.set
    data:
      object_id: "{{<VARIABLE_NAME> + "_" + <SCENE_ID>}}"
      entities: "{{ state_attr("group.<GROUP_ID>", "entity_id") | list + ["<LIGHT_ID>"] }}"
```

### Segment of Light Check Flow
```yaml
script:
  fsfr_check<EXPOSE>_<LIGHT_ID>:
    sequence:
      - choose:
          - conditions:
              - condition: state
                entity_id: input_boolean.fsfr_<EXPOSE_ID>
                state: 'on'
            sequence:
              - service: input_select.select_option
                data:
                  option: <EXPOSE_ID>
                  entity_id: input_select.phosphor_expose_light_skyler_room
              - service: script.phosphor_set_expose_doorbell_light_skyler_room
        default:
          service: script.turn_on
          target:
            entity_id: script.<NEXT_EXPOSE_IN_LIGHT_SCRIPT>
```

--------------
## Prospective

### Current Scene Check Script in array form
``` yaml
script:
  alias: check layers/exposes
  sequence:
    - repeat:
        count: '{{ exposes | count }}'
        sequence:
        - variables:
            person: '{{ exposes[repeat.index - 1] }}'
        - service: 
          #state check for the 
  mode: single
```
the benefit of this method is that you can avoid defining individual scripts for each check but on the other but there isn't a good way to define what variable the light should subscribe to.



### Variable groups
variable_group = [
  ... scene_group [
    ... light.entity_id
  ]
]