//import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { Image, View, Text, FlatList, TouchableHighlight, ListRenderItem, TextInput, Alert, ActivityIndicator } from 'react-native'
import { ApiHelper, CachedData, ChurchInterface, Styles } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

type Props = { navigateTo(page: string): void; };

export const SelectChurchScreen = (props: Props) => {
  console.log("***SELECT CHURCH***")
  const [churches, setChurches] = React.useState<ChurchInterface[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const searchApiCall = (text: String) => {
    if (text.length < 4) {
      setChurches([])

    } else {
      setLoading(true);
      ApiHelper.get("/churches/search/?name=" + text + "&app=Lessons&include=logoSquare", "AccessApi").then(data => {
        //console.log(data);
        setLoading(false);
        setChurches(data);
      })
    }
  }

  const handleSelect = (church: ChurchInterface) => {
    CachedData.church = church;
    CachedData.setAsyncStorage("church", church).then(() => {
      props.navigateTo("selectRoom");
    })
  }

  const renderItem: ListRenderItem<ChurchInterface> = (data) => {
    const church = data.item;
    return (
      <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { handleSelect(church) }}>
        <Text style={Styles.whiteText}>{church.name}</Text>
      </TouchableHighlight>
    )
  }

  const getNoResultsMessage = () => {
    if (searchText.length < 4) return "Enter at least four letters of your church name to start searching.";
    else return "No results found.  Search again or register your church at https://lessons.church/."
  }

  const getSearchResult = () => {
    if (loading) return <ActivityIndicator size='small' color='gray' animating={loading} />
    if (churches.length > 0) {
      return (<FlatList data={churches} renderItem={renderItem} keyExtractor={(item) => item.id?.toString() || ""} style={{ width: wp("100%") }}  ></FlatList>)
    } else return (<>
      <Text style={Styles.bigWhiteText}>Find Your Church</Text>
      <Text style={{ ...Styles.smallWhiteText, maxWidth: wp("50%") }}>{getNoResultsMessage()}</Text>
    </>);
  }


  useEffect(() => { searchApiCall(searchText) }, [searchText])

  return (
    <View style={Styles.menuScreen}>
      <View style={{ ...Styles.menuHeader, flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10 }}>
          <Image source={require('../images/logo.png')} style={Styles.menuHeaderImage} resizeMode="contain" />
        </View>
        <Text style={{ ...Styles.whiteText, flex: 1, alignSelf: "center", textAlign: "right", paddingRight: 10 }}>Find Your Church</Text>
      </View>

      <View style={{ ...Styles.menuWrapper, flex: 10 }}>
        <TextInput style={{ ...Styles.textInputStyle, width: wp("50%"), marginTop: hp("4%"), marginBottom: hp("4%") }} placeholder={'Church name'} autoCapitalize="none" autoCorrect={false} keyboardType='default' placeholderTextColor={'lightgray'} value={searchText} onChangeText={(text) => { setSearchText(text) }} />
      </View>

      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getSearchResult()}
      </View>

    </View>
  )



}