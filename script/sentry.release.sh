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

echo Sentry Release $RELEASE_VERSION generated

# Create a release
sentry-cli releases new -p app $RELEASE_VERSION

# Associate commits with the release
sentry-cli releases set-commits --auto $RELEASE_VERSION
