import React, { useEffect } from 'react'
import { Navigator } from './src/navigation/Navigator'
import CodePush from 'react-native-code-push'


const CODE_PUSH_OPTIONS = {
  checkFrequency: CodePush.CheckFrequency.ON_APP_START
}

const app = () => {

  useEffect(() => { CodePush.sync({ installMode: CodePush.InstallMode.IMMEDIATE }, syncWithCodePush); }, [])

  const syncWithCodePush = (status: CodePush.SyncStatus) => {
    switch (status) {
      case CodePush.SyncStatus.AWAITING_USER_ACTION: console.log("AWAITING_USER_ACTION"); break;
      case CodePush.SyncStatus.CHECKING_FOR_UPDATE: console.log("CHECKING_FOR_UPDATE"); break;
      case CodePush.SyncStatus.DOWNLOADING_PACKAGE: console.log("DOWNLOADING_PACKAGE"); break;
      case CodePush.SyncStatus.INSTALLING_UPDATE: console.log("INSTALLING_UPDATE"); break;
      case CodePush.SyncStatus.SYNC_IN_PROGRESS: console.log("SYNC_IN_PROGRESS"); break;
      case CodePush.SyncStatus.UNKNOWN_ERROR: console.log("UNKNOWN_ERROR"); break;
      case CodePush.SyncStatus.UPDATE_IGNORED: console.log("UPDATE_IGNORED"); break;
      case CodePush.SyncStatus.UPDATE_INSTALLED: console.log("UPDATE_INSTALLED"); break;
      case CodePush.SyncStatus.UP_TO_DATE: console.log("UP_TO_DATE"); break;
    }
    console.log('Codepush sync status', status);
  }



  return <Navigator />

}
export default CodePush(CODE_PUSH_OPTIONS)(app);