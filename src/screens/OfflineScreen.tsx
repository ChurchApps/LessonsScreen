//import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect } from "react"
import {  View, Text, TouchableHighlight,  BackHandler } from "react-native"
import {  DimensionHelper } from "@churchapps/mobilehelper";
import { CachedData, Styles } from "../helpers";
import LinearGradient from "react-native-linear-gradient";

type Props = { navigateTo(page: string): void; };

export const OfflineScreen = (props: Props) => {
  const [refreshKey, setRefreshKey] = React.useState(0);

  console.log(refreshKey)
  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    CachedData.getAsyncStorage("messageFiles").then((cached: any) => {
      CachedData.messageFiles = cached;
      setRefreshKey(refreshKey + 1);
      console.log("messagefiles", cached);
    });
    return destroy;
  }

  const handleBack = () => {
    props.navigateTo("selectRoom");
  }

  useEffect(init, [])

  const handleStart = () => {
    props.navigateTo("player");
  }

  const getContent = () => {
    if (CachedData.messageFiles?.length > 0) return (<>
      <Text style={{...Styles.smallerWhiteText, color:"#CCCCCC" }}>You can still play the lesson that was downloaded in advance.</Text>
      <TouchableHighlight style={{ ...Styles.smallMenuClickable, backgroundColor: "#0086d1", width: DimensionHelper.wp("14%"), marginTop: DimensionHelper.hp("1%"), borderRadius:5 }} underlayColor={"#03a9f4"} onPress={() => { handleStart() }} hasTVPreferredFocus={true}>
        <Text style={{ ...Styles.smallWhiteText, width: "100%" }}>Start Lesson</Text>
      </TouchableHighlight>
    </>);
    else return (<>
      <Text style={{...Styles.smallerWhiteText, color:"#CCCCCC" }}>Unfortunately the lesson hasn't been downloaded for offline play yet.  Please check your connection and try again.</Text>
    </>);
  }

  return (<LinearGradient colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']} start={{x: 0, y: 1}} end={{x: 1, y: 0}} style={{flex:1}}>
    <View style={{flex:9, justifyContent:"flex-end", flexDirection:"column"}}>
      <View style={{justifyContent:"flex-start", flexDirection:"row", paddingLeft:DimensionHelper.wp("5%")}}>
        <View style={{maxWidth:"60%"}}>
          <Text style={Styles.H2}>Offline:</Text>
          <Text style={Styles.H3}>Internet access is currently unavailable</Text>
          {getContent()}
        </View>
      </View>
    </View>

    <View style={{flex:1}}></View>
  </LinearGradient>)



}
