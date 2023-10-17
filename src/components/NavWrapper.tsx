import { View, Image, Text, TouchableHighlight, findNodeHandle } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../helpers/CustomReactNativeResponsiveScreen';

import { CachedData, Styles } from '../helpers';
import { useRef, useState } from 'react';
import { NavItem } from './NavItem';

type Props = { screen: JSX.Element, navigateTo(page: string): void; };

export const NavWrapper = (props: Props) => {
  const [expanded, setExpanded] = useState(CachedData.navExpanded);
  //const settingsRef = useRef();
  

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


  //nextFocusDown={findNodeHandle(settingsRef.current)}
  const getContent = () => {
    return (
      <View style={{display:"flex", flexDirection:"column", height:hp("100%"), width:"100%",  }} accessible={true}>
        <View style={{flex:1}}>
          <Image source={logo} style={{height:hp("8%"), maxWidth:"90%", maxHeight:hp("6.9%"), alignSelf: "center", marginTop:hp("1%") }} resizeMode="contain" />
          <NavItem icon={"church"} text={"My Church"} expanded={expanded} setExpanded={changeExpanded} selected={false} onPress={handleChurchClick} />
          <NavItem icon={"video-library"} text={"Browse"} expanded={expanded} setExpanded={changeExpanded} selected={true} onPress={() => { props.navigateTo("programs"); }} />
        </View>
        <View style={{ marginBottom:hp("2%") }}>
          <NavItem icon={"settings"} text={"Settings"} expanded={expanded} setExpanded={changeExpanded} selected={false} onPress={() => { props.navigateTo("settings") }} />
        </View>
      </View>
    )
  }

//#29235c
  return (
    <View style={{ display:"flex", flexDirection:"row"}}>
      <View style={{flex:barWidth, backgroundColor: "#000000" }} >
        {getContent()}
      </View>
      <View style={{flex:(100-barWidth), alignItems:"flex-start", height:hp("100%")}}>
          <View style={{width:wp("93%"), height:hp("100%")}}>
            {props.screen}
          </View>
      </View>
  </View>
  )
}