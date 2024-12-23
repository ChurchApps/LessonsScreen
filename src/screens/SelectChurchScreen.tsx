//import AsyncStorage from "@react-native-community/async-storage";
import React, { useEffect } from "react"
import { View, Text, FlatList, TouchableHighlight, ListRenderItem, TextInput, ActivityIndicator, BackHandler, useTVEventHandler } from "react-native"
import { ApiHelper, ChurchInterface, DimensionHelper } from "@churchapps/mobilehelper";
import { CachedData, Styles, Utilities } from "../helpers";
import { MenuHeader } from "../components";
import GestureRecognizer from "react-native-swipe-gestures";

type Props = { navigateTo(page: string): void; };

export const SelectChurchScreen = (props: Props) => {

  const [churches, setChurches] = React.useState<ChurchInterface[]>([]);
  const [searchText, setSearchText] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [autoFocus, setAutoFocus] = React.useState(false);

  const [isInputFocus, setIsInputFocus] = React.useState(true);

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
      <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { handleSelect(church) }} hasTVPreferredFocus={!isInputFocus}>
        <Text style={Styles.whiteText}>{church.name}</Text>
      </TouchableHighlight>
    )
  }

  const getNoResultsMessage = () => {
    if (searchText.length < 4) return "Enter at least four letters of your church name to start searching.";
    else return "No results found.  Search again or register your church at https://lessons.church/."
  }

  const getSearchResult = () => {
    if (loading) return <ActivityIndicator size="small" color="gray" animating={loading} />
    if (churches.length > 0) {
      return (<FlatList data={churches} renderItem={renderItem} keyExtractor={(item) => item.id?.toString() || ""} style={{ width: DimensionHelper.wp("100%") }}></FlatList>)
    } else return (<>
      <Text style={{ ...Styles.smallWhiteText, width: "100%" }}>{getNoResultsMessage()}</Text>
    </>);
  }

  const handleBack = () => {
    CachedData.church = null;
    props.navigateTo("splash");
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

  const handleTVKeyPress = (evt: any) => {
    if (evt.eventType === 'select' && !isInputFocus) {
      textRef.focus();
    }
  };

  useTVEventHandler(handleTVKeyPress);

  return (
    <View style={Styles.menuScreen}>
      <MenuHeader headerText="Find Your Church" />
      <View style={{ ...Styles.menuWrapper, flex: 5 }} hasTVPreferredFocus={true}>
        <TextInput autoFocus={autoFocus}
          hasTVPreferredFocus={true}
          onFocus={() => { setIsInputFocus(true) }}
          onBlur={() => { setIsInputFocus(false) }}
          style={{
            ...Styles.textInputStyle,
            width: "100%", marginTop: DimensionHelper.hp("4%"),
            marginBottom: DimensionHelper.hp("4%")
          }}
          placeholder={'Church name'}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="default"
          placeholderTextColor={'lightgray'}
          value={searchText}
          onChangeText={(text) => { setSearchText(text) }}
          ref={(r) => textRef = r}
          returnKeyType="done"
        />
      </View>
      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getSearchResult()}
      </View>
    </View>
  )



}
