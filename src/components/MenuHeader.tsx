import React from "react"
import { Styles } from "../helpers";
import { View, Text, TouchableOpacity } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"

type Props = { headerText: string , showBackbutton?:boolean , onpress?:()=> void };

export const MenuHeader = (props: Props) => (
  <View style={{ ...Styles.menuHeader, flexDirection: "row" }}>
    {props.showBackbutton
 && <TouchableOpacity onPress={props.onpress}>
   <MaterialIcons  name={"keyboard-arrow-left"} color={"white"} size={30} />
 </TouchableOpacity>
    }

    <Text style={{ ...Styles.H1, flex: 1, alignSelf: "center", textAlign: "center" }}>{props.headerText}</Text>
  </View>
)
