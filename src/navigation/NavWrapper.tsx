import { View, Image, findNodeHandle } from "react-native";
import { DimensionHelper } from "@churchapps/mobilehelper";

import { CachedData } from "../helpers";
import { useRef, useState } from "react";
import { NavItem } from "./NavItem";
import React from "react";

type Props = { screen: React.JSX.Element, navigateTo(page: string): void; };

export const NavWrapper = (props: Props) => {
  const [expanded, setExpanded] = useState(CachedData.navExpanded);
  const settingsRef = useRef(null);
  const browseRef = useRef(null);


  //blur then focus focus nav bar to flicker without this
  const changeExpanded = (expanded:boolean) => {
    CachedData.navExpanded = expanded;
    setTimeout(() => {
      setExpanded(CachedData.navExpanded);
    }, 50);
  }

  const handleChurchClick = () => {
    if (CachedData.church) props.navigateTo("selectRoom");
    else props.navigateTo("selectChurch");
  }


  let barWidth = 7;

  if (expanded) barWidth = 20;

  const logo = (expanded) ? require('../images/logo-sidebar.png') : require('../images/logo-icon.png');

  let highlightedItem = "browse";
  switch (CachedData.currentScreen) {
    case "selectRoom":
    case "selectChurch":
    case "download":
    case "player":
      highlightedItem = "church";
      break;
    case "settings":
      highlightedItem = "settings";
      break;
  }


  const getContent = () => (
    <View style={{display:"flex", flexDirection:"column", height:DimensionHelper.hp("100%"), width:"100%",  }} accessible={true}>
      <View style={{flex:1}}>
        <Image source={logo} style={{height:DimensionHelper.hp("8%"), maxWidth:"90%", maxHeight:DimensionHelper.hp("6.9%"), alignSelf: "center", marginTop:DimensionHelper.hp("1%") }} resizeMode="contain" />
        <NavItem icon={"church"} text={"My Church"} expanded={expanded} setExpanded={changeExpanded} selected={highlightedItem==="church"} onPress={handleChurchClick} />
        <NavItem icon={"video-library"} text={"Browse"} expanded={expanded} setExpanded={changeExpanded} selected={highlightedItem==="browse"} onPress={() => { props.navigateTo("programs"); }} ref={browseRef} nextFocusDown={findNodeHandle(settingsRef.current)} />
      </View>
      <View style={{ marginBottom:DimensionHelper.hp("2%") }}>
        <NavItem icon={"settings"} text={"Settings"} expanded={expanded} setExpanded={changeExpanded} selected={highlightedItem==="settings"} onPress={() => { props.navigateTo("settings") }} ref={settingsRef} nextFocusUp={findNodeHandle(browseRef.current)}  />
      </View>
    </View>
  )

  //#29235c
  return (
    <View style={{ display:"flex", flexDirection:"row"}}>
      <View style={{flex:barWidth, backgroundColor: "#000000" }}>
        {getContent()}
      </View>
      <View style={{flex:(100-barWidth), alignItems:"flex-start", height:DimensionHelper.hp("100%")}}>
        <View style={{width:DimensionHelper.wp("93%"), height:DimensionHelper.hp("100%")}}>
          {props.screen}
        </View>
      </View>
    </View>
  )
}
