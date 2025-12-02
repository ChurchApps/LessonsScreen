// Uncomment to use environment variables from .env file
// import { ACCESS_API, LESSONS_API } from "@env"
import { ApiHelper } from "./ApiHelper";

// Declare these as fallbacks when not using @env imports
declare const ACCESS_API: string | undefined;
declare const LESSONS_API: string | undefined;





export class EnvironmentHelper {
  public static MembershipApi = "";
  public static LessonsApi = "";

  static init = () => {
    EnvironmentHelper.initProd();

    ApiHelper.apiConfigs = [
      { keyName: "MembershipApi", url: EnvironmentHelper.MembershipApi, jwt: "", permisssions: [] },
      { keyName: "LessonsApi", url: EnvironmentHelper.LessonsApi, jwt: "", permisssions: [] }
    ]

    //leaving for now as a hack.  For some reason outputting the value makes the difference of whether it's actually populated or not.
    console.log(JSON.stringify(ApiHelper.apiConfigs[1].url));
  }

  static initDev = () => {
    EnvironmentHelper.MembershipApi = ACCESS_API || "";
    EnvironmentHelper.LessonsApi = LESSONS_API || "";
  }

  // NOTE - None of these values are secret
  static initProd = () => {
    EnvironmentHelper.MembershipApi = "https://api.churchapps.org/membership";
    EnvironmentHelper.LessonsApi = "https://api.lessons.church";
  }

}
