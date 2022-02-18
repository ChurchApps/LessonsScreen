import React from 'react'
import { View } from 'react-native';
import { Styles } from '../helpers';
import { SplashScreen } from '../screens';


export const Navigator = () => {
  const [currentScreen, setCurrentScreen] = React.useState("splash");

  const handleNavigate = (page: string) => {
    console.log(page);
    setCurrentScreen(page);
  }

  let screen = <></>
  switch (currentScreen) {
    case "splash": screen = (<SplashScreen navigateTo={handleNavigate} />); break;
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