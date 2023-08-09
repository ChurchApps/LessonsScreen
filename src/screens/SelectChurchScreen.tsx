//import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { Image, View, Text, FlatList, TouchableHighlight, ListRenderItem, TextInput, ActivityIndicator, BackHandler } from 'react-native'
import { ApiHelper, CachedData, ChurchInterface, Styles, Utilities } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../helpers/CustomReactNativeResponsiveScreen";
import { MenuHeader } from '../components';

type Props = { navigateTo(page: string): void; };

export const SelectChurchScreen = (props: Props) => {

  const [churches, setChurches] = React.useState<ChurchInterface[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);
  let textRef: TextInput = null;

  const searchApiCall = (text: String) => {
    if (text.length < 4) {
      setChurches([])

    } else {
      setLoading(true);
      ApiHelper.getAnonymous("/churches/search/?name=" + text + "&app=Lessons&include=logoSquare", "MembershipApi").then(data => {
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
      <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { handleSelect(church) }} hasTVPreferredFocus={data.index === 0} >
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

  const handleBack = () => {
    CachedData.church = null;
    CachedData.setAsyncStorage("church", null).then(() => {
      props.navigateTo("splash");
    });
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    Utilities.trackEvent("Select Church Screen");
    if (textRef) setTimeout(() => {
      setAutoFocus(true);
    }, 1000); 
    
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return destroy;
  }

  useEffect(() => { searchApiCall(searchText) }, [searchText])
  useEffect(init, [])
  useEffect(() => { if (autoFocus) textRef.focus() }, [autoFocus]);

  return (
    <View style={Styles.menuScreen}>
      <MenuHeader headerText="Find Your Church" />

      <View style={{ ...Styles.menuWrapper, flex: 5 }}>
        <TextInput autoFocus={autoFocus} style={{ ...Styles.textInputStyle, width: wp("50%"), marginTop: hp("4%"), marginBottom: hp("4%") }} placeholder={'Church name'} autoCapitalize="none" autoCorrect={false} keyboardType='default' placeholderTextColor={'lightgray'} value={searchText} onChangeText={(text) => { setSearchText(text) }} ref={(r) => textRef = r}  returnKeyType="none" />
      </View>

      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getSearchResult()}
      </View>

    </View>
  )



}