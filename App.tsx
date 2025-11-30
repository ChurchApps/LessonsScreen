import { useEffect } from "react";
import { Navigator } from "./src/navigation/Navigator";

import { EnvironmentHelper } from "./src/helpers/EnvironmentHelper";
import { LogBox } from "react-native";
import { ErrorHelper } from "@churchapps/mobilehelper";
import * as Updates from "expo-updates";

EnvironmentHelper.init();

const checkForUpdates = async () => {
  if (__DEV__) return;
  try {
    const update = await Updates.checkForUpdateAsync();
    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
  } catch (error) {
    console.log("Error checking for updates:", error);
  }
};

const App = () => {
  LogBox.ignoreLogs(['new NativeEventEmitter']);

  useEffect(() => {
    ErrorHelper.init();
    checkForUpdates();
  }, []);

  return <Navigator />

}
export default App
