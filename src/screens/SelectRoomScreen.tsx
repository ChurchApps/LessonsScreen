//import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect } from "react"
import {  View, Text, FlatList, TouchableHighlight, ListRenderItem, ActivityIndicator, BackHandler } from "react-native"
import { ApiHelper, ClassroomInterface, DimensionHelper } from "@churchapps/mobilehelper";
import { CachedData, Styles, Utilities } from "../helpers";
import { MenuHeader } from "../components";

type Props = { navigateTo(page: string): void; };

export const SelectRoomScreen = (props: Props) => {
  const [rooms, setRooms] = React.useState<ClassroomInterface[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [offlineCheck, setOfflineCheck] = React.useState(false);

  const handleSelect = (room: ClassroomInterface) => {
    CachedData.room = room;
    CachedData.setAsyncStorage("room", room).then(() => {
      props.navigateTo("download");
    })
  }

  const renderItem: ListRenderItem<ClassroomInterface> = (data) => {
    const room = data.item;
    data.index
    return (
      <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { handleSelect(room) }} hasTVPreferredFocus={data.index === 0}>
        <Text style={Styles.whiteText}>{room.name}</Text>
      </TouchableHighlight>
    )
  }

  const getSearchResult = () => {
    if (rooms.length > 0) {
      return (<FlatList data={rooms} renderItem={renderItem} keyExtractor={(item) => item.id?.toString() || ""} style={{ width: DimensionHelper.wp("100%") }} hasTVPreferredFocus={true}></FlatList>)
    } else {
      if (loading) return <ActivityIndicator size="small" color="gray" animating={loading} />
      else return (<>
        <Text style={Styles.bigWhiteText}>No classrooms found</Text>
        <Text style={{ ...Styles.smallWhiteText, maxWidth: DimensionHelper.wp("50%") }}>Configure your classrooms at lessons.church.</Text>
      </>);
    }
  }

  const loadData = async () => {
    CachedData.getAsyncStorage("rooms").then((cached: ClassroomInterface[]) => { if (cached?.length > 0) setRooms(cached) });
    setLoading(true);

    try {
      const data = await ApiHelper.get("/classrooms/public/church/" + CachedData.church.id, "LessonsApi")
      setRooms(data);
      CachedData.setAsyncStorage("rooms", rooms);
    } catch (ex) {
      if (ex.toString().indexOf("Network request failed") > -1) props.navigateTo("offline");
    }
    setLoading(false);
  }


  const handleBack = () => {
    //props.navigateTo("selectChurch");
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    // Utilities.trackEvent("Select Room Screen");
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    setTimeout(() => { setOfflineCheck(true) }, 5000);
    loadData();
    return destroy;
  }

  useEffect(init, [])
  useEffect(() => { if (offlineCheck && loading) props.navigateTo("offline"); }, [offlineCheck] )

  return (
    <View style={Styles.menuScreen}>
      <MenuHeader headerText="Select a Classroom" />
      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getSearchResult()}
      </View>

    </View>
  )



}
