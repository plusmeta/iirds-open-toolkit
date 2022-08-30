#!/bin/bash -eu

# Read arguments
REPO_BRANCH="$1"
REPO_URL="https://github.com/plusmeta/iirds-validation-tool.git" # TODO

# Remember the working directory
WORKING_DIR="$(pwd)"

# Check out the repository to a temporary directory
TEMP_FOLDER="$(mktemp -d)"
git clone "$REPO_URL" "$TEMP_FOLDER"

# Wind the repository back to the specified branch and commit
cd "$TEMP_FOLDER"
git checkout "$REPO_BRANCH"
git reset "$CODEBUILD_RESOLVED_SOURCE_VERSION"

# Confirm that the git checkout worked
if [ ! -d  .git ] ; then
  {
    echo "Error: .git directory missing. Git checkout probably failed"
  } >&2 
  exit 1
fi

mv .git "$WORKING_DIR"