//import AsyncStorage from '@react-native-community/async-storage';
import React from 'react'
import { Image, View } from 'react-native'
import { CachedData, Styles, Utilities } from "../helpers";
import SoundPlayer from "react-native-sound-player";

type Props = { navigateTo(page: string): void; };

export const SplashScreen = (props: Props) => {
  const checkStorage = async () => {
    Utilities.trackEvent("Splash Screen");
    CachedData.church = await CachedData.getAsyncStorage("church");
    
    if (CachedData.church) props.navigateTo("selectRoom");
    else props.navigateTo("mode");
    
  }

  React.useEffect(() => { 
    SoundPlayer.playSoundFile('launch', 'mp3')
    setTimeout(() => {
      checkStorage();  
    }, 1800);
    
    
   }, [])

  return (


    <View style={Styles.splashMaincontainer}>
      <Image source={require('../images/logo.png')} style={Styles.splashImage} resizeMode="contain" />
    </View>

  )

}