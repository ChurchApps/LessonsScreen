import React, { useEffect } from "react"
import { View, Text, TouchableHighlight, BackHandler, ImageBackground } from "react-native"
import { ApiHelper } from "../helpers/ApiHelper";
import { DimensionHelper } from "../helpers/DimensionHelper";
import { LessonInterface, LessonPlaylistFileInterface, LessonPlaylistInterface, ProgramInterface, StudyInterface, VenueInterface } from "../interfaces";
import { CachedData, Styles, Utilities } from "../helpers";
import LinearGradient from "react-native-linear-gradient";

type Props = { navigateTo(page: string, data?:any): void; program: ProgramInterface, study: StudyInterface, lesson:LessonInterface };

export const LessonDetailsScreen = (props: Props) => {
  const [venues, setVenues] = React.useState<VenueInterface[]>([]);

  const handleStart = (venueId:string) => {
    // Utilities.trackEvent("Stream Lesson", { lesson: props.lesson?.title });
    let url = "/venues/playlist/" + venueId;
    url += "?resolution=" + CachedData.resolution;
    ApiHelper.get(url, "LessonsApi").then(data => {
      CachedData.setAsyncStorage("playlist", data);
      CachedData.messageFiles = getFiles(data);
      CachedData.setAsyncStorage("messageFiles", CachedData.messageFiles);
      props.navigateTo("player", { program: props.program, study: props.study, lesson: props.lesson });
    });
  }

  const getFiles = (playlist:LessonPlaylistInterface) => {
    const result: LessonPlaylistFileInterface[] = [];
    playlist?.messages?.forEach(m => {
      m.files?.forEach(f => { result.push(f) })
    });
    return result;
  }

  const getVersion = () => {
    let pkg = require('../../package.json');
    return <Text style={{ ...Styles.smallWhiteText, textAlign:"left", fontSize: 12, paddingBottom: 15, color: "#999999", paddingTop: 15 }}>Version: {pkg.version}</Text>
  }


  const loadData = () => {
    ApiHelper.get("/venues/public/lesson/" + props.lesson.id, "LessonsApi").then(data => {
      setVenues(data);
    });
  }

  const getContent = () => {
    const buttons:JSX.Element[] = [];
    venues?.forEach((v, idx) => {
      buttons.push(<TouchableHighlight key={v.id} style={{ ...Styles.smallMenuClickable, backgroundColor: "#0086d1", width: DimensionHelper.wp("35%"), marginTop: DimensionHelper.hp("1%"), borderRadius:5 }} underlayColor={"#03a9f4"} onPress={() => { handleStart(v.id) }} hasTVPreferredFocus={idx===0}>
        <Text style={{ ...Styles.smallWhiteText, width: "100%" }}>{v.name}</Text>
      </TouchableHighlight>)

    });

    return (<>
      <Text style={Styles.H2}>{props.lesson?.name}:</Text>
      <Text style={Styles.H3}>{props.lesson?.title}</Text>
      <Text style={{...Styles.smallerWhiteText, color:"#CCCCCC" }}>{props.lesson?.description}</Text>
      {buttons}
      {getVersion()}
    </>);

  }

  const handleBack = () => {
    props.navigateTo("lessons", {program: props.program, study: props.study});
  }

  const init = () => {
    // Utilities.trackEvent("Lesson Details Screen");
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    loadData();
    return () => backHandler.remove();
  }

  useEffect(init, [])

  const background = {uri: props.lesson?.image};

  return (
    <View style={{...Styles.menuScreen, flex:1, flexDirection:"row" }}>
      <ImageBackground source={background} resizeMode="cover" style={{flex:1, width:"100%"}}>

        <LinearGradient colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']} start={{x: 0, y: 1}} end={{x: 0.8, y: 0.2}} style={{flex:1}}>


          <View style={{flex:9, justifyContent:"flex-end", flexDirection:"column"}}>
            <View style={{justifyContent:"flex-start", flexDirection:"row", paddingLeft:DimensionHelper.wp("5%")}}>
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
