//import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { Image, View, Text, FlatList, TouchableHighlight, ListRenderItem, ActivityIndicator, BackHandler } from 'react-native'
import { ApiHelper, CachedData, ClassroomInterface, Styles, Utilities } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { MenuHeader } from '../components';

type Props = { navigateTo(page: string): void; };

export const SelectRoomScreen = (props: Props) => {
  const [rooms, setRooms] = React.useState<ClassroomInterface[]>([]);
  const [loading, setLoading] = React.useState(false);

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
      <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { handleSelect(room) }} hasTVPreferredFocus={data.index === 0} >
        <Text style={Styles.whiteText}>{room.name}</Text>
      </TouchableHighlight>
    )
  }


  const getSearchResult = () => {
    if (rooms.length > 0) {
      return (<FlatList data={rooms} renderItem={renderItem} keyExtractor={(item) => item.id?.toString() || ""} style={{ width: wp("100%") }} hasTVPreferredFocus={true}  ></FlatList>)
    } else {
      if (loading) return <ActivityIndicator size='small' color='gray' animating={loading} />
      else return (<>
        <Text style={Styles.bigWhiteText}>No classrooms found</Text>
        <Text style={{ ...Styles.smallWhiteText, maxWidth: wp("50%") }}>Configure your classrooms at lessons.church.</Text>
      </>);
    }
  }

  const loadData = () => {
    CachedData.getAsyncStorage("rooms").then((cached: ClassroomInterface[]) => { if (cached?.length > 0) setRooms(cached) });
    setLoading(true);

    console.log("/classrooms/public/church/" + CachedData.church.id)
    ApiHelper.get("/classrooms/public/church/" + CachedData.church.id, "LessonsApi").then(data => {
      setRooms(data);
      CachedData.setAsyncStorage("rooms", rooms);
      setLoading(false);
    });
  }


  const handleBack = () => {
    props.navigateTo("selectChurch");
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    Utilities.trackEvent("Select Room Screen");
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    loadData();
    return destroy;
  }

  useEffect(init, [])

  return (
    <View style={Styles.menuScreen}>
      <MenuHeader headerText="Select a Classroom" />
      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getSearchResult()}
      </View>

    </View>
  )



}