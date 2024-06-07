#!/bin/bash

set -e

if [ -z "$1" ]
then
    echo "Error: No version provided"
    exit 1
fi

semver_regex="^[0-9]+\.[0-9]+\.[0-9]+$"

if [[ ! $1 =~ $semver_regex ]]
then
    echo "Error: Version does not match the semver format (X.Y.Z)"
    exit 1
fi

git checkout gh-pages 

rm -rf assets
cp -r dist/* .
cp -r dist/ v$1/

git add .
git commit -m "Update to v$1"
git push origin gh-pages

git checkout main
