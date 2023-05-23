import React from 'react'
import { HWKeyEvent, TVMenuControl, BackHandler, useTVEventHandler, Pressable } from 'react-native'
import { CachedData, LessonInterface, ProgramInterface, StudyInterface, Utilities } from "../helpers";
import { PlayerHelper } from '../helpers/PlayerHelper';
import GestureRecognizer from 'react-native-swipe-gestures';
import KeepAwake from "react-native-keep-awake";
import { Message, SelectMessage } from '../components';

type Props = { navigateTo(page: string, data?:any): void; program?: ProgramInterface, study?: StudyInterface, lesson?:LessonInterface };

export const PlayerScreen = (props: Props) => {

  const [showSelectMessage, setShowSelectMessage] = React.useState(false);
  const [messageIndex, setMessageIndex] = React.useState(0);

  const init = () => {
    Utilities.trackEvent("Player Screen");
    TVMenuControl.enableTVMenuKey();
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return () => {
      TVMenuControl.disableTVMenuKey();
      BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
    }
  }

  const handlePlayPause = () => {
    if (PlayerHelper.timer) stopTimer(); else startTimer();
    //todo: Pause the video
  }

  const handleRemotePress = async (pendingKey: string) => {
    switch (pendingKey) {
      case "right": handleRight(); break;
      case "left": handleLeft(); break;
      case "up": handleUp(); break;
      case "previous":
      case "info":
      case "down":
        handleBack(); break;
      case "select": handlePlayPause(); break;
        break;
    }
  }

  useTVEventHandler((evt: HWKeyEvent) => { handleRemotePress(evt.eventType); });

  const handleLeft = () => { stopTimer(); goBack(); startTimer(); }
  const handleRight = () => { stopTimer(); goForward(); startTimer(); }
  const handleUp = () => { if (!showSelectMessage) { stopTimer(); setShowSelectMessage(true); } }
  
  const handleBack = () => {
    if (!showSelectMessage) {
      stopTimer();
      if (props.lesson) props.navigateTo("lessonDetails", {program: props.program, study: props.study, lesson: props.lesson});
      else props.navigateTo("download");
    }
  }


  const goForward = () => {
    let idx = messageIndex + 1;
    if (idx < CachedData.messageFiles.length) setMessageIndex(idx)
    else handleBack();
  }

  const goBack = () => {
    let idx = messageIndex - 1;
    if (idx >= 0) setMessageIndex(idx);
    else handleBack();
  }

  const stopTimer = () => {
    if (PlayerHelper.timer) {
      clearTimeout(PlayerHelper.timer);
      PlayerHelper.timer = null;
    }
  }

  const startTimer = () => {
    if (PlayerHelper.timer) clearTimeout(PlayerHelper.timer);
    PlayerHelper.timer = setTimeout(goForward, CachedData.messageFiles[messageIndex].seconds * 1000)
  }

  const handleMessageSelect = (index: number) => {
    setShowSelectMessage(false);
    setMessageIndex(index);
    startTimer();
  }

  React.useEffect(init, [])
  React.useEffect(startTimer, [messageIndex])

  if (showSelectMessage) {
    return <SelectMessage onSelect={handleMessageSelect} />
  } else {
    const config = { velocityThreshold: 0.3, directionalOffsetThreshold: 80 };
    return (

      <GestureRecognizer onSwipeLeft={handleRight} onSwipeRight={handleLeft} onSwipeDown={handleUp} onSwipeUp={handleBack} config={config} style={{ flex: 1 }} >
        <Pressable onPress={handlePlayPause}>
          <KeepAwake />
          <Message file={CachedData.messageFiles[messageIndex]} downloaded={!props.lesson} />
        </Pressable>
      </GestureRecognizer >

    )
  }


}