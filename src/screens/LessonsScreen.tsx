
import React, { useEffect } from "react"
import { Image, View, Text, FlatList, TouchableHighlight, ActivityIndicator, BackHandler } from "react-native"
import { ApiHelper, LessonInterface, ProgramInterface, StudyInterface, DimensionHelper } from "@churchapps/mobilehelper";
import { Styles, Utilities } from "../helpers";
import { MenuHeader } from "../components";

type Props = { navigateTo(page: string, data?:any): void; program: ProgramInterface, study: StudyInterface };

export const LessonsScreen = (props: Props) => {

  const [lessons, setLessons] = React.useState<LessonInterface[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [focusedId, setFocusedId] = React.useState(null);

  const styles:any = {
    list: {
      flex: 1,
      marginHorizontal: "auto",
      width: "100%"
    },
    item: {
      flex: 1,
      maxWidth: "33%",
      alignItems: "center",
      padding: 7,
      borderRadius: 10,
    }
  };

  const loadData = () => {
    ApiHelper.get("/lessons/public/study/" + props.study.id, "LessonsApi").then(data => { setLessons(data); setLoading(false); });
  }

  const handleSelect = (lesson: LessonInterface) => {
    props.navigateTo("lessonDetails", {program: props.program, study: props.study, lesson: lesson});
  }

  const getCard = (data:any) => {
    const lesson = data.item as LessonInterface;

    return (
      <TouchableHighlight style={{ ...styles.item }} underlayColor={"rgba(10, 80, 150, 0.8)"} onPress={() => { handleSelect(lesson)  }}onFocus={() => setFocusedId(data.id)} hasTVPreferredFocus={data.index === 0 && focusedId !== data.id}>
        <View style={{width:"100%"}}>
          <Image style={{ height:DimensionHelper.hp("33%"), width:"100%", borderRadius: 8 }} resizeMode="cover" source={{ uri: lesson.image }} />
          <Text style={{ ...Styles.smallWhiteText, alignSelf: "center" }}>{lesson.title}</Text>
        </View>
      </TouchableHighlight>
    )
  }

  const getCards = () => {
    if (loading) return <ActivityIndicator size="small" color="gray" animating={loading} />
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
