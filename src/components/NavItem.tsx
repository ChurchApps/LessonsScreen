import { View, Text, TouchableHighlight } from 'react-native';
import { Styles } from '../helpers';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from '../helpers/CustomReactNativeResponsiveScreen';
import { useState } from 'react';
import React from 'react';

type Props = { 
  icon:string, 
  text:string, 
  selected:boolean, 
  expanded:boolean, 
  setExpanded: (expanded:boolean) => void,
  onPress?: () => void
};

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
    marginLeft:wp("1.5%"),
    marginTop:hp("1.5%")
  }

  

  return (
    <TouchableHighlight underlayColor={"#03a9f4"} onPress={() => { if (props.onPress) props.onPress(); }} hasTVPreferredFocus={false} onFocus={() => { handleFocusChange(true); }} onBlur={() => { handleFocusChange(false) }} style={{marginTop:wp("1%")}}>
      <View style={{display:"flex", flexDirection:"row"}}>
        <Icon name={props.icon} color={color} style={iconStyle} size={hp("5%")} />
        {(props.expanded) && (<Text style={{ ...Styles.smallWhiteText, color:color, flex:8, textAlign:"left", marginTop:hp("1%") }}>{props.text}</Text>)}
      </View>
    </TouchableHighlight>
  )
});