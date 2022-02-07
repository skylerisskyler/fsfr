#!/usr/bin/env bashio

set e

CONFIG_PATH=/data/options.json

CONFIG=$(bashio::config 'src_dir')

bashio::log.info "${CONFIG}"


ts-node ./src/App.ts