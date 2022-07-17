import { URL, URLSearchParams } from 'react-native-url-polyfill';

export default class MTACaptivePortalUtil {
  static async authenticateWithCaptivePortal() {
    // If the device isn't captivated by MTA's captive portal, do nothing.
    let [deviceCaptivated, responseUrl] = await this._isDeviceCaptivatedByMTA();
    if (deviceCaptivated) {
      console.log('GEN204 succeeded, or redirected unexpectedly: responseUrl=%s', responseUrl)
      return;
    }

    // Extract the important url parameters and re-post them to authenticate.
    const params = responseUrl.searchParams;
    const [nasid, vlan, pip, sid] = [params.get('NASID'), params.get('VLAN'), params.get('PIP'), params.get('SID')];
    const postParams = new URLSearchParams({'nasid': nasid, 'vlan': vlan, 'pip': pip, 'sid': sid});
    const response = await fetch('https://bap.aws.opennetworkexchange.net/api/v2/auth/dfp', {method: 'POST', body: postParams});
    if (!response.ok) console.log('Failed authentication with captive portal: response=%s', response.body);

    // Check to see if the device is still captivated by MTA's captive portal.
    [deviceCaptivated, responseUrl] = await this._isDeviceCaptivatedByMTA();
    if (deviceCaptivated) {
      console.log('Expected freedom after authentication, but device still captive: responseUrl=%s', responseUrl);
    }
  }

  static async _isDeviceCaptivatedByMTA() {
    // Test the connection with standard gen_204 check. Return false if it succeeds, or if it is redirected to an unexpected host.
    const response = await fetch('http://www.google.com/gen_204');
    const responseUrl = new URL(response.url);
    const captivated = response.redirected && responseUrl.hostname === 'bap.aws.opennetworkexchange.net';
    return [captivated, responseUrl];
  }
}