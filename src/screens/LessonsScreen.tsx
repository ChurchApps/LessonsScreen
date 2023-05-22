//import AsyncStorage from '@react-native-community/async-storage';
import React, { useEffect } from 'react'
import { Image, View, Text, FlatList, TouchableHighlight, ActivityIndicator, ImageBackground, BackHandler } from 'react-native'
import { ApiHelper, LessonInterface, ProgramInterface, StudyInterface, Styles, Utilities } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { MenuHeader } from '../components';

type Props = { navigateTo(page: string, data?:any): void; program: ProgramInterface, study: StudyInterface };

export const LessonsScreen = (props: Props) => {

  const [lessons, setLessons] = React.useState<LessonInterface[]>([]);
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
    ApiHelper.get("/lessons/public/study/" + props.study.id, "LessonsApi").then(data => { setLessons(data); setLoading(false); });
  }

  const handleSelect = (lesson: LessonInterface) => {
    props.navigateTo("lesson", {program: props.program, study: props.study, lesson: lesson});
  }

  const getCard = (data:any) => {
    
    const lesson = data.item as LessonInterface;
    return (
      <TouchableHighlight style={{ ...styles.item }} underlayColor={"#03a9f4"} onPress={() => { handleSelect(lesson)  }} hasTVPreferredFocus={data.index===0}>
        <View style={{width:"100%"}}>
          <Image style={{ height:hp("33%"), width:"100%" }} resizeMode="cover" source={{ uri: lesson.image }} />
          <Text style={{ ...Styles.smallWhiteText, alignSelf: "center" }}>{lesson.title}</Text>
        </View>
      </TouchableHighlight>
    )
    /*
    return (
      <TouchableHighlight style={{ ...styles.item }} underlayColor={"#03a9f4"} onPress={() => { handleSelect(lesson)  }} hasTVPreferredFocus={data.index===0}>
        <View>
          <Image style={{ height:hp("33%"), width:"100%" }} resizeMode="cover" source={{ uri: lesson.image }} />
          <Text style={{ ...Styles.smallWhiteText, alignSelf: "center" }}>{lesson.title}</Text>
        </View>
      </TouchableHighlight>
    )*/
  }

  const getCards = () => {
    if (loading) return <ActivityIndicator size='small' color='gray' animating={loading} />
    else {
      return(
      <View style={styles.list}>
        <FlatList
            data={lessons}
            numColumns={3}
            renderItem={getCard}
            keyExtractor={(item) => item.id}
          />  
      </View>
      )
    }
  }

  const handleBack = () => {
    props.navigateTo("studies", {program: props.program});
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    Utilities.trackEvent("Lessons Screen");
    loadData();
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return destroy;
  }

  useEffect(init, [])

  return (
    <View style={Styles.menuScreen}>
      <MenuHeader headerText="Select a Lesson" />

      <View style={{ ...Styles.menuWrapper, flex: 20 }}>
        {getCards()}
      </View>

    </View>
  )

}