import { ACCESS_API, LESSONS_API } from "@env"
import { ApiHelper } from "./ApiHelper"

export class EnvironmentHelper {
  public static AccessApi = "";
  public static LessonsApi = "";

  static init = () => {
    EnvironmentHelper.initProd();

    ApiHelper.apiConfigs = [
      { keyName: "AccessApi", url: EnvironmentHelper.AccessApi, jwt: "", permisssions: [] },
      { keyName: "LessonsApi", url: EnvironmentHelper.LessonsApi, jwt: "", permisssions: [] }
    ]

    //leaving for now as a hack.  For some reason outputting the value makes the difference of whether it's actually populated or not.
    console.log(JSON.stringify(ApiHelper.apiConfigs[1].url));
  }

  static initDev = () => {
    EnvironmentHelper.AccessApi = ACCESS_API || "";
    EnvironmentHelper.LessonsApi = LESSONS_API || "";
  }

  // NOTE - None of these values are secret
  static initProd = () => {
    EnvironmentHelper.AccessApi = "https://accessapi.churchapps.org";
    EnvironmentHelper.LessonsApi = "https://api.lessons.church";
  }

}