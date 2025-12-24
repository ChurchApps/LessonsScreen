//import AsyncStorage from "@react-native-community/async-storage";
import React from "react"
import { Image, View } from "react-native"
import { CachedData, Styles, Utilities } from "../helpers";
import SoundPlayer from "react-native-sound-player";

type Props = { navigateTo(page: string): void; };

export const SplashScreen = (props: Props) => {
  const checkStorage = async () => {
    // Utilities.trackEvent("Splash Screen");
    CachedData.church = await CachedData.getAsyncStorage("church");
    CachedData.room = await CachedData.getAsyncStorage("room");
    CachedData.resolution = await CachedData.getAsyncStorage("resolution") || "720";

    // Check for plan pairing
    CachedData.planTypeId = await CachedData.getAsyncStorage("planTypeId");
    CachedData.pairedChurchId = await CachedData.getAsyncStorage("pairedChurchId");

    if (CachedData.planTypeId) {
      // Device is paired to a plan
      props.navigateTo("planDownload");
    } else if (CachedData.church && CachedData.room) {
      // Device is paired to a classroom
      props.navigateTo("download");
    } else {
      // Show pairing code screen (primary action)
      props.navigateTo("planPairing");
    }
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
