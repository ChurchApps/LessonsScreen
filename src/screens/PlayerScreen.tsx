import React, { useRef } from "react";
import { HWEvent, TVEventControl, BackHandler, useTVEventHandler, Pressable, TextInput, View, StyleSheet, Animated, Dimensions } from "react-native";
// @ts-expect-error
import Icon from "react-native-vector-icons/MaterialIcons";
import { LessonInterface, ProgramInterface, StudyInterface } from "@churchapps/mobilehelper";
import { CachedData, Utilities } from "../helpers";
import { PlayerHelper } from "../helpers/PlayerHelper";
import GestureRecognizer from "react-native-swipe-gestures";
// @ts-expect-error
import KeepAwake from "react-native-keep-awake";
import { Message, SelectMessage } from "../components";

type Props = { navigateTo(page: string, data?: any): void; program?: ProgramInterface, study?: StudyInterface, lesson?: LessonInterface };

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const scaleWidth = (value: number) => (value / 1920) * screenWidth;
const scaleHeight = (value: number) => (value / 1080) * screenHeight;

export const PlayerScreen = (props: Props) => {

  const [showSelectMessage, setShowSelectMessage] = React.useState(false);
  const [messageIndex, setMessageIndex] = React.useState(0);
  const [paused, setPaused] = React.useState(false);
  const [triggerPauseCheck, setTriggerPauseCheck] = React.useState(0);
  const [progress, setProgress] = React.useState(0);

  const feedbackAnim = useRef(new Animated.Value(0)).current;
  const showFeedback = () => {

    if (!paused) {
      feedbackAnim.setValue(1);
      return;
    }

    Animated.sequence([
      Animated.timing(feedbackAnim, { toValue: 1, duration: 150, useNativeDriver: true }),
      Animated.delay(1000),
      Animated.timing(feedbackAnim, { toValue: 0, duration: 300, useNativeDriver: true })
    ]).start();
  };

  const init = () => {
    Utilities.trackEvent("Player Screen");
    TVEventControl.enableTVMenuKey();
    BackHandler.addEventListener("hardwareBackPress", () => { handleBack(); return true });
    return () => {
      TVEventControl.disableTVMenuKey();
      BackHandler.removeEventListener("hardwareBackPress", () => { handleBack(); return true });
    }
  }

  const handlePlayPause = () => {
    const newPausedState = !paused;
    setPaused(newPausedState);
    PlayerHelper.pendingPause = newPausedState;
    showFeedback();

    if (newPausedState) stopTimer();
    else startTimer();
  };

  const handleRemotePress = async (pendingKey: string) => {
    switch (pendingKey) {
      case "right":
      case "fastForward": handleRight(); break;
      case "left":
      case "rewind": handleLeft(); break;
      case "up": handleUp(); break;
      case "previous":
      case "info":
      case "down": handleBack(); break;
      case "select":
      case "playPause": handlePlayPause(); break;
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
    if (idx >= 0) setMessageIndex(idx)
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
  React.useEffect(() => { if (PlayerHelper.pendingPause !== paused) handlePlayPause(); }, [triggerPauseCheck]);

  const handleProgress = (data: { currentTime: number, playableDuration: number }) => {
    const { currentTime, playableDuration } = data;
    if (playableDuration > 0) setProgress(currentTime / playableDuration);
  }

  if (showSelectMessage) return <SelectMessage onSelect={handleMessageSelect} />;

  const config = { velocityThreshold: 0.3, directionalOffsetThreshold: 80 };

  const currentFileType = (() => {
    const parts = CachedData.messageFiles[messageIndex].url.split("?")[0].split(".");
    const ext = parts[parts.length - 1].toLowerCase();
    if (ext === "webm" || ext === "mp4" || CachedData.messageFiles[messageIndex].url.includes("externalVideos")) {
      return "video";
    }
    return "image";
  })();

  return (
    <GestureRecognizer onSwipeLeft={handleRight} onSwipeRight={handleLeft} onSwipeDown={handleUp} onSwipeUp={handleBack} config={config} style={{ flex: 1 }}>
      <Pressable onPress={handlePressablePress} style={{ flex: 1 }}>
        <KeepAwake />
        <Message
          file={CachedData.messageFiles[messageIndex]}
          downloaded={!props.lesson}
          paused={paused}
          onProgress={handleProgress}
        />
        <TextInput autoFocus style={{ display: "none" }} showSoftInputOnFocus={false} returnKeyType="none" />

        {currentFileType === 'video' && (
          <Animated.View
            pointerEvents="none"
            style={[
              StyleSheet.absoluteFill,
              styles.overlayWrapper,
              { backgroundColor: 'rgba(0,0,0,0.5)', opacity: feedbackAnim }
            ]}
          >
            <Pressable style={styles.playPauseButton} onPress={handlePlayPause}>
              <Icon name={paused ? "play-circle-outline" : "pause-circle-outline"} size={scaleHeight(120)} color="#fff" />
            </Pressable>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
          </Animated.View>
        )}
      </Pressable>
    </GestureRecognizer>
  )
}

const styles = StyleSheet.create({
  overlayWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  playPauseButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  progressContainer: {
    position: "absolute",
    bottom: scaleHeight(50),
    left: scaleWidth(40),
    right: scaleWidth(40),
    height: scaleHeight(10),
    backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: scaleHeight(5),
  },
  progressBar: {
    height: scaleHeight(10),
    backgroundColor: "#fff",
    borderRadius: scaleHeight(5),
  },
});
