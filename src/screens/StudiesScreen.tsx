//import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { Image, View, Text, FlatList, TouchableHighlight, ActivityIndicator, ImageBackground, BackHandler } from 'react-native'
import { ApiHelper, ProgramInterface, StudyInterface, Styles, Utilities } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { MenuHeader } from '../components';

type Props = { navigateTo(page: string, data?:any): void; program:ProgramInterface };

export const StudiesScreen = (props: Props) => {

  const [studies, setStudies] = React.useState<StudyInterface[]>([]);
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
    ApiHelper.get("/studies/public/program/" + props.program.id, "LessonsApi").then(data => { setStudies(data); setLoading(false); });
  }

  const handleSelect = (study: StudyInterface) => {
    props.navigateTo("lessons", {program: props.program, study: study});
  }

  const getCard = (data:any) => {
    
    const study = data.item as StudyInterface;
    return (
      <TouchableHighlight style={{ ...styles.item }} underlayColor={"#03a9f4"} onPress={() => { handleSelect(study)  }} hasTVPreferredFocus={data.index===0}>
        <Image style={{ height:hp("33%"), width:"100%" }} resizeMode="cover" source={{ uri: study.image }} />
      </TouchableHighlight>
    )
  }

  const getCards = () => {
    if (loading) return <ActivityIndicator size='small' color='gray' animating={loading} />
    else {
      return(
      <View style={styles.list}>
        <FlatList
            data={studies}
            numColumns={3}
            renderItem={getCard}
            keyExtractor={(item) => item.id}
          />  
      </View>
      )
    }
  }
  
  const handleBack = () => {
    props.navigateTo("programs");
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    Utilities.trackEvent("Studies Screen");
    loadData();
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return destroy;
  }

  useEffect(init, [])

  return (
    <View style={Styles.menuScreen}>
      <MenuHeader headerText="Select a Study" />
      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getCards()}
      </View>
    </View>
  )

}