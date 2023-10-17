import { Dimensions, PixelRatio } from "react-native";

let screenWidth = Dimensions.get('window').width;
let screenHeight = Dimensions.get('window').height;


const widthPercentageToDP = (widthPercent:any) => {
  const elemWidth = typeof widthPercent === "number" ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel(screenWidth * elemWidth / 100);
};

const heightPercentageToDP = (heightPercent:any) => {
  const elemHeight = typeof heightPercent === "number" ? heightPercent : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel(screenHeight * elemHeight / 100);
};

const listenOrientationChange = (that:any, callback:() => void) => {
  Dimensions.addEventListener('change', newDimensions => {
    screenWidth = newDimensions.window.width;
    screenHeight = newDimensions.window.height;
    callback();
  });
};

const removeOrientationListener = () => {
  try {
    Dimensions.removeEventListener('change', () => {});
  } catch (error) {
    console.log(error);
  }

};

export {
  widthPercentageToDP,
  heightPercentageToDP,
  listenOrientationChange,
  removeOrientationListener
};
