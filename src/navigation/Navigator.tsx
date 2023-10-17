import React, { useEffect } from 'react'
import { CachedData, Styles } from '../helpers';
import { DownloadScreen, SelectChurchScreen, SelectRoomScreen, SplashScreen, PlayerScreen } from '../screens';
import { ProgramsScreen } from '../screens/ProgramsScreen';
import { StudiesScreen } from '../screens/StudiesScreen';
import { LessonsScreen } from '../screens/LessonsScreen';
import { LessonDetailsScreen } from '../screens/LessonDetailsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { listenOrientationChange, removeOrientationListener, widthPercentageToDP as wp, heightPercentageToDP as hp } from '../helpers/CustomReactNativeResponsiveScreen';
import { View } from 'react-native';
import { NavWrapper } from './NavWrapper';

export const Navigator = () => {
  const [currentScreen, setCurrentScreen] = React.useState("splash");
  const [currentData, setCurrentData] = React.useState<any>(null);
  const [dimensions, setDimensions] = React.useState("1,1");

  const handleNavigate = (page: string, data?:any) => {
    if (data) setCurrentData(data); else setCurrentData(null);
    setCurrentScreen(page);
    CachedData.currentScreen = page;
  }

  let screen = <></>
  switch (currentScreen) {
    case "splash": screen = (<SplashScreen navigateTo={handleNavigate} />); break;
    case "settings": screen = (<SettingsScreen navigateTo={handleNavigate} />); break;
    case "selectChurch": screen = (<SelectChurchScreen navigateTo={handleNavigate} />); break;
    case "selectRoom": screen = (<SelectRoomScreen navigateTo={handleNavigate} />); break;
    case "download": screen = (<DownloadScreen navigateTo={handleNavigate} />); break;
    case "player": screen = (<PlayerScreen navigateTo={handleNavigate} program={currentData?.program} study={currentData?.study} lesson={currentData?.lesson} />); break;

    case "programs": screen = (<ProgramsScreen navigateTo={handleNavigate} />); break;
    case "studies": screen = (<StudiesScreen navigateTo={handleNavigate} program={currentData?.program} />); break;
    case "lessons": screen = (<LessonsScreen navigateTo={handleNavigate} program={currentData?.program} study={currentData?.study} />); break;
    case "lessonDetails": screen = (<LessonDetailsScreen navigateTo={handleNavigate} program={currentData?.program} study={currentData?.study} lesson={currentData?.lesson} />); break;
  }

  let viewStyle = {};

  const init = () => {
    listenOrientationChange(this, () => {
      setDimensions(wp("100%") + "," + hp("100%"))
    });

    return destroy;
  }

  const destroy = () => {
    removeOrientationListener();
    //Dimensions.removeEventListener('change', () => {});
  }

  useEffect(init, []);
  if (dimensions!=="1,1") console.log(dimensions);

  const fullScreenScreens = ["splash", "player", "download", "lessonDetails"];

  if (fullScreenScreens.indexOf(currentScreen)>-1) {
    return (<View style={Styles.splashMaincontainer}>
      <View style={[viewStyle]}>
        {screen}
      </View>
    </View>)
  } else {
    return (<View style={Styles.maincontainer}>
      <NavWrapper screen={screen} navigateTo={handleNavigate} />
    </View>);
  }

}
