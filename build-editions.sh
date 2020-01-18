#!/bin/bash

for edition in editions/*; do
    yarn tiddlywiki $edition --verbose --build index
done