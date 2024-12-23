import React, { memo, useRef } from "react";
import { TextInput, View } from "react-native";
import { Styles } from "../helpers";
import { DimensionHelper } from "@churchapps/mobilehelper";



const ChurchSearch = ({ searchText, setSearchText }) => {

    const textInputRef = useRef(null)

    return (
        <View style={{ ...Styles.menuWrapper, flex: 5 }}>
            <TextInput ref={textInputRef} autoFocus={true} onFocus={(val)=>{console.log('Calue us',val.nativeEvent.target)}} style={{ ...Styles.textInputStyle, width: "100%", marginTop: DimensionHelper.hp("4%"), marginBottom: DimensionHelper.hp("4%") }} placeholder={'Church name'} autoCapitalize="none" autoCorrect={false} keyboardType="default" placeholderTextColor={'lightgray'} value={searchText} onChangeText={setSearchText} returnKeyType="none" />
        </View>
    )
}

export default memo(ChurchSearch)