//import AsyncStorage from '@react-native-community/async-storage';
import React from 'react'
import { Image, View } from 'react-native'
import { CachedData, Styles } from "../helpers";

type Props = { navigateTo(page: string): void; };

export const SplashScreen = (props: Props) => {
  const checkStorage = async () => {
    CachedData.church = await CachedData.getAsyncStorage("church");
    if (CachedData.church) props.navigateTo("selectRoom");
    else props.navigateTo("selectChurch");
  }

  React.useEffect(() => { checkStorage() }, [])

  return (


    <View style={Styles.splashMaincontainer}>
      <Image source={require('../images/logo.png')} style={Styles.splashImage} resizeMode="contain" />
    </View>

  )

}