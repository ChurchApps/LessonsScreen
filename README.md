# LessonsScreen
A TV app for presenting Lessons.church content.  Visit <a href="https://lessons.church/">Lessons.church</a> to learn more.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.
#### Join us on [Slack](https://join.slack.com/t/livechurchsolutions/shared_invite/zt-i88etpo5-ZZhYsQwQLVclW12DKtVflg).

## Running on Dev

1. **Update .env** - to point to production or your dev environment.
2. **Start React Native** - Run `npm start` to start the React Native server.
3. **Install Android App** - In Android Studio open the /android folder.  Either configure a new Android TV emulator or connect a AndroidTV device and click the run button to install the app.  
4. **Connect App to React Native** - Run `adb shell input keyevent 82` to open the developer menu. Go to settings, Debug server host and enter YourIP:8081.  Restart the app via Android Studio.

## Release build
1. Make sure the environment variables point to the production servers in EnvironmentHelper.ts
2. Increment the version number in android/app/build.gradle
3. Run 'cd android' followed by 'gradlew bundleRelease' to produce the release bundle.
4. Run 'cd..' followed by 'react-native run-android --variant=release' to generate an apk file.  You can close the node window when it completes.
5. The apk file is located at 'android/app/build/outputs/apk/release/app-release.apk'.  Publish it to the Amazon and Google Play stores.

## Codepush release
1. Update version number in package.json
2. Run 'appcenter codepush release-react -a Live-Church-Solutions/LessonsScreen -d Production'