import { Image, StyleSheet, Platform } from 'react-native';
import { Button, SearchBar, Card } from '@rneui/themed';

import { HelloWave } from '../../components/HelloWave';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import MapView, { UrlTile } from 'react-native-maps';

import { useState } from 'react';

import {
    ViroARScene,
    ViroText,
    ViroTrackingStateConstants,
    ViroARSceneNavigator,
    ViroTrackingReason,
  } from "@viro-community/react-viro";

  const HelloWorldSceneAR = () => {
    
    const [text, setText] = useState("Initializing AR...");
  
    function onInitialized(state: any, reason: ViroTrackingReason) {
      console.log("guncelleme", state, reason);
      if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
        setText("Hello World!");
      } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
        // Handle loss of tracking
      }
    }
  
    return (
      <ViroARScene onTrackingUpdated={onInitialized}>
        <ViroText
          text={text}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, -1]}
          style={styles.helloWorldTextStyle}
        />
      </ViroARScene>
    );
  };

export default function ARView() {
    return (
      <ViroARSceneNavigator
        autofocus={true}
        initialScene={{
          scene: HelloWorldSceneAR,
        }}
        style={styles.f1}
      />
    );
};

var styles = StyleSheet.create({
    f1: { width: 100, height: 100 },
    helloWorldTextStyle: {
      fontFamily: "Arial",
      fontSize: 30,
      color: "#ffffff",
      textAlignVertical: "center",
      textAlign: "center",
    },
  });
  