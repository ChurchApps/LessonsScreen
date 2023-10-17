import React, { useEffect } from 'react'
import { Text, View, FlatList, TouchableHighlight, BackHandler } from 'react-native'
import { Styles, Utilities } from "../helpers";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "../helpers/CustomReactNativeResponsiveScreen";
import { MenuHeader } from '../components';

type Props = { navigateTo(page: string, data?:any): void; };

export const ModeScreen = (props: Props) => {
  const modes = ["Classroom", "Browse"];

  const styles:any = {
    list: {
      flex: 1,
      marginTop: hp("30%"),
      marginHorizontal: "auto",
      width: "100%",
      justifyContent: "center"
    },
    item: {
      flex: 1,
      maxWidth: "50%",
      alignItems: "center",
      padding: wp("5%"),
    }
  };

  
  const handleSelect = (mode: string) => {
    switch (mode)
    {
      case "Classroom":
        props.navigateTo("selectChurch");
        break;
      case "Browse":
        props.navigateTo("programs");
        break;
    }
  }

  const getCard = (data:any) => {
    
    const mode = data.item as string;
    const displayName = (mode==="Classroom") ? "Select Classroom" : "Browse Programs"
    return (
      <TouchableHighlight style={{ ...styles.item }} underlayColor={"#03a9f4"} onPress={() => { handleSelect(mode)  }} hasTVPreferredFocus={data.index===0}>
        <Text style={{ ...Styles.bigWhiteText }}>{displayName}</Text>
      </TouchableHighlight>
    )
  }

  const getCards = () => {
    return(
    <View style={styles.list}>
      <FlatList
          data={modes}
          numColumns={3}
          renderItem={getCard}
          keyExtractor={(item) => item}
          style={{ width: "100%" }}
        />  
    </View>
    )
  }
  
  const handleBack = () => {
    props.navigateTo("splash");
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }
  
  const init = () => {
    Utilities.trackEvent("Mode Screen");
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return destroy;
  }

  useEffect(init, [])

  //return (<Text style={{ ...Styles.smallWhiteText, flex: 1, alignSelf: "center", textAlign: "right", paddingRight: 10 }}>This is a test of menu header text that just goes on and on. This is a test of menu header text that just goes on and on</Text>)
  return (
    <View style={{ flex:1, width:"100%"}}>
      

      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getCards()}
      </View>

    </View>
  )

}