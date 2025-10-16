import React, { useEffect } from "react"
import { Image, View, FlatList, TouchableHighlight, ActivityIndicator, BackHandler } from "react-native"
import { ApiHelper, ProgramInterface, DimensionHelper } from "@churchapps/mobilehelper";
import { Styles, Utilities } from "../helpers";
import { MenuHeader } from "../components";

type Props = { navigateTo(page: string, data?:any): void; sidebarState: (state: boolean) => void; sidebarExpanded?: boolean; };

export const ProgramsScreen = (props: Props) => {

  const [programs, setPrograms] = React.useState<ProgramInterface[]>([]);
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
    ApiHelper.get("/programs/public", "LessonsApi").then(data => { setPrograms(data); setLoading(false); });
  }

  const handleSelect = (program: ProgramInterface) => {
    props.navigateTo("studies", {program: program});
  }

  const getCard = (data:any) => {
    const program = data.item as ProgramInterface;

    return (
      <TouchableHighlight style={{ ...styles.item }} underlayColor={"rgba(10, 80, 150, 0.8)"} onPress={() => { handleSelect(program)  }} onFocus={() => setFocusedId(data.id)} hasTVPreferredFocus={!props.sidebarExpanded && data.index === 0 && focusedId !== data.id}>
        <Image style={{ height:DimensionHelper.hp("33%"), width:"100%", borderRadius: 8, }} resizeMode="cover" source={{ uri: program.image }} />
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
    // props.navigateTo("splash");
    props.sidebarState(true)
  }

  const destroy = () => {
    BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
  }

  const init = () => {
    // Utilities.trackEvent("Program Screen");
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
