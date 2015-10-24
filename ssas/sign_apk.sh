#!/bin/sh

APK="platforms/android/build/outputs/apk/android-debug.apk"
APK_REL="android-release.apk"
echo $APK
KEY=ctfhoko-release.jks
ALIAS="ctfhoko-release"

# remove existing signerature
zip -d $APK META-INF/\*
# sign apk with KEY
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore $KEY $APK $ALIAS
# align apk
zipalign -v 4 $APK $APK_REL
