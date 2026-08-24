#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ANDROID_DIR="$ROOT_DIR/android"
GRADLEW="$ANDROID_DIR/gradlew"
OUTPUT_DIR="$ROOT_DIR/dist/android"
APK_NAME="spin-me-release.apk"

cd "$ROOT_DIR"

if [[ ! -x "$GRADLEW" ]]; then
  echo "Gradle wrapper not found at $GRADLEW"
  exit 1
fi

echo "Building Android release APK..."
cd "$ANDROID_DIR"
./gradlew assembleRelease --no-daemon

RELEASE_APK="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"

if [[ ! -f "$RELEASE_APK" ]]; then
  echo "Release APK was not created at:"
  echo "  $RELEASE_APK"
  exit 1
fi

mkdir -p "$OUTPUT_DIR"
cp "$RELEASE_APK" "$OUTPUT_DIR/$APK_NAME"

echo ""
echo "APK ready:"
echo "  $OUTPUT_DIR/$APK_NAME"
echo ""
echo "Install on a connected device:"
echo "  adb install -r \"$OUTPUT_DIR/$APK_NAME\""
