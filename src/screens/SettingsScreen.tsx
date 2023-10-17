import React, { useEffect } from 'react'
import { Text, View, FlatList, TouchableHighlight, BackHandler } from 'react-native'
import { CachedData, Styles, Utilities } from "../helpers";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "../helpers/CustomReactNativeResponsiveScreen";
import { MenuHeader } from '../components';

type Props = { navigateTo(page: string, data?:any): void; };

export const SettingsScreen = (props: Props) => {
  
  var pkg = require('../../package.json');
  const appVersion = pkg.version;

  const handleBack = () => {
    props.navigateTo("splash");
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }
  
  const init = () => {
    Utilities.trackEvent("Mode Screen");
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return destroy;
  }

  useEffect(init, [])

  //return (<Text style={{ ...Styles.smallWhiteText, flex: 1, alignSelf: "center", textAlign: "right", paddingRight: 10 }}>This is a test of menu header text that just goes on and on. This is a test of menu header text that just goes on and on</Text>)
  return (
    <View style={Styles.menuScreen}>
      <MenuHeader headerText="Settings" />
      <View style={{flex:10, width:"100%", paddingLeft:"3%" }}>
        <View style={{flexDirection:"row", marginTop:hp("2%") }}>
          <View style={{flex:20}}>
            <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>App Version:</Text>  
          </View>
          <View style={{flex:80}}>
            <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>{appVersion}</Text>  
          </View>
        </View>
        <View style={{flexDirection:"row", marginTop:hp("2%") }}>
          <View style={{flex:20, paddingTop:"1%"}}>
            <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>Your Church:</Text>  
          </View>
          <View style={{flex:80}}>
            <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { props.navigateTo("selectChurch") }} hasTVPreferredFocus={true} >
              <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>{CachedData.church?.name || "None"}</Text>  
            </TouchableHighlight>
          </View>
        </View>
      </View>
      

    </View>
  )
}