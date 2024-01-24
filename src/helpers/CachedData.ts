import AsyncStorage from "@react-native-async-storage/async-storage";
import { ChurchInterface, ClassroomInterface, LessonPlaylistFileInterface } from "@churchapps/mobilehelper";
import RNFS from "react-native-fs";

export class CachedData {
  static church: ChurchInterface;
  static room: ClassroomInterface;
  static messageFiles: LessonPlaylistFileInterface[];

  static totalCachableItems: number = 0;
  static cachedItems: number = 0;
  static cachePath = RNFS.CachesDirectoryPath;

  static navExpanded = false;
  static currentScreen = "";

  static async getAsyncStorage(key: string) {
    const json = await AsyncStorage.getItem(key);
    if (json) return JSON.parse(json);
    else return null;
  }

  static async setAsyncStorage(key: string, obj: any) {
    await AsyncStorage.setItem(key, JSON.stringify(obj));
  }

  static async prefetch(files: LessonPlaylistFileInterface[], changeCallback: (cached: number, total: number) => void) {
    this.cachedItems = 0;
    let i = 0;
    this.totalCachableItems = files.length;
    changeCallback(this.cachedItems, this.totalCachableItems);

    for (const f of files) {
      try {
        console.log("Downloading: " + f.url);
        await this.load(f);
        console.log("Downloaded", f.url)
      } catch (e) {
        console.log("Download Failed: " + e.toString());
      }
      i++;
      this.cachedItems = i;
      changeCallback(this.cachedItems, this.totalCachableItems);
    }
  }

  static getFilePath(url: string) {
    const parts = url.split("?")[0].split("/");
    parts.splice(0, 3);
    const fullPath = RNFS.CachesDirectoryPath + "/" + parts.join("/");
    return fullPath;
  }

  static async load(file: LessonPlaylistFileInterface) {
    const fullPath = this.getFilePath(file.url);
    if (!await RNFS.exists(fullPath)) await this.download(file, fullPath);
  }

  private static async download(file: LessonPlaylistFileInterface, diskPath: string) {
    const idx = diskPath.lastIndexOf("/");
    const folder = diskPath.substring(0, idx);
    if (!await RNFS.exists(folder)) await RNFS.mkdir(folder);
    const downloadResponse = RNFS.downloadFile({ fromUrl: file.url, toFile: diskPath });
    await downloadResponse.promise;
  }

}
