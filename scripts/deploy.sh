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

# Check if public/versions.json exists
if [ ! -f public/versions.json ]; then
    echo '[]' > public/versions.json
fi

# Check if the version already exists in public/versions.json
if [ -z "$(jq --arg version "$1" '.[] | select(. == $version)' public/versions.json)" ]; then
    # If the version does not exist, add it to the beginning of the array
    jq --arg version "$1" '[$version] + .' public/versions.json > tmp.json && mv tmp.json public/versions.json
fi

rm -rf assets
cp -r dist/* .
cp -r dist/ v$1/

git add .
git commit -m "Update to v$1"
git push origin gh-pages

git checkout main
