#!/bin/bash

for edition in $(ls editions); do
    yarn tiddlywiki ./editions/$edition --verbose --build index
done