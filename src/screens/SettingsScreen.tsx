import {DimensionHelper} from '../helpers/DimensionHelper';
import {useEffect, useState} from 'react';
import {
  BackHandler,
  Switch,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
import {MenuHeader} from '../components';
import {CachedData, Styles, Utilities} from '../helpers';

type Props = {
  navigateTo(page: string, data?: any): void;
  sidebarState: (state: boolean) => void;
  sidebarExpanded?: boolean;
};

export const SettingsScreen = (props: Props) => {
  let pkg = require('../../package.json');
  const appVersion = pkg.version;
  const [resolution, setResolution] = useState(CachedData.resolution);
  const toggleSwitch = () => {
    const val = resolution === '720' ? '1080' : '720';
    setResolution(val);
    CachedData.resolution = val;
    CachedData.setAsyncStorage('resolution', CachedData.resolution);
  };

  const handleBack = () => {
    props.sidebarState(true);
    return true;
  };

  useEffect(() => {
    Utilities.trackEvent('Mode Screen');
    const backHandler = BackHandler.addEventListener('hardwareBackPress', handleBack);
    return () => backHandler.remove();
  }, []);

  //return (<Text style={{ ...Styles.smallWhiteText, flex: 1, alignSelf: "center", textAlign: "right", paddingRight: 10 }}>This is a test of menu header text that just goes on and on. This is a test of menu header text that just goes on and on</Text>)
  return (
    <View style={Styles.menuScreen}>
      <MenuHeader headerText="Settings" />
      <View
        style={{
          flex: 10,
          width: '100%',
          paddingLeft: '3%',
          paddingRight: '3%',
        }}>
        {/* App version moved to bottom */}
        <View
          style={{flexDirection: 'row', marginTop: DimensionHelper.hp('2%')}}>
          <View style={{flex: 25, paddingTop: '1%'}}>
            <Text style={{...Styles.smallWhiteText, textAlign: 'left'}}>
              Your Church:
            </Text>
          </View>
          <View style={{flex: 75}}>
            <TouchableHighlight
              style={Styles.menuClickable}
              underlayColor={'#03a9f4'}
              onPress={() => {
                props.navigateTo('selectChurch');
              }}>
              <Text style={{...Styles.smallWhiteText, textAlign: 'left'}}>
                {CachedData.church?.name || 'None'}
              </Text>
            </TouchableHighlight>
          </View>
        </View>
        <View
          style={{flexDirection: 'row', marginTop: DimensionHelper.hp('2%')}}>
          <View style={{flex: 25, paddingTop: '1%'}}>
            <Text style={{...Styles.smallWhiteText, textAlign: 'left'}}>
              Higher Resolution:
            </Text>
          </View>
          <View style={{flex: 75}}>
            <Switch
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={'#03a9f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={toggleSwitch}
              value={resolution === '1080'}
            />
          </View>
        </View>
        <View
          style={{flexDirection: 'row', marginTop: DimensionHelper.hp('2%')}}>
          <View style={{flex: 50}}></View>
          <View style={{flex: 50}}>
            <Text
              style={{
                ...Styles.smallerWhiteText,
                textAlign: 'right',
                color: '#CCC',
                fontSize: DimensionHelper.wp('1.25%'),
              }}>
              Higher resolutions take longer to download and are not necessary
              for most churches. Only enable if video quality is not currently
              acceptable.
            </Text>
          </View>
        </View>
        <TouchableHighlight
          style={Styles.menuClickable}
          underlayColor={'#03a9f4'}
          onPress={() => props.navigateTo('PrivacyPolicy')}>
          <Text style={{...Styles.smallWhiteText, textAlign: 'left'}}>
            Privacy Policy
          </Text>
        </TouchableHighlight>

        <View style={{marginTop: DimensionHelper.hp('4%')}}>
          <Text style={{...Styles.smallWhiteText, textAlign: 'left', marginBottom: DimensionHelper.hp('1%')}}>
            Pairing Options:
          </Text>
          <TouchableHighlight
            style={{...Styles.menuClickable, marginBottom: DimensionHelper.hp('1%')}}
            underlayColor={'#03a9f4'}
            onPress={async () => {
              // Clear classroom pairing data
              CachedData.church = null;
              CachedData.room = null;
              CachedData.planTypeId = null;
              CachedData.pairedChurchId = null;
              await CachedData.setAsyncStorage('church', null);
              await CachedData.setAsyncStorage('room', null);
              await CachedData.setAsyncStorage('planTypeId', null);
              await CachedData.setAsyncStorage('pairedChurchId', null);
              props.navigateTo('planPairing');
            }}>
            <Text style={{...Styles.smallWhiteText, textAlign: 'left'}}>
              Pair to Plan
            </Text>
          </TouchableHighlight>
        </View>
      </View>

      {/* Version text */}
      <View
        style={{
          width: '100%',
          alignItems: 'center',
          marginTop: 'auto',
          paddingBottom: DimensionHelper.hp('2%'),
        }}>
        <Text
          style={{
            ...Styles.smallerWhiteText,
            color: '#777',
            fontSize: DimensionHelper.wp('1.2%'),
          }}>
          v{appVersion}
        </Text>
      </View>
    </View>
  );
};
