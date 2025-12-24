import React, { useEffect } from "react"
import { CachedData, Styles } from "../helpers";
import { DownloadScreen, SelectChurchScreen, SelectRoomScreen, SplashScreen, PlayerScreen, SelectPairingModeScreen, PlanPairingScreen, PlanDownloadScreen } from "../screens";
import { ProgramsScreen } from "../screens/ProgramsScreen";
import { StudiesScreen } from "../screens/StudiesScreen";
import { LessonsScreen } from "../screens/LessonsScreen";
import { LessonDetailsScreen } from "../screens/LessonDetailsScreen";
import { SettingsScreen } from "../screens/SettingsScreen";
import { DimensionHelper } from "../helpers/DimensionHelper";
import { View } from "react-native";
import { NavWrapper } from "./NavWrapper";
import { OfflineScreen } from "../screens/OfflineScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";

export const Navigator = () => {
  const [currentScreen, setCurrentScreen] = React.useState("splash");
  const [currentData, setCurrentData] = React.useState<any>(null);
  const [dimensions, setDimensions] = React.useState("1,1");
  const [sidebarExpanded, setSidebarState] = React.useState(false);

  const handleNavigate = (page: string, data?:any) => {
    if (data) setCurrentData(data); else setCurrentData(null);
    setCurrentScreen(page);
    CachedData.currentScreen = page;
  }

  const sidebarState = (state: boolean = true) => {
    setSidebarState(state);
  }

  let screen = <></>
  switch (currentScreen) {
    case "splash": screen = (<SplashScreen navigateTo={handleNavigate} />); break;
    case "settings": screen = (<SettingsScreen navigateTo={handleNavigate} sidebarState={sidebarState} sidebarExpanded={sidebarExpanded} />); break;
    case "selectPairingMode": screen = (<SelectPairingModeScreen navigateTo={handleNavigate} sidebarState={sidebarState} sidebarExpanded={sidebarExpanded} />); break;
    case "selectChurch": screen = (<SelectChurchScreen navigateTo={handleNavigate} sidebarState={sidebarState} sidebarExpanded={sidebarExpanded} />); break;
    case "selectRoom": screen = (<SelectRoomScreen navigateTo={handleNavigate} sidebarState={sidebarState} sidebarExpanded={sidebarExpanded} />); break;
    case "planPairing": screen = (<PlanPairingScreen navigateTo={handleNavigate} sidebarState={sidebarState} sidebarExpanded={sidebarExpanded} />); break;
    case "planDownload": screen = (<PlanDownloadScreen navigateTo={handleNavigate} sidebarState={sidebarState} sidebarExpanded={sidebarExpanded} />); break;
    case "offline": screen = (<OfflineScreen navigateTo={handleNavigate} />); break;
    case "download": screen = (<DownloadScreen navigateTo={handleNavigate} />); break;
    case "player": screen = (<PlayerScreen navigateTo={handleNavigate} program={currentData?.program} study={currentData?.study} lesson={currentData?.lesson} />); break;

    case "programs": screen = (<ProgramsScreen navigateTo={handleNavigate} sidebarState={sidebarState} sidebarExpanded={sidebarExpanded} />); break;
    case "studies": screen = (<StudiesScreen navigateTo={handleNavigate} program={currentData?.program} />); break;
    case "lessons": screen = (<LessonsScreen navigateTo={handleNavigate} program={currentData?.program} study={currentData?.study} />); break;
    case "lessonDetails": screen = (<LessonDetailsScreen navigateTo={handleNavigate} program={currentData?.program} study={currentData?.study} lesson={currentData?.lesson} />); break;
    case "PrivacyPolicy": screen = (<PrivacyPolicyScreen navigateTo={handleNavigate} /> ); break;
  }

  let viewStyle = {};

  const init = () => {
    DimensionHelper.listenOrientationChange(this, () => {
      setDimensions(DimensionHelper.wp("100%") + "," + DimensionHelper.hp("100%"))
    });

    return destroy;
  }

  const destroy = () => {
    DimensionHelper.removeOrientationListener();
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
      <NavWrapper screen={screen} navigateTo={handleNavigate} sidebarState={sidebarState} sidebarExpanded={sidebarExpanded} />
    </View>);
  }

}
