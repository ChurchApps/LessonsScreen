import React from 'react'
import { CachedData, PlaylistFileInterface } from '../helpers';
import { Image } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Video from 'react-native-video';

type Props = {
  file: PlaylistFileInterface,
  downloaded: boolean
};


export const Message = (props: Props) => {

  const getMessageType = () => {
    const parts = props.file.url.split("?")[0].split(".");
    const ext = parts[parts.length - 1];
    let result = "image"
    switch (ext.toLocaleLowerCase()) {
      case "webm":
      case "mp4":
        result = "video"
        break;
    }

    console.log("Message Type:", result, props.file.url.split("?")[0])
    return result;
  }

  const getContent = () => {
    let result = <></>
    switch (getMessageType()) {
      case "image":
        result = getImage();
        break;
      case "video":
        result = getVideo();
        break;
    }
    return result
  }

  const getVideo = () => {
    const filePath = (props.downloaded) ? "file://" + CachedData.getFilePath(props.file.url) : props.file.url;
    return (<Video source={{ uri: filePath }} repeat={props.file.loopVideo} resizeMode="cover" style={{ width: wp("100%"), height: hp("100%") }} />)
  }

  const getImage = () => {
    const filePath = (props.downloaded) ? "file://" + CachedData.getFilePath(props.file.url) : props.file.url;
    return (<Image source={{ uri: filePath }} style={{ width: wp("100%"), height: hp("100%") }} />);
  }

  return getContent()

}



