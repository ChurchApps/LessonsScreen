//import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { Image, View, Text, TouchableHighlight, ActivityIndicator, BackHandler } from 'react-native'
import { ApiHelper, CachedData, ClassroomInterface, PlaylistFileInterface, PlaylistInterface, Styles } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

type Props = { navigateTo(page: string): void; };

export const DownloadScreen = (props: Props) => {
  const [playlist, setPlaylist] = React.useState<PlaylistInterface>(null);
  const [totalItems, setTotalItems] = React.useState(CachedData.totalCachableItems);
  const [cachedItems, setCachedItems] = React.useState(CachedData.cachedItems);
  const [ready, setReady] = React.useState(false);
  const [refreshKey, setRefreshKey] = React.useState("");
  let refreshTimer: number = null;

  const updateCounts = (cached: number, total: number): void => {
    setCachedItems(cached);
    setTotalItems(total);
  }

  const getFiles = () => {
    const result: PlaylistFileInterface[] = [];
    playlist?.messages?.forEach(m => {
      m.files?.forEach(f => { result.push(f) })
    });
    return result;
  }

  const handleStart = () => {
    props.navigateTo("player");
  }


  const getContent = () => {
    if (!playlist) return <ActivityIndicator size='small' color='gray' animating={true} />
    else {
      if (ready && cachedItems === totalItems) {
        return (<>
          <Text style={Styles.bigWhiteText}>Lesson Ready</Text>
          <Text style={{ ...Styles.smallWhiteText }}>{playlist.lessonTitle}: {playlist.venueName}</Text>
          <TouchableHighlight style={{ ...Styles.menuClickable, backgroundColor: "#0086d1", width: wp("30%"), marginTop: hp("5%") }} underlayColor={"#03a9f4"} onPress={() => { handleStart() }} hasTVPreferredFocus={true}>
            <Text style={{ ...Styles.whiteText, width: "100%" }}>Start Lesson</Text>
          </TouchableHighlight>
        </>);

      }
      else {
        return (<>
          <Text style={Styles.bigWhiteText}>Downloading...</Text>
          <Text style={{ ...Styles.smallWhiteText }}>{playlist.lessonName}: {playlist.venueName}</Text>
          <Text style={{ ...Styles.smallWhiteText, maxWidth: wp("50%") }}>Item {cachedItems} of {totalItems}.</Text>

          <ActivityIndicator size='small' color='gray' animating={true} />
        </>);
      }
    }
  }


  const loadData = () => {
    CachedData.getAsyncStorage("playlist").then((cached: ClassroomInterface[]) => { if (cached?.length > 0) setPlaylist(playlist) });
    ApiHelper.get("/classrooms/playlist/" + CachedData.room.id, "LessonsApi").then(data => {
      if (!playlist || JSON.stringify(playlist) !== JSON.stringify(data)) {
        setPlaylist(data);
        CachedData.setAsyncStorage("playlist", playlist);
      }
    });
  }

  const startDownload = () => {
    const files = getFiles();
    CachedData.messageFiles = files;
    setReady(false);
    CachedData.prefetch(files, updateCounts).then(() => { setReady(true) });
  }

  const destroy = () => {
    if (refreshTimer) window.clearInterval(refreshTimer);
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    refreshTimer = window.setInterval(() => {
      setRefreshKey(new Date().getTime().toString());
    }, 60 * 60 * 1000);
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return destroy;
  }

  const handleBack = () => {
    props.navigateTo("selectRoom");
  }

  useEffect(init, [])
  useEffect(loadData, [refreshKey])
  useEffect(startDownload, [playlist])

  return (
    <View style={Styles.menuScreen}>
      <View style={{ ...Styles.menuHeader, flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10 }}>
          <Image source={require('../images/logo.png')} style={Styles.menuHeaderImage} resizeMode="contain" />
        </View>
      </View>
      <View style={{ ...Styles.menuWrapper, flex: 20, alignContent: "center", justifyContent: "center" }}>
        {getContent()}
      </View>

    </View>
  )



}