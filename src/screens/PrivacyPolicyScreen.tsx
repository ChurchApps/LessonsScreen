import { View, Text } from 'react-native'
import React from 'react'
import WebView from 'react-native-webview'
import { MenuHeader } from '../components'


type Props = { navigateTo(page: string, data?:any): void; };
const PrivacyPolicyScreen = (props : Props) => (
  <View style={{flex:1}}>
    <MenuHeader headerText="Privacy Policy" showBackbutton={true} onpress={()=>props.navigateTo("settings")} />
    <WebView source={{ uri: 'https://churchapps.org/privacy' }} style={{ flex: 1 }} />
  </View>
)

export default PrivacyPolicyScreen
