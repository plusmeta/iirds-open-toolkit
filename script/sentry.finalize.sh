# Get version from package.json
#!/bin/bash -eu

# Get semver version from package.json
PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Get app name from package.json
PACKAGE_NAME=$(cat package.json \
  | grep name \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')

# Build Sentry Release ID
RELEASE_VERSION=${PACKAGE_NAME}@${PACKAGE_VERSION}

echo Release $RELEASE_VERSION will be finalized:

# Create release
sentry-cli releases finalize $RELEASE_VERSION
