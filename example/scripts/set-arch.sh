#!/bin/sh
set -eu
BASE_DIR="$(cd "$(dirname "$0")" && pwd)"
GRADLE_PROPERTIES="$BASE_DIR/../android/gradle.properties"
PODFILE="$BASE_DIR/../ios/Podfile"
ANDROID_DIR="$BASE_DIR/../android"
IOS_DIR="$BASE_DIR/../ios"
if [ "$#" -ne 1 ]; then
  echo "Usage: set-arch.sh <true|false>"
  exit 1
fi
VALUE="$1"
if [ "$VALUE" != "true" ] && [ "$VALUE" != "false" ]; then
  echo "Expected true or false"
  exit 1
fi
/usr/bin/sed -i '' "s/^newArchEnabled=.*/newArchEnabled=$VALUE/" "$GRADLE_PROPERTIES"
/usr/bin/sed -i '' "s/:new_arch_enabled => .*/:new_arch_enabled => $VALUE/" "$PODFILE"

echo "Running gradle clean..."
cd "$ANDROID_DIR" && ./gradlew clean

echo "Running pod install..."
cd "$IOS_DIR" && pod install

