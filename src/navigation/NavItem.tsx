import {DimensionHelper} from '../helpers/DimensionHelper';
import React, { useState, useRef } from 'react';
import {Text, TouchableHighlight, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Styles} from '../helpers';

type Props = {
  icon: string;
  text: string;
  selected: boolean;
  expanded: boolean;
  setExpanded: (expanded: boolean) => void;
  onPress?: () => void;
  nextFocusDown?: any;
  nextFocusUp?: any;
};

//eslint-disable-next-line
export const NavItem = React.forwardRef((props: Props, ref) => {
  // Track if this is the initial mount - only use hasTVPreferredFocus on first render
  const isInitialMount = useRef(true);
  const [, forceUpdate] = useState(0);

  const handleFocusChange = (focused: boolean) => {
    // After first focus event, disable hasTVPreferredFocus to allow normal navigation
    if (isInitialMount.current) {
      isInitialMount.current = false;
      forceUpdate(n => n + 1);
    }
    // Expand sidebar when NavItem receives focus (user navigated left to sidebar)
    if (focused) {
      props.setExpanded(true);
    }
  };

  let color = props.selected ? '#03a9f4' : '#94a3b8';

  const iconContainer = {
    width: DimensionHelper.wp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  } as any;

  return (
    <TouchableHighlight
      underlayColor={'rgba(3,169,244,0.07)'}
      onPress={() => {
        props.setExpanded(false);
        if (props.onPress) props.onPress();
      }}
      // Add accent background when selected and slightly rounded corners
      style={{
        marginTop: DimensionHelper.wp('1%'),
        marginHorizontal: DimensionHelper.wp('1%'),
        paddingVertical: 8,
        borderRadius: 8,
        overflow: 'hidden',
        alignSelf: 'stretch',
        backgroundColor: props.selected
          ? 'rgba(3,169,244,0.08)'
          : 'transparent',
      }}
      hasTVPreferredFocus={isInitialMount.current && props.expanded && props.selected}
      onFocus={() => {
        handleFocusChange(true);
      }}
      onBlur={() => {
        handleFocusChange(false);
      }}
      ref={ref as any}
      {...({
        nextFocusDown: props.nextFocusDown,
        nextFocusUp: props.nextFocusUp,
      } as any)}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <View style={iconContainer}>
          <Icon
            name={props.icon}
            color={color}
            size={DimensionHelper.hp('4.2%')}
          />
        </View>
        {props.expanded && (
          <Text
            numberOfLines={1}
            style={{
              ...Styles.smallWhiteText,
              color: color,
              flex: 1,
              textAlign: 'left',
            }}>
            {props.text}
          </Text>
        )}
      </View>
    </TouchableHighlight>
  );
});
