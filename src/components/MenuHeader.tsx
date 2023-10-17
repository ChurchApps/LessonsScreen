import React from 'react'
import { Styles } from '../helpers';
import { View, Text, Image } from 'react-native';

type Props = { headerText: string };

export const MenuHeader = (props: Props) => {
  return (
      <View style={{ ...Styles.menuHeader, flexDirection: "row" }}>
        <Text style={{ ...Styles.H1, flex: 1, alignSelf: "center", textAlign: "center" }}>{props.headerText}</Text>
      </View>
  )
}