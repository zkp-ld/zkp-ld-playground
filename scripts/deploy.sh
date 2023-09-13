#!/bin/bash

set -e

git checkout gh-pages 

rm -rf asset
cp -r dist/* .

git add .
git commit -m "Update"
git push origin gh-pages

git checkout main
