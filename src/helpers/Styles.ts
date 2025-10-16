import {StyleSheet} from 'react-native';
import {DimensionHelper, StyleConstants} from '@churchapps/mobilehelper';

export const Styles = StyleSheet.create({
  //Splash
  splashMaincontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#29235c',
  },
  splashImage: {maxWidth: DimensionHelper.wp('70%'), alignSelf: 'center'},

  maincontainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '#000000',
  },

  H1: {
    color: '#FFFFFF',
    fontSize: DimensionHelper.hp('4.5%'),
    fontFamily: StyleConstants.RobotoBold,
  },
  H2: {
    color: '#FFFFFF',
    fontSize: DimensionHelper.wp('3.5%'),
    fontFamily: StyleConstants.RobotoBold,
    fontWeight: 'bold',
  },
  H3: {
    color: '#FFFFFF',
    fontSize: DimensionHelper.wp('3%'),
    fontFamily: StyleConstants.RobotoBold,
    fontWeight: '400',
  },

  messageImage: {maxWidth: DimensionHelper.wp('40%'), alignSelf: 'center'},
  bigWhiteText: {
    color: '#FFFFFF',
    fontSize: DimensionHelper.wp('5%'),
    textAlign: 'center',
  },
  giantWhiteText: {
    color: '#FFFFFF',
    fontSize: DimensionHelper.wp('15%'),
    textAlign: 'center',
  },
  whiteText: {
    color: '#FFFFFF',
    fontSize: DimensionHelper.wp('3%'),
    textAlign: 'center',
  },
  smallWhiteText: {
    color: '#FFFFFF',
    fontSize: DimensionHelper.wp('2%'),
    textAlign: 'center',
  },
  smallerWhiteText: {color: '#FFFFFF', fontSize: DimensionHelper.wp('1.5%')},

  // Menu / Navigation
  menuScreen: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flex: 1,
    backgroundColor: '#0f1724',
    width: '100%',
  },

  menuHeader: {
    height: DimensionHelper.hp('9%'),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    paddingHorizontal: DimensionHelper.wp('2%'),
    backgroundColor: '#111827',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(100,150,255,0.04)',
  },

  menuFooter: {
    height: DimensionHelper.hp('8%'),
    flexDirection: 'column',
    color: '#FFFFFF',
    backgroundColor: '#0b1220',
    padding: 8,
  },
  menuWrapper: {
    flex: 1,
    width: '100%',
    paddingVertical: DimensionHelper.hp('1%'),
  },
  menuList: {flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start'},

  // menu item used as a row
  menuClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    width: '100%',
    height: DimensionHelper.hp('8%'),
    paddingHorizontal: DimensionHelper.wp('3%'),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.03)',
  },

  smallMenuClickable: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: DimensionHelper.hp('6%'),
    justifyContent: 'flex-start',
    paddingHorizontal: DimensionHelper.wp('3%'),
    fontFamily: StyleConstants.RobotoBold,
    fontWeight: '700',
  },

  // Input styles
  textInputStyle: {
    alignSelf: 'center',
    width: DimensionHelper.wp('86%'),
    maxWidth: 900,
    fontSize: DimensionHelper.wp('2.6%'),
    backgroundColor: '#071024',
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    color: '#e6eef8',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  textInputStyleFocus: {
    borderWidth: 2,
    borderColor: '#03a9f4',
    shadowOpacity: 0.35,
    elevation: 6,
  },

  // Sidebar accents
  navAccent: {backgroundColor: '#0b1a2a'}, // slightly different from main menu background
  navItemActiveBackground: {
    backgroundColor: 'rgba(3,169,244,0.12)',
    borderRadius: 8,
  },
  navItemFocusBackground: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 8,
  },
});
