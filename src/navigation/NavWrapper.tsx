import {DimensionHelper} from '@churchapps/mobilehelper';
import {
  Animated,
  Easing,
  Image,
  View,
  findNodeHandle,
  useTVEventHandler,
} from 'react-native';

import React, {useEffect, useRef} from 'react';
import {CachedData, Styles} from '../helpers';
import {NavItem} from './NavItem';

type Props = {
  screen: React.JSX.Element;
  navigateTo(page: string): void;
  sidebarState: (state: boolean) => void;
  sidebarExpanded?: boolean;
};

export const NavWrapper = (props: Props) => {
  // const [expanded, setExpanded] = useState(CachedData.navExpanded);
  const settingsRef = useRef(null);
  const browseRef = useRef(null);
  const animatedWidth = useRef(
    // new Animated.Value(CachedData.navExpanded ? 22 : 8),
    new Animated.Value(props.sidebarExpanded ? 22 : 8),
  ).current;

  const animatedWidthPercent = animatedWidth.interpolate({
    inputRange: [8, 22],
    outputRange: ['8%', '22%'],
  });

  // Change expanded state and animate sidebar width
  // const changeExpanded = (expanded: boolean) => {
  //   // CachedData.navExpanded = expanded;
  //   // setExpanded(CachedData.navExpanded);
  //   props.sidebarState(expanded);
  //   Animated.timing(animatedWidth, {
  //     toValue: expanded ? 22 : 8,
  //     duration: 240,
  //     easing: Easing.out(Easing.cubic),
  //     useNativeDriver: false,
  //   }).start();
  // };

  useEffect(() => {
    if (CachedData.currentScreen && !highlightedItem)
      highlightedItem = CachedData.currentScreen;

    Animated.timing(animatedWidth, {
      toValue: props.sidebarExpanded ? 22 : 8,
      duration: 240,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [props.sidebarExpanded]);

  const handleClick = (id: string) => {
    props.navigateTo(id);
  };

  const handleChurchClick = () => {
    if (CachedData.church) handleClick('selectRoom');
    else handleClick('selectChurch');
  };

  // TV-specific: useTVEventHandler catches DPAD events reliably on TV platforms
  const tvEventHandler = (evt: any) => {
    // evt.eventType may be 'right', 'left', etc. Some platforms include keyCode
    const eventType = evt && (evt.eventType || evt.eventName || evt.type);
    const keyCode = evt && (evt.keyCode || evt.which);
    const isRight = eventType === 'right' || keyCode === 22;
    if (isRight && props.sidebarExpanded) {
      props.sidebarState(!props.sidebarExpanded);
    }
  };
  useTVEventHandler(tvEventHandler as any);

  // width managed by animated value

  const logo = props.sidebarExpanded
    ? require('../images/logo-sidebar.png')
    : require('../images/logo-icon.png');

  let highlightedItem = 'browse';
  switch (CachedData.currentScreen) {
    case 'selectRoom':
    case 'selectChurch':
    case 'download':
    case 'player':
      highlightedItem = 'church';
      break;
    case 'settings':
      highlightedItem = 'settings';
      break;
  }

  const getContent = () => (
    <View
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: DimensionHelper.hp('100%'),
        width: '100%',
      }}
      accessible={true}>
      <View style={{flex: 1}}>
        <Image
          source={logo}
          style={{
            height: DimensionHelper.hp('8%'),
            maxWidth: '90%',
            maxHeight: DimensionHelper.hp('6.9%'),
            alignSelf: 'center',
            marginTop: DimensionHelper.hp('1%'),
          }}
          resizeMode="contain"
        />
        <NavItem
          icon={'church'}
          text={'My Church'}
          expanded={props.sidebarExpanded}
          setExpanded={props.sidebarState}
          selected={highlightedItem === 'church'}
          onPress={handleChurchClick}
        />
        <NavItem
          icon={'video-library'}
          text={'Browse'}
          expanded={props.sidebarExpanded}
          setExpanded={props.sidebarState}
          selected={highlightedItem === 'browse'}
          onPress={() => {
            handleClick('programs');
          }}
          ref={browseRef}
          nextFocusDown={findNodeHandle(settingsRef.current)}
        />
      </View>
      <View style={{marginBottom: DimensionHelper.hp('2%')}}>
        <NavItem
          icon={'settings'}
          text={'Settings'}
          expanded={props.sidebarExpanded}
          setExpanded={props.sidebarState}
          selected={highlightedItem === 'settings'}
          onPress={() => {
            handleClick('settings');
          }}
          ref={settingsRef}
          nextFocusUp={findNodeHandle(browseRef.current)}
        />
      </View>
    </View>
  );

  //#29235c
  return (
    <View style={{display: 'flex', flexDirection: 'row'}}>
      <Animated.View
        style={{
          width: animatedWidthPercent,
          paddingTop: DimensionHelper.hp('0.5%'),
          backgroundColor: Styles.navAccent.backgroundColor,
        }}>
        {getContent()}
      </Animated.View>
      <View
        style={{
          flex: 1,
          alignItems: 'flex-start',
          height: DimensionHelper.hp('100%'),
        }}>
        <View
          style={{
            width: DimensionHelper.wp('92%'),
            height: DimensionHelper.hp('100%'),
            backgroundColor: 'transparent',
          }}>
          {props.screen}
        </View>
      </View>
    </View>
  );
};
