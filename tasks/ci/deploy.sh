#!/usr/bin/env bash

set -euxo pipefail

yarn deploy --dry-run

if [ ${DEPLOY:-"false"} == "true" ]
then
    yarn deploy
fi