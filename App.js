import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import MTACaptivePortalUtil from './MTACaptivePortalUtil';

export default function App() {
  NetInfo.addEventListener(_handleNetworkChangeEvent);

  return (
    <View style={styles.container}>
      <Text>Leave this app running to auto-negotiate with MTA CaptivePortal!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

function _handleNetworkChangeEvent(state) {
  // Filter to wifi connection events
  if (state.type !== 'wifi' || state.isConnected === false) {
    return;
  }

  console.log('Connection Event: ', state);
  MTACaptivePortalUtil.authenticateWithCaptivePortal().catch(console.err);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
