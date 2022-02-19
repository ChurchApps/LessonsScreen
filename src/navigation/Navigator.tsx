import React from 'react'
import { View } from 'react-native';
import { Styles } from '../helpers';
import { DownloadScreen, SelectChurchScreen, SelectRoomScreen, SplashScreen } from '../screens';


export const Navigator = () => {
  const [currentScreen, setCurrentScreen] = React.useState("splash");

  const handleNavigate = (page: string) => {
    console.log(page);
    setCurrentScreen(page);
  }

  let screen = <></>
  switch (currentScreen) {
    case "splash": screen = (<SplashScreen navigateTo={handleNavigate} />); break;
    case "selectChurch": screen = (<SelectChurchScreen navigateTo={handleNavigate} />); break;
    case "selectRoom": screen = (<SelectRoomScreen navigateTo={handleNavigate} />); break;
    case "download": screen = (<DownloadScreen navigateTo={handleNavigate} />); break;
  }

  let viewStyle = {};



  return (
    <View style={Styles.splashMaincontainer}>
      <View style={[viewStyle]}>
        {screen}
      </View>
    </View>
  )

}