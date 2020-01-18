#!/bin/bash
# Builds all editions here locally. Not for use on CI
for edition in editions/*; do
    yarn tw $edition --verbose --build index
done