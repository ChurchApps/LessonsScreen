import React from 'react'
import { Styles } from '../helpers';
import { View, Text, Image } from 'react-native';

type Props = { headerText: string };

export const MenuHeader = (props: Props) => {
  return (
      <View style={{ ...Styles.menuHeader, flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image source={require('../images/logo.png')} style={Styles.menuHeaderImage} resizeMode="contain" />
        </View>
        <Text style={{ ...Styles.smallWhiteText, flex: 1, alignSelf: "center", textAlign: "right", paddingRight: 10 }}>{props.headerText}</Text>
      </View>
  )
}