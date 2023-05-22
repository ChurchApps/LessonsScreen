//import AsyncStorage from '@react-native-community/async-storage';
import { StyleSheet } from 'react-native'
import React, { useEffect } from 'react'
import { View, Text, TouchableHighlight, BackHandler, ImageBackground } from 'react-native'
import { LessonInterface, ProgramInterface, StudyInterface, Styles, Utilities } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import LinearGradient from 'react-native-linear-gradient';

type Props = { navigateTo(page: string, data?:any): void; program: ProgramInterface, study: StudyInterface, lesson:LessonInterface };

export const LessonDetailsScreen = (props: Props) => {
  const handleStart = () => {
    Utilities.trackEvent("Stream Lesson", { lesson: props.lesson?.title });
    props.navigateTo("player");
  }

  const getVersion = () => {
    var pkg = require('../../package.json');
    return <Text style={{ ...Styles.smallWhiteText, textAlign:"left", fontSize: 12, paddingBottom: 15, color: "#999999", paddingTop: 15 }}>Version: {pkg.version}</Text>
  }


  const getContent = () => {

      return (<>
          <Text style={Styles.H2}>{props.lesson?.name}:</Text>
          <Text style={Styles.H3}>{props.lesson?.title}</Text>
          <Text style={{...Styles.smallerWhiteText, color:"#CCCCCC" }}>{props.lesson?.description}</Text>
          <TouchableHighlight style={{ ...Styles.smallMenuClickable, backgroundColor: "#0086d1", width: wp("14%"), marginTop: hp("1%"), borderRadius:5 }} underlayColor={"#03a9f4"} onPress={() => { handleStart() }} hasTVPreferredFocus={true}>
            <Text style={{ ...Styles.smallWhiteText, width: "100%" }}>Stream Lesson</Text>
          </TouchableHighlight>
          {getVersion()}
        </>);

  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    Utilities.trackEvent("Lesson Details Screen");
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return destroy;
  }

  const handleBack = () => {
    props.navigateTo("lessons", {program: props.program, study: props.study});
  }

  useEffect(init, [])
  
  const background = {uri: props.lesson?.image};

  return (
    <View style={{...Styles.menuScreen, flex:1, flexDirection:"row" }}>
    <ImageBackground source={background} resizeMode="cover" style={{flex:1, width:"100%"}}>  

        <LinearGradient colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']} start={{x: 0, y: 1}} end={{x: 0.8, y: 0.2}} style={{flex:1}} >
          
      
        <View style={{flex:9, justifyContent:"flex-end", flexDirection:"column"}}>
          <View style={{justifyContent:"flex-start", flexDirection:"row", paddingLeft:wp("5%")}}>
            <View style={{maxWidth:"60%"}}>
                {getContent()}
            </View>
          </View>
        </View>

        </LinearGradient>
        
        

      </ImageBackground>

    </View>
  )

}