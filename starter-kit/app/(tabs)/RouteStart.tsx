import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { Button, SearchBar, Card } from '@rneui/themed';

import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { WebView } from 'react-native-webview';
import { HTMLContent } from '../../components/Webmap.js';
import axios from 'axios'


const MapPageContent = () => {
  const webviewRef = useRef(null);

  const addMarker = () => {
    axios.get('http://141.56.56.54:8015/route?start_long=13.732952417266883&start_lat=51.03403674195253&target_long=13.751770840358994&target_lat=51.06299305729817&perceived_gamma=0.4&climatope_zeta=2').then(function (response) {
      // handle success
      let points = []
      for (let i = 0; i < response.data.length; i++) {
        /*const message = JSON.stringify({
          type: 'addMarker',
          lat: response.data[i].latitude,
          lng: response.data[i].longitude,
        });*/
        points.push([response.data[i].latitude, response.data[i].longitude])


      }
      const message = JSON.stringify({
        type: 'line',
        pnts: points
      })

      if (webviewRef.current) {
        webviewRef.current.postMessage(message);
      }
    }).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    })
  };
  addMarker()
  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        style={styles.webview}
        source={{ html: HTMLContent }}
      />
    </View>
  );
};

export default function RouteStart() {


  return (
    <ThemedView style={styles.titleContainer}>


      <ThemedView style={styles.stepContainer}>
        <Image
          style={{
            resizeMode: 'contain',
            height: 100,
            width: 200,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
          source={require('../../media/logo.jpeg')}
        />

      </ThemedView>
      <ThemedView style={styles.headerroute}>
        <ThemedView style={styles.startend}>
          <ThemedView style={styles.headdata}>
            <ThemedText style={styles.firstelement}>
              Start:
            </ThemedText>
            <ThemedText style={styles.secondel}>
              Bautzner/Rothenburger Straße
            </ThemedText>
          </ThemedView>
          <ThemedView style={styles.headdata}>
            <ThemedText style={styles.firstelement}>
              Ziel:
            </ThemedText>
            <ThemedText style={styles.secondel}>
              Reichenbachstraße
            </ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={styles.startend}>
          <ThemedView style={styles.headdata}>
            <ThemedText style={{
              width: "auto",
              flex: 1, height: 1,
              fontWeight: 'bold'
            }}>
              Durchschnittstemperatur:
            </ThemedText>
            <ThemedText style={{
              paddingLeft: 10,
              flex: 1, height: 1,
              
            }}>
              23°C
            </ThemedText>
            
          </ThemedView>
          <ThemedView style={styles.headdata}>
            <ThemedText style={{
              width: "auto",
              flex: 1, height: 1
            }}>
                 
            </ThemedText>
            <ThemedText style={{
              paddingLeft: 10,
              flex: 1, height: 1
            }}>
                 
            </ThemedText>
            
          </ThemedView> 
        </ThemedView>
      </ThemedView>
      <ThemedView
        style={styles.map}
      >
        <MapPageContent />
      </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
  startend: {
    flex: 1
  },
  secondel: {
    flex: 1
  },
  firstelement: {
    width: "auto",
    flex: 1,
    fontWeight: 'bold'
  },

  headdata: {
    paddingLeft: 2,
    flex: 1,
    display: "flex",
    flexDirection: "column",
    maxWidth: "100%",

  },
  headerroute: {
    backgroundColor: "black",
    height: 100,
    display: "flex",
    flexDirection: "row",
    borderStyle: "solid",
    borderWidth: 1,
  },

  stepContainer: {
    gap: 1,
  },
  searchBar: {

  },
  map: {
    height: '100%',
  },
  btncontainer: {
    marginTop: 10
  },
  container: {
    backgroundColor: '#fff',
    height: 550
  },
  main: {
    height: '100%',
  },
  titleContainer: {
    marginTop: -10,
    padding: 10,
    height: '100%'
  },
  webview: {
    flex: 1,
  },
});
