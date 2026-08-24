#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
SOURCE="$ROOT/assets/branding/app-icon-source.png"
IOS_DIR="$ROOT/ios/SimpleSpinWheel/Images.xcassets/AppIcon.appiconset"
ANDROID_RES="$ROOT/android/app/src/main/res"
SPLASH_DIR="$ROOT/ios/SimpleSpinWheel/Images.xcassets/SplashLogo.imageset"

if [[ ! -f "$SOURCE" ]]; then
  echo "Missing source icon: $SOURCE"
  exit 1
fi

mkdir -p "$IOS_DIR" "$SPLASH_DIR" "$ANDROID_RES/drawable-nodpi"

resize() {
  sips -z "$2" "$2" "$SOURCE" --out "$1" >/dev/null
}

resize "$IOS_DIR/icon-20@2x.png" 40
resize "$IOS_DIR/icon-20@3x.png" 60
resize "$IOS_DIR/icon-29@2x.png" 58
resize "$IOS_DIR/icon-29@3x.png" 87
resize "$IOS_DIR/icon-40@2x.png" 80
resize "$IOS_DIR/icon-40@3x.png" 120
resize "$IOS_DIR/icon-60@2x.png" 120
resize "$IOS_DIR/icon-60@3x.png" 180
resize "$IOS_DIR/icon-1024.png" 1024

for spec in "mipmap-mdpi:48" "mipmap-hdpi:72" "mipmap-xhdpi:96" "mipmap-xxhdpi:144" "mipmap-xxxhdpi:192"; do
  folder=${spec%%:*}
  size=${spec##*:}
  resize "$ANDROID_RES/$folder/ic_launcher.png" "$size"
  resize "$ANDROID_RES/$folder/ic_launcher_round.png" "$size"
done

resize "$ANDROID_RES/drawable-nodpi/splash_logo.png" 512
resize "$SPLASH_DIR/splash-logo.png" 200
resize "$SPLASH_DIR/splash-logo@2x.png" 400
resize "$SPLASH_DIR/splash-logo@3x.png" 600

echo "App icons and splash assets generated from $SOURCE"
