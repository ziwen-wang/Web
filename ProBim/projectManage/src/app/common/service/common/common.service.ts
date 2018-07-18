import {Injectable} from '@angular/core';

@Injectable()
export class CommonService {

  constructor() {
  }

  public browserCheck(): boolean {
    let sUserAgent = navigator.userAgent.toLowerCase();
    let bIsIpad = sUserAgent.match(/ipad/i) && sUserAgent.match(/ipad/i)[0] === 'ipad';
    let bIsIphoneOs = sUserAgent.match(/iphone/i) && sUserAgent.match(/iphone/i)[0] === 'iphone';
    let bIsMidp = sUserAgent.match(/midp/i) && sUserAgent.match(/midp/i)[0] === 'midp';
    let bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) && sUserAgent.match(/rv:1.2.3.4/i)[0] === 'rv:1.2.3.4';
    let bIsUc = sUserAgent.match(/ucweb/i) && sUserAgent.match(/ucweb/i)[0] === 'ucweb';
    let bIsAndroid = sUserAgent.match(/android/i) && sUserAgent.match(/android/i)[0] === 'android';
    let bIsCE = sUserAgent.match(/windows ce/i) && sUserAgent.match(/windows ce/i)[0] === 'windows ce';
    let bIsWM = sUserAgent.match(/windows mobile/i) && sUserAgent.match(/windows mobile/i)[0] === 'windows mobile';

    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      return true;
    } else {
      return false;
    }
  }

}
