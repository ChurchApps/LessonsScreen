import {Styles} from '../helpers';
import {View, Text, TouchableOpacity} from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

type Props = {
  headerText: string;
  showBackbutton?: boolean;
  onpress?: () => void;
};

export const MenuHeader = (props: Props) => (
  <View style={Styles.menuHeader}>
    {props.showBackbutton && (
      <TouchableOpacity
        onPress={props.onpress}
        accessibilityLabel="Back"
        style={{paddingRight: 12}}>
        <View
          style={{
            width: 36,
            height: 36,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <MaterialIcons
            name={'keyboard-arrow-left'}
            color={'#ffffff'}
            size={28}
          />
        </View>
      </TouchableOpacity>
    )}

    <Text
      numberOfLines={1}
      ellipsizeMode="tail"
      style={{...Styles.H2, flex: 1, color: '#FFFFFF'}}>
      {props.headerText}
    </Text>
  </View>
);
