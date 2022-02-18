import { StyleSheet } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

export class StyleConstants {


  static fontSize = wp("4%")

  //Colors
  static baseColor = '#24B8FE'
  static baseColor1 = '#08A1CD'
  static blueColor = '#2196F3'
  static darkColor = '#3c3c3c';
  static blackColor = 'black';
  static grayColor = 'gray';
  static lightGrayColor = 'lightgray';
  static whiteColor = 'white';
  static yellowColor = "#FEAA24";
  static greenColor = '#70DC87';
  static redColor = "#B0120C";
  static cyanColor = '#1C9BA0';
  static darkPink = '	#FF69B4';
  static ghostWhite = '#F6F6F8'

  //Font
  static RobotoBold = 'Roboto-Bold';
  static RobotoBlack = 'Roboto-Black';
  static RobotoItalic = 'Roboto-Italic';
  static RobotoLight = 'Roboto-Light';
  static RobotoMedium = 'Roboto-Medium';
  static RobotoRegular = 'Roboto-Regular';
  static RobotoThin = 'Roboto-Thin';
}

export const Styles = StyleSheet.create({
  //Splash
  splashMaincontainer: { alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: "#000000" },
  splashImage: { maxWidth: wp('70%'), alignSelf: 'center' },

  messageImage: { maxWidth: wp('40%'), alignSelf: 'center' },
  bigWhiteText: { color: "#FFFFFF", fontSize: wp('5%'), textAlign: "center" },
  giantWhiteText: { color: "#FFFFFF", fontSize: wp('15%'), textAlign: "center" },
  whiteText: { color: "#FFFFFF", fontSize: wp('3%'), textAlign: "center" },
  smallWhiteText: { color: "#FFFFFF", fontSize: wp('2%'), textAlign: "center" },

  menuScreen: { alignItems: 'center', justifyContent: 'center', flex: 1, backgroundColor: "#1d1f21", width: "100%" },
  menuHeader: { height: hp("10%"), flexDirection: "column", color: "#FFFFFF", backgroundColor: "#343a40", width: "100%" },
  menuHeaderImage: { maxHeight: hp("8%"), maxWidth: hp("20%"), flex: 1, alignSelf: "center" },
  menuFooter: { height: hp("8%"), flexDirection: "column", color: "#FFFFFF", backgroundColor: "#343a40", padding: 5 },
  menuWrapper: { flex: 1, width: "100%" },
  menuList: { flex: 1, alignItems: "flex-start", justifyContent: 'flex-start' },
  menuClickable: { alignItems: "flex-start", justifyContent: 'center', width: "100%", height: hp("8%"), paddingLeft: wp("1%") }

})