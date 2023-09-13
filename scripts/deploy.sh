#!/bin/bash

set -e

git checkout gh-pages 

rm -rf v1/
mkdir -p v1
cp -r dist/* v1/

git add v1
git commit -m "Update v1"
git push origin gh-pages

git checkout v1
