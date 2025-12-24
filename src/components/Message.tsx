import React from "react"
import { CachedData } from "../helpers";
import { LessonPlaylistFileInterface } from "../interfaces";
import { Image } from "react-native";
import { DimensionHelper } from "../helpers/DimensionHelper";
import Video from "react-native-video";

type Props = {
  file: LessonPlaylistFileInterface,
  downloaded: boolean,
  paused: boolean,
  onProgress?: (data: { currentTime: number; playableDuration: number }) => void
};


export const Message = (props: Props) => {

  const [internalPaused, setInternalPaused] = React.useState(props.paused);

  React.useEffect(() => {
    setInternalPaused(props.paused);
  }, [props.paused]);

  React.useEffect(() => {
    setInternalPaused(props.paused);
  }, [props.file]);

  // const getMessageType = () => {
  //   const parts = props.file.url.split("?")[0].split(".");
  //   const ext = parts[parts.length - 1];
  //   let result = "image"
  //   switch (ext.toLocaleLowerCase()) {
  //     case "webm":
  //     case "mp4":
  //       result = "video"
  //       break;
  //   }

  //   if (props.file.url.indexOf("externalVideos") > -1) result = "video";

  //   //console.log("Message Type:", result, props.file.url.split("?")[0])
  //   return result;
  // }

  const getMessageType = (): 'image' | 'video' => {
    const parts = props.file.url.split("?")[0].split(".");
    const ext = parts[parts.length - 1].toLowerCase();
    if (ext === "webm" || ext === "mp4" || props.file.url.indexOf("externalVideos") > -1) {
      return "video";
    }
    return "image";
  };

  // const getContent = () => {
  //   let result = <></>
  //   switch (getMessageType()) {
  //     case "image":
  //       result = getImage();
  //       break;
  //     case "video":
  //       result = getVideo();
  //       break;
  //   }
  //   return result
  // }

  const getVideo = () => {
    const filePath = (props.downloaded) ? "file://" + CachedData.getFilePath(props.file.url) : props.file.url;
    return (<Video
      source={{ uri: filePath }}
      repeat={props.file.loopVideo}
      resizeMode="cover"
      style={{ width: DimensionHelper.wp("100%"), height: DimensionHelper.hp("100%") }}
      poster={(props.downloaded) ? "" : "https://lessons.church/images/loading.png"}
      paused={internalPaused}
      playInBackground={false}
      playWhenInactive={false}
      onProgress={props.onProgress}
      controls={false}
      disableFocus={true}
    />)
  }

  const getImage = () => {
    const filePath = (props.downloaded) ? "file://" + CachedData.getFilePath(props.file.url) : props.file.url;
    return (<Image source={{ uri: filePath }} style={{ width: DimensionHelper.wp("100%"), height: DimensionHelper.hp("100%") }} />);
  }

  const content = React.useMemo(() => {
    return getMessageType() === "video" ? getVideo() : getImage();
  }, [props.file, internalPaused, props.downloaded]);

  return content;

  // return getContent()

}




