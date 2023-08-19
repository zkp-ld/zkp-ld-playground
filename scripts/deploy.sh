#!/bin/bash

set -e

git checkout gh-pages 

rm -rf v2/
mkdir -p v2
cp -r dist/* v2/

git add v2
git commit -m "Update v2"
git push origin gh-pages

git checkout v2
