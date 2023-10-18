import { View, Text, TouchableHighlight } from "react-native";
import { Styles } from "../helpers";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useState } from "react";
import React from "react";
import { DimensionHelper } from "@churchapps/mobilehelper";

type Props = {
  icon:string,
  text:string,
  selected:boolean,
  expanded:boolean,
  setExpanded: (expanded:boolean) => void,
  onPress?: () => void,
  nextFocusDown?: any,
  nextFocusUp?: any,
};

//eslint-disable-next-line
export const NavItem = React.forwardRef((props: Props, ref) => {

  const [highlighted, setHighlighted] = useState(false);

  const handleFocusChange = (focused:boolean) => {
    props.setExpanded(focused);
    setHighlighted(focused);
  }

  let color = props.selected ? "#03a9f4" : "#999999";
  if (highlighted) color = "#ffffff";

  const iconStyle = {
    color: color,
    flex:2,
    marginLeft:DimensionHelper.wp("1.5%"),
    marginTop:DimensionHelper.hp("1.5%")
  }

  return (
    <TouchableHighlight underlayColor={"#03a9f4"} onPress={() => { if (props.onPress) props.onPress(); }} hasTVPreferredFocus={false} onFocus={() => { handleFocusChange(true); }} onBlur={() => { handleFocusChange(false) }} style={{marginTop:DimensionHelper.wp("1%")}} ref={ref as React.MutableRefObject<TouchableHighlight>} nextFocusDown={props.nextFocusDown} nextFocusUp={props.nextFocusUp}>
      <View style={{display:"flex", flexDirection:"row"}}>
        <Icon name={props.icon} color={color} style={iconStyle} size={DimensionHelper.hp("5%")} />
        {(props.expanded) && (<Text style={{ ...Styles.smallWhiteText, color:color, flex:8, textAlign:"left", marginTop:DimensionHelper.hp("1%") }}>{props.text}</Text>)}
      </View>
    </TouchableHighlight>
  )
});
