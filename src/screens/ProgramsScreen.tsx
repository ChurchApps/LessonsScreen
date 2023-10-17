import React, { useEffect } from "react"
import { Image, View, FlatList, TouchableHighlight, ActivityIndicator, BackHandler } from "react-native"
import { ApiHelper, ProgramInterface } from "@churchapps/mobilehelper";
import { Styles, Utilities } from "../helpers";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "../helpers/CustomReactNativeResponsiveScreen";
import { MenuHeader } from "../components";

type Props = { navigateTo(page: string, data?:any): void; };

export const ProgramsScreen = (props: Props) => {

  const [programs, setPrograms] = React.useState<ProgramInterface[]>([]);
  const [loading, setLoading] = React.useState(false);

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
      padding: 10,
    }
  };


  const loadData = () => {
    ApiHelper.get("/programs/public", "LessonsApi").then(data => { setPrograms(data); setLoading(false); });
  }

  const handleSelect = (program: ProgramInterface) => {
    props.navigateTo("studies", {program: program});
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
    if (loading) return <ActivityIndicator size="small" color="gray" animating={loading} />
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


  const handleBack = () => {
    props.navigateTo("splash");
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    Utilities.trackEvent("Program Screen");
    loadData();
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return destroy;
  }

  useEffect(init, [])

  return (
    <View style={{ ...Styles.menuScreen }}>
      <MenuHeader headerText="Browse Programs" />
      <View style={{ ...Styles.menuWrapper, flex: 90 }}>
        {getCards()}
      </View>
    </View>
  )


}
