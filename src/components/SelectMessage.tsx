import React from 'react'
import { Styles } from '../helpers';
import { View, Text, Image, FlatList, ListRenderItem, TouchableHighlight } from 'react-native';
import { CachedData } from "../helpers";

type Props = { onSelect: (index: number) => void };

export const SelectMessage = (props: Props) => {

  const renderItem: ListRenderItem<{ index: number, name: string }> = (data) => {
    return (
      <TouchableHighlight style={Styles.menuClickable} underlayColor={"#03a9f4"} onPress={() => { props.onSelect(data.item.index) }}>
        <Text style={Styles.whiteText}>{data.item.name}</Text>
      </TouchableHighlight>
    )
  }

  const determineMessages = () => {
    const result: { index: number, name: string }[] = []
    let idx = 0;
    for (const m of CachedData.messageFiles) {
      result.push({ index: idx, name: m.name });
      idx++;
    }
    return result;
  }

  const messages = determineMessages();

  return (
    <View style={Styles.menuScreen}>
      <View style={{ ...Styles.menuHeader, flexDirection: "row" }}>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <Image source={require('../images/logo.png')} style={Styles.menuHeaderImage} resizeMode="contain" />
        </View>
        <Text style={{ ...Styles.bigWhiteText, flex: 1, alignSelf: "center" }}>Select a Message</Text>
        <View style={{ flex: 1 }}></View>
      </View>
      <View style={Styles.menuWrapper}>
        <FlatList data={messages} renderItem={renderItem} keyExtractor={(item) => item.index.toString() || ""}  ></FlatList>
      </View>
    </View>
  )
}