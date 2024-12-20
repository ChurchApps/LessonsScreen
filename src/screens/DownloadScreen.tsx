import React, { useEffect } from "react"
import { View, Text, TouchableHighlight, ActivityIndicator, BackHandler, ImageBackground } from "react-native"
import { ApiHelper, ClassroomInterface, LessonPlaylistFileInterface, LessonPlaylistInterface } from "@churchapps/mobilehelper";
import { CachedData, Styles, Utilities } from "../helpers";
import { DimensionHelper } from "@churchapps/mobilehelper";
import LinearGradient from "react-native-linear-gradient";

type Props = { navigateTo(page: string): void; };

export const DownloadScreen = (props: Props) => {
  const [playlist, setPlaylist] = React.useState<LessonPlaylistInterface>(null);
  const [totalItems, setTotalItems] = React.useState(CachedData.totalCachableItems);
  const [cachedItems, setCachedItems] = React.useState(CachedData.cachedItems);
  const [ready, setReady] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState("");
  const [loadFailed, setLoadFailed] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [offlineCheck, setOfflineCheck] = React.useState(false);
  let refreshTimer: number = null;

  const updateCounts = (cached: number, total: number): void => {
    setCachedItems(cached);
    setTotalItems(total);
  }

  const getFiles = () => {
    const result: LessonPlaylistFileInterface[] = [];
    playlist?.messages?.forEach(m => {
      m.files?.forEach(f => { result.push(f) })
    });
    return result;
  }

  const handleStart = () => {
    Utilities.trackEvent("Start Lesson", { lesson: playlist?.lessonTitle });
    props.navigateTo("player");
  }

  const getVersion = () => {
    let pkg = require('../../package.json');
    return <Text style={{ ...Styles.smallWhiteText, textAlign:"left", fontSize: 12, paddingBottom: 15, color: "#999999", paddingTop: 15 }}>Version: {pkg.version}</Text>
  }


  const getContent = () => {
    if (!playlist) return <ActivityIndicator size="small" color="gray" animating={true} />
    else {
      if (ready && cachedItems === totalItems) {
        return (<>
          <Text style={Styles.H2}>{playlist.lessonName}:</Text>
          <Text style={Styles.H3}>{playlist.lessonTitle}</Text>
          <Text style={{...Styles.smallerWhiteText, color:"#CCCCCC" }}>{playlist.lessonDescription}</Text>
          <TouchableHighlight style={{ ...Styles.smallMenuClickable, backgroundColor: "#0086d1", width: DimensionHelper.wp("14%"), marginTop: DimensionHelper.hp("1%"), borderRadius:5 }} underlayColor={"#03a9f4"} onPress={() => { handleStart() }} hasTVPreferredFocus={true}>
            <Text style={{ ...Styles.smallWhiteText, width: "100%" }}>Start Lesson</Text>
          </TouchableHighlight>
          {getVersion()}
        </>);

      }
      else {
        return (
          <>
            <Text style={Styles.H2}>{playlist.lessonName}:</Text>
            <Text style={Styles.H3}>{playlist.lessonTitle}</Text>
            <Text style={{...Styles.smallerWhiteText, color:"#CCCCCC" }}>{playlist.lessonDescription}</Text>
            <TouchableHighlight style={{ ...Styles.smallMenuClickable, backgroundColor: "#999999", width: DimensionHelper.wp("28%"), marginTop: DimensionHelper.hp("1%"), borderRadius:5 }} underlayColor={"#999999"}>
              <Text style={{ ...Styles.smallWhiteText, width: "100%" }}>Downloading item {cachedItems} of {totalItems}</Text>
            </TouchableHighlight>
            {getVersion()}
          </>
        );
      }
    }
  }

  const loadData = () => {
    setLoading(true);
    CachedData.getAsyncStorage("playlist").then((cached: ClassroomInterface[]) => { if (cached?.length > 0) setPlaylist(playlist) });

    const date = new Date();
    let playlistUrl = "/classrooms/playlist/" + CachedData.room.id;
    playlistUrl += "?resolution=" + CachedData.resolution;
    playlistUrl += "?date=" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    //console.log("Playlist URL: " + playlistUrl);
    ApiHelper.get(playlistUrl, "LessonsApi").then(data => {
      if (!playlist || JSON.stringify(playlist) !== JSON.stringify(data)) {
        setPlaylist(data);
        CachedData.setAsyncStorage("playlist", playlist);
      }
    }).catch((ex) => {
      if (ex.toString().indexOf("Network request failed") > -1) props.navigateTo("offline");
      setLoadFailed(true);
    }).finally(() => {
      setLoading(false);
    });
  }

  const startDownload = () => {
    if (playlist?.messages?.length > 0) {
      const files = getFiles();
      CachedData.messageFiles = files;
      CachedData.setAsyncStorage("messageFiles", files);
      setReady(false);
      CachedData.prefetch(files, updateCounts).then(() => {
        setReady(true)
      });
    }
  }

  const destroy = () => {
    if (refreshTimer) window.clearInterval(refreshTimer);
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    Utilities.trackEvent("Download Screen");
    refreshTimer = window.setInterval(() => {
      setRefreshKey(new Date().getTime().toString());
    }, 60 * 60 * 1000);
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    setTimeout(() => { setOfflineCheck(true) }, 5000);
    return destroy;
  }

  const handleBack = () => {
    props.navigateTo("selectRoom");
  }

  useEffect(init, [])
  useEffect(loadData, [refreshKey])
  useEffect(startDownload, [playlist])
  useEffect(() => { if (offlineCheck && loading) props.navigateTo("offline"); }, [offlineCheck] )

  const background = {uri: playlist?.lessonImage || "about:blank"};

  if (loadFailed) {
    return (<View style={{...Styles.menuScreen, flex:1, width:DimensionHelper.wp("100%"), flexDirection:"column" }}>
      <Text style={{...Styles.bigWhiteText, flex:1, verticalAlign:"bottom"}}>The schedule could not be loaded.</Text>
      <Text style={{...Styles.whiteText, flex:1}}>Make sure a lesson is scheduled for this class.</Text>
    </View>);

  } else return (


    <View style={{...Styles.menuScreen, flex:1, flexDirection:"row" }}>
      <ImageBackground source={background} resizeMode="cover" style={{flex:1, width:"100%"}}>
        <LinearGradient colors={['rgba(0, 0, 0, 1)', 'rgba(0, 0, 0, 0)']} start={{x: 0, y: 1}} end={{x: 1, y: 0}} style={{flex:1}}>
          <View style={{flex:9, justifyContent:"flex-end", flexDirection:"column"}}>
            <View style={{justifyContent:"flex-start", flexDirection:"row", paddingLeft:DimensionHelper.wp("5%")}}>
              <View style={{maxWidth:"60%"}}>
                {getContent()}
              </View>
            </View>
          </View>

          <View style={{flex:1}}></View>
        </LinearGradient>
      </ImageBackground>

    </View>



  )

}
