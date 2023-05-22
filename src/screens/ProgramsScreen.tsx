//import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { Image, View, Text, FlatList, TouchableHighlight, ActivityIndicator } from 'react-native'
import { ApiHelper, ProgramInterface, Styles, Utilities } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

type Props = { navigateTo(page: string): void; };

export const ProgramsScreen = (props: Props) => {

  const [programs, setPrograms] = React.useState<ProgramInterface[]>([]);
  const [loading, setLoading] = React.useState(false);

  const styles:any = {
    list: {
      flex: 1,
      marginHorizontal: "auto",
      width: wp("100%")
    },
    item: {
      flex: 1,
      maxWidth: "33%",
      alignItems: "center",
      padding: 10,
    }
  };

  
  const loadData = () => {
    ApiHelper.get("/programs/public", "LessonsApi").then(data => { setPrograms(data); setLoading(false); });
  }

  const handleSelect = (program: ProgramInterface) => {
    /*
    CachedData.church = church;
    CachedData.setAsyncStorage("church", church).then(() => {
      props.navigateTo("selectRoom");
    })
    */
  }

  const getCard = (data:any) => {
    
    const program = data.item as ProgramInterface;
    return (
      <TouchableHighlight style={{ ...styles.item }} underlayColor={"#03a9f4"} onPress={() => { handleSelect(program)  }} hasTVPreferredFocus={data.index===0}>
        <Image style={{ height:hp("33%"), width:"100%" }} resizeMode="cover" source={{ uri: program.image }} />
      </TouchableHighlight>
    )
  }

  const getCards = () => {
    if (loading) return <ActivityIndicator size='small' color='gray' animating={loading} />
    else {
      return(
      <View style={styles.list}>
        <FlatList
            data={programs}
            numColumns={3}
            renderItem={getCard}
            keyExtractor={(item) => item.id}
          />  
      </View>
      )
    }
  }

  const init = () => {
    Utilities.trackEvent("Program Screen");
    loadData();
  }

  useEffect(init, [])

  return (
    <View style={Styles.menuScreen}>
      <View style={{ ...Styles.menuHeader, flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "row", paddingLeft: 10 }}>
          <Image source={require('../images/logo.png')} style={Styles.menuHeaderImage} resizeMode="contain" />
        </View>
        <Text style={{ ...Styles.smallWhiteText, flex: 1, alignSelf: "center", textAlign: "right", paddingRight: 10 }}>Select a Program</Text>
      </View>

      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getCards()}
      </View>

    </View>
  )

}