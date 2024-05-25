import { Image, StyleSheet, Platform } from 'react-native';
import { Button, SearchBar, Card, Text } from '@rneui/themed';

import { HelloWave } from '../../components/HelloWave';
import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import MapView, { UrlTile } from 'react-native-maps';

import { useState, useEffect } from 'react';

import Geolocation from "@react-native-community/geolocation";

const targetCoordinates = { latitude: 52.5200, longitude: 13.4050 };

import {
    ViroARScene,
    ViroText,
    ViroTrackingStateConstants,
    ViroARSceneNavigator,
    ViroTrackingReason,
  } from "@viro-community/react-viro";

  const HelloWorldSceneAR = () => {
    const [text, setText] = useState("Initializing AR...");
    const [currentPosition, setCurrentPosition] = useState({longitude: 0, latitude: 0});
    const [heading, setHeading] = useState(0);
  
    function onInitialized(state: any, reason: ViroTrackingReason) {
      if (state === ViroTrackingStateConstants.TRACKING_NORMAL) {
        setText("AR ready!");
      } else if (state === ViroTrackingStateConstants.TRACKING_UNAVAILABLE) {
        setText("Tracking Unavailable");
      }
    }

    const calculateAngle = (currentCoords: {longitude: number, latitude: number}) => {
      let dx = targetCoordinates.longitude - currentCoords.longitude;
      let dy = targetCoordinates.latitude - currentCoords.latitude;
      let angle = Math.atan2(dy, dx);
      setHeading(angle);
  };
  
    useEffect(() => {
      Geolocation.requestAuthorization(() => {
        Geolocation.getCurrentPosition(
          position => {
            setCurrentPosition(position.coords);
            calculateAngle(position.coords);
          },
          error => console.error(error),
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
        );
      }, e => {});
    }, []);

    return (
      <ViroARScene onTrackingUpdated={onInitialized}>
        <ViroText
          text={text}
          rotation={[0,1,0]}
          scale={[0.5, 0.5, 0.5]}
          position={[0, 0, 0]}
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
  