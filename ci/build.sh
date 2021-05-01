#!/usr/bin/env bash

set -euxo pipefail

yarn install --silent
yarn typecheck
yarn lint
yarn build
