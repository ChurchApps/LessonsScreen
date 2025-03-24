import { useEffect } from "react";
import { Navigator } from "./src/navigation/Navigator";

import { EnvironmentHelper } from "./src/helpers/EnvironmentHelper";
import { LogBox } from "react-native";
import { ErrorHelper } from "@churchapps/mobilehelper";



EnvironmentHelper.init();

const App = () => {
  LogBox.ignoreLogs(['new NativeEventEmitter']);



  
  useEffect(() => { ErrorHelper.init(); }, []);

  return <Navigator />

}
export default App
