import { StyleSheet } from "react-native"
import { DimensionHelper, StyleConstants } from "@churchapps/mobilehelper";


export const Styles = StyleSheet.create({
  //Splash
  splashMaincontainer: { alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: "#29235c" },
  splashImage: { maxWidth:DimensionHelper.wp("70%"), alignSelf: "center" },

  maincontainer: { alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: "#000000" },
  navAccent: { backgroundColor: "#000000" },

  H1: { color: "#FFFFFF", fontSize: DimensionHelper.hp("4.5%"), fontFamily: StyleConstants.RobotoBold },
  H2: { color: "#FFFFFF", fontSize: DimensionHelper.wp("3.5%"), fontFamily: StyleConstants.RobotoBold, fontWeight: "bold" },
  H3: { color: "#FFFFFF", fontSize: DimensionHelper.wp("3%"), fontFamily: StyleConstants.RobotoBold, fontWeight: "400" },


  messageImage: { maxWidth: DimensionHelper.wp("40%"), alignSelf: "center" },
  bigWhiteText: { color: "#FFFFFF", fontSize: DimensionHelper.wp("5%"), textAlign: "center" },
  giantWhiteText: { color: "#FFFFFF", fontSize: DimensionHelper.wp("15%"), textAlign: "center" },
  whiteText: { color: "#FFFFFF", fontSize: DimensionHelper.wp("3%"), textAlign: "center" },
  smallWhiteText: { color: "#FFFFFF", fontSize: DimensionHelper.wp("2%"), textAlign: "center" },
  smallerWhiteText: { color: "#FFFFFF", fontSize: DimensionHelper.wp("1.5%") },



  menuScreen: { alignItems: "center", justifyContent: "center", flex: 1, backgroundColor: "#000000", width: "100%" },

  menuHeader: { height: DimensionHelper.hp("10%"), flexDirection: "column", color: "#FFFFFF", width: "100%" , justifyContent:'center', alignItems:'center'},


  menuFooter: { height: DimensionHelper.hp("8%"), flexDirection: "column", color: "#FFFFFF", backgroundColor: "#343a40", padding: 5 },
  menuWrapper: { flex: 1, width:"100%" },
  menuList: { flex: 1, alignItems: "flex-start", justifyContent: "flex-start" },
  menuClickable: { alignItems: "flex-start", justifyContent: "center", width: "100%", height: DimensionHelper.hp("8%"), paddingLeft: DimensionHelper.wp("1%") },
  smallMenuClickable: { alignItems: "flex-start", width: "100%", height: DimensionHelper.hp("6%"), justifyContent: "center", fontFamily: StyleConstants.RobotoBold, fontWeight:"bold" },

  textInputStyle: { alignItems: "center", justifyContent: "center", fontSize: DimensionHelper.hp("4%"), backgroundColor: "white", padding: 4 }

})
