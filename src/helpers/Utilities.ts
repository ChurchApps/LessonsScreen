import { CachedData } from "./CachedData";

// TODO: Replace with your chosen analytics solution (Firebase Analytics, etc.)
export class Utilities {

  static trackEvent(name: string, data?: any) {
    let pkg = require('../../package.json');

    const props = (data) ? data : {}
    props.church = CachedData.church?.name;
    props.classRoom = CachedData.room?.name;
    props.appVersion = pkg.version;

    // Analytics implementation removed (AppCenter shutdown)
    // Add your analytics provider here:
    // Example: analytics().logEvent(name, props);
    console.log('Analytics Event:', name, props);
  }


}


