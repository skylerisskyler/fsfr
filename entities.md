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
      #   entity_id: script.check_current_scene
      #   data:
      #     variables:
      #       var_name: <VAR_NAMESPACE>
      #       expose_id: <EXPOSE_ID>
    mode: single
```

### Generic removal of entity from variable group

```yaml
script:
  fsfr_<VAR_NAME>_<EXPOSE_ID>_group_deactivation:
    alias: FSFR:: <light> <expose> deactivation
  sequence:
    - service: group.set
      data:
        object_id: "{{'<VAR_NAME>' + '_' + <EXPOSE_ID>}}"
        entities: []
  mode: parallel
```

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
the benefit of this method is that you can avoid defining individual scripts for each check but on the other 

```yaml
  - service: group.set
    data:
      object_id: <GROUP_ID>
      entities: "{{state_attr("group.<GROUP_ID>", "entity_id") | list + ["<LIGHT_ID>"]}}"
```
