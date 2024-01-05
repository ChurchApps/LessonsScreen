//import AsyncStorage from "@react-native-community/async-storage";
import React from "react"
import { Image, View, BackHandler, Alert, Platform } from "react-native"
import { CachedData, Styles, Utilities } from "../helpers";
import SoundPlayer from "react-native-sound-player";

type Props = { navigateTo(page: string): void; };

export const SplashScreen = (props: Props) => {
  const checkStorage = async () => {
    Utilities.trackEvent("Splash Screen");
    CachedData.church = await CachedData.getAsyncStorage("church");

    if (CachedData.church) props.navigateTo("selectRoom");
    else props.navigateTo("programs");

  }
  React.useEffect(() => {
    if (Platform.OS == "android") {
      BackHandler.addEventListener('hardwareBackPress', handleBackButton);
    }
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton)
    }
  },[])
  const handleBackButton = () => {
    Alert.alert(
      'Exit App',
      'Exiting the application?', [{
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel'
      }, {
        text: 'OK',
        onPress: () => BackHandler.exitApp()
      },], {
      cancelable: false
    }
    )
    return true;
  }

  React.useEffect(() => {
    SoundPlayer.playSoundFile('launch', 'mp3')
    setTimeout(() => {
      checkStorage();
    }, 1800);


  }, [])

   const logoImage = require('../images/logo.png'); //eslint-disable-line

  return (


    <View style={Styles.splashMaincontainer}>
      <Image source={logoImage} style={Styles.splashImage} resizeMode="contain" />
    </View>

  )

}
