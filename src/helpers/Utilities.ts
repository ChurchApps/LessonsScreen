
import Analytics from 'appcenter-analytics';
import { CachedData } from './CachedData';


export class Utilities {

  static trackEvent(name: string, data?: any) {
    var pkg = require('../../package.json');

    const props = (data) ? data : {}
    props.church = CachedData.church?.name;
    props.classRoom = CachedData.room?.name;
    props.appVersion = pkg.version;
    Analytics.trackEvent(name, props);
  }


}


