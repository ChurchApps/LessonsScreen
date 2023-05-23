import React from 'react'
import { View } from 'react-native';
import { Styles } from '../helpers';
import { DownloadScreen, SelectChurchScreen, SelectRoomScreen, SplashScreen, PlayerScreen } from '../screens';
import { ProgramsScreen } from '../screens/ProgramsScreen';
import { StudiesScreen } from '../screens/StudiesScreen';
import { LessonsScreen } from '../screens/LessonsScreen';
import { LessonDetailsScreen } from '../screens/LessonDetailsScreen';
import { ModeScreen } from '../screens/ModeScreen';


export const Navigator = () => {
  const [currentScreen, setCurrentScreen] = React.useState("splash");
  const [currentData, setCurrentData] = React.useState<any>(null);

  const handleNavigate = (page: string, data?:any) => {
    if (data) setCurrentData(data); else setCurrentData(null);
    setCurrentScreen(page);
  }

  let screen = <></>
  switch (currentScreen) {
    case "splash": screen = (<SplashScreen navigateTo={handleNavigate} />); break;
    case "mode": screen = (<ModeScreen navigateTo={handleNavigate} />); break;
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



  return (
    <View style={Styles.splashMaincontainer}>
      <View style={[viewStyle]}>
        {screen}
      </View>
    </View>
  )

}