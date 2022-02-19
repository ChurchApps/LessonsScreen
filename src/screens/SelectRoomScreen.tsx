//import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { Image, View, Text, FlatList, TouchableHighlight, ListRenderItem, ActivityIndicator } from 'react-native'
import { ApiHelper, CachedData, ClassroomInterface, Styles } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

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
    return (
      <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { handleSelect(room) }}>
        <Text style={Styles.whiteText}>{room.name}</Text>
      </TouchableHighlight>
    )
  }


  const getSearchResult = () => {
    if (rooms.length > 0) {
      return (<FlatList data={rooms} renderItem={renderItem} keyExtractor={(item) => item.id?.toString() || ""} style={{ width: wp("100%") }}  ></FlatList>)
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
    ApiHelper.get("/classrooms/public/church/" + CachedData.church.id, "LessonsApi").then(data => {
      setRooms(data);
      CachedData.setAsyncStorage("rooms", rooms);
      setLoading(false);
    });
  }

  useEffect(loadData, [])

  return (
    <View style={Styles.menuScreen}>
      <View style={{ ...Styles.menuHeader, flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10 }}>
          <Image source={require('../images/logo.png')} style={Styles.menuHeaderImage} resizeMode="contain" />
        </View>
        <Text style={{ ...Styles.whiteText, flex: 1, alignSelf: "center", textAlign: "right", paddingRight: 10 }}>Select a Classroom</Text>
      </View>
      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getSearchResult()}
      </View>

    </View>
  )



}