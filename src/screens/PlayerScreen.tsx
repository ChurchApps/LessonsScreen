import React from "react"
import { HWEvent, TVEventControl, BackHandler, useTVEventHandler, Pressable, TextInput } from "react-native"
import { LessonInterface, ProgramInterface, StudyInterface } from "@churchapps/mobilehelper";
import { CachedData, Utilities } from "../helpers";
import { PlayerHelper } from "../helpers/PlayerHelper";
import GestureRecognizer from "react-native-swipe-gestures";
import KeepAwake from "react-native-keep-awake";
import { Message, SelectMessage } from "../components";

type Props = { navigateTo(page: string, data?: any): void; program?: ProgramInterface, study?: StudyInterface, lesson?: LessonInterface };

export const PlayerScreen = (props: Props) => {

  const [showSelectMessage, setShowSelectMessage] = React.useState(false);
  const [messageIndex, setMessageIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [triggerPauseCheck, setTriggerPauseCheck] = React.useState(0);


  const init = () => {
    // Utilities.trackEvent("Player Screen");
    TVEventControl.enableTVMenuKey();
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return () => {
      TVEventControl.disableTVMenuKey();
      BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
    }
  }

  // const handlePlayPause = () => {
  //   PlayerHelper.pendingPause = false;
  //   if (PlayerHelper.timer) {
  //     stopTimer();
  //     setPaused(true);
  //   } else {
  //     startTimer();
  //     setPaused(false);
  //   }
  // }

  const handlePlayPause = () => {
    const newPausedState = !paused;
    setPaused(newPausedState);
    PlayerHelper.pendingPause = newPausedState;

    if (newPausedState) {
      stopTimer();
    } else {
      startTimer();
    }
  };

  const handleRemotePress = async (pendingKey: string) => {
    switch (pendingKey) {
      case "right":
      case "fastForward":
        handleRight();
        break;
      case "left":
      case "rewind":
        handleLeft();
        break;
      case "up":
        handleUp();
        break;
      case "previous":
      case "info":
      case "down":
        handleBack();
        break;
      case "select":
      case "playPause":
        handlePlayPause();
        break;
    }
  }


  useTVEventHandler((evt: HWEvent) => { handleRemotePress(evt.eventType); });

  const handleLeft = () => { stopTimer(); goBack(); startTimer(); }
  const handleRight = () => { stopTimer(); goForward(); startTimer(); }
  const handleUp = () => { if (!showSelectMessage) { stopTimer(); setShowSelectMessage(true); } }

  const handleBack = () => {
    if (!showSelectMessage) {
      stopTimer();
      if (props.lesson) props.navigateTo("lessonDetails", { program: props.program, study: props.study, lesson: props.lesson });
      else props.navigateTo("download");
    }
  }


  const goForward = () => {
    if (paused) setPaused(false);
    let idx = messageIndex + 1;
    if (idx < CachedData.messageFiles.length) setMessageIndex(idx)
    else handleBack();
  }

  const goBack = () => {
    if (paused) setPaused(false);
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

  // const startTimer = () => {
  //   if (PlayerHelper.timer) clearTimeout(PlayerHelper.timer);
  //   if (!CachedData.messageFiles[messageIndex].loopVideo) PlayerHelper.timer = setTimeout(goForward, CachedData.messageFiles[messageIndex].seconds * 1000)
  // }

  const startTimer = () => {
    if (PlayerHelper.timer) clearTimeout(PlayerHelper.timer);

    try {
      if (!CachedData.messageFiles[messageIndex].loopVideo) {
        PlayerHelper.timer = setTimeout(goForward, CachedData.messageFiles[messageIndex].seconds * 1000);
      }
    } catch (error) {
      setTimeout(startTimer, 5000);
    }
  };

  const handleMessageSelect = (index: number) => {
    if (paused) setPaused(false);
    setShowSelectMessage(false);
    setMessageIndex(index);
    startTimer();
  }

  const handlePressablePress = () => {
    setTriggerPauseCheck(Math.random());
  }

  React.useEffect(init, [])
  React.useEffect(startTimer, [messageIndex])
  // React.useEffect(() => {
  //   if (PlayerHelper.pendingPause) handlePlayPause();
  // }, [triggerPauseCheck]);

  React.useEffect(() => {
    if (PlayerHelper.pendingPause !== paused) {
      handlePlayPause();
    }
  }, [triggerPauseCheck]);

  if (showSelectMessage) {
    return <SelectMessage onSelect={handleMessageSelect} />
  } else {
    const config = { velocityThreshold: 0.3, directionalOffsetThreshold: 80 };
    return (
      <GestureRecognizer onSwipeLeft={handleRight} onSwipeRight={handleLeft} onSwipeDown={handleUp} onSwipeUp={handleBack} config={config} style={{ flex: 1 }}>
        <Pressable onPress={handlePressablePress}>
          <KeepAwake />
          <Message file={CachedData.messageFiles[messageIndex]} downloaded={!props.lesson} paused={paused} />
          <TextInput autoFocus={true} style={{ display: "none" }} showSoftInputOnFocus={false} returnKeyType="none" />
        </Pressable>
      </GestureRecognizer>
    )
  }


}

