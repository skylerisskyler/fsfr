#!/usr/bin/env bashio

set e

# CONFIG_PATH=/data/options.json
# CONFIG=$(bashio::config 'config')

# bashio::log.info "${CONFIG}"
cat /data/options.json

ts-node ./src/App.ts