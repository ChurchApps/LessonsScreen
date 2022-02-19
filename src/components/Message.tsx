import React from 'react'
import { PlaylistFileInterface, Styles } from '../helpers';
import { View, Text } from 'react-native';


type Props = {
  file: PlaylistFileInterface
};


export const Message = (props: Props) => {
  console.log("***MESSAGE - " + props?.file.name)


  return <View >
    <Text style={Styles.bigWhiteText}>{props.file.name}</Text>
  </View>

}



