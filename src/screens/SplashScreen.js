// SplashScreen.js
import React, {useEffect, useRef} from 'react';
import { View,  StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import * as SplashScreen from 'expo-splash-screen';

export default function AnimatedSplashScreen({onFinish}) {

  const video = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hideAsync();
    },1);
  },[]);
  
  return (
    <View style={styles.container}>
      <Video
      ref={video}
      source={require('../../assets/TreggoLoading.mp4')}
      style={styles.video}
      resizeMode='contain'
      isLooping={true}
      shouldPlay
      onPlaybackStatusUpdate={(status) => {
        if (status.didJustFinish){
          onFinish?.()
        }
      }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffffff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
});