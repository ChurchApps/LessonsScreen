//import AsyncStorage from '@react-native-community/async-storage';
import React from 'react'
import { Image, View } from 'react-native'
import { Styles } from "../helpers";

type Props = { navigateTo(page: string): void; };

export const SplashScreen = (props: Props) => {
  console.log("***SPLASH***")

  return (

    <View style={Styles.splashMaincontainer}>
      <Image source={require('../images/logo.png')} style={Styles.splashImage} resizeMode="contain" />
    </View>

  )

}