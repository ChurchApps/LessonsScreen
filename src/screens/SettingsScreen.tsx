import React, { useEffect, useState } from "react"
import { Text, View, TouchableHighlight, BackHandler, Switch, Linking } from "react-native"
import { CachedData, Styles, Utilities } from "../helpers";
import { DimensionHelper } from "@churchapps/mobilehelper";
import { MenuHeader } from "../components";

type Props = { navigateTo(page: string, data?: any): void; };

export const SettingsScreen = (props: Props) => {

  let pkg = require('../../package.json');
  const appVersion = pkg.version;
  const [resolution, setResolution] = useState(CachedData.resolution);
  const toggleSwitch = () => {
    const val = (resolution === "720") ? "1080" : "720"
    setResolution(val);
    CachedData.resolution = resolution === "720" ? "1080" : "720";
    CachedData.setAsyncStorage("resolution", CachedData.resolution);
  }

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
      <View style={{ flex: 10, width: "100%", paddingLeft: "3%" }}>
        <View style={{ flexDirection: "row", marginTop: DimensionHelper.hp("2%") }}>
          <View style={{ flex: 25 }}>
            <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>App Version:</Text>
          </View>
          <View style={{ flex: 75 }}>
            <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>{appVersion}</Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: DimensionHelper.hp("2%") }}>
          <View style={{ flex: 25, paddingTop: "1%" }}>
            <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>Your Church:</Text>
          </View>
          <View style={{ flex: 75 }}>
            <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { props.navigateTo("selectChurch") }} hasTVPreferredFocus={true}>
              <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>{CachedData.church?.name || "None"}</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: DimensionHelper.hp("2%") }}>
          <View style={{ flex: 25, paddingTop: "1%" }}>
            <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }}>Higher Resolution:</Text>
          </View>
          <View style={{ flex: 75 }}>
            <Switch
              trackColor={{ false: '#767577', true: '#81b0ff' }}
              thumbColor={'#03a9f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={resolution === "1080"}
            />
          </View>
        </View>
        <View style={{ flexDirection: "row", marginTop: DimensionHelper.hp("2%") }}>
          <View style={{ flex: 50 }}>
          </View>
          <View style={{ flex: 50 }}>
            <Text style={{ ...Styles.smallerWhiteText, textAlign: "right", color: "#CCC", fontSize: DimensionHelper.wp("1.25%") }}>Higher resolutions take longer to download and are not necessary for most churches.  Only enable if video quality is not currently acceptable.</Text>
          </View>
        </View>
        <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => props.navigateTo("PrivacyPolicy")} hasTVPreferredFocus={true}>
          <Text style={{ ...Styles.smallWhiteText, textAlign: "left" }} >Privacy Policy</Text>
        </TouchableHighlight>
      </View>
    </View>
  )
}
