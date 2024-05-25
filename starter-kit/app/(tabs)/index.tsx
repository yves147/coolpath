import React, { useRef } from 'react';
import { StyleSheet, Image, View, Platform } from 'react-native';
import { Button, SearchBar, Card } from '@rneui/themed';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { ScreenHeight, Text } from '@rneui/base';
import { Link } from 'react-router-native';
import { WebView } from 'react-native-webview';
import { HTMLContent } from '../../components/Webmap.js';
import axios from 'axios'

const MapPageContent = () => {
  const webviewRef = useRef(null);

  const addMarker = () => {
    axios.get('http://141.56.56.54:8015/route?start_long=13.732952417266883&start_lat=51.03403674195253&target_long=13.751770840358994&target_lat=51.06299305729817&perceived_gamma=0.4&climatope_zeta=2').then(function (response) {
      // handle success
      let points = []
      for(let i = 0; i < response.data.length; i++) {
        /*const message = JSON.stringify({
          type: 'addMarker',
          lat: response.data[i].latitude,
          lng: response.data[i].longitude,
        });*/
        points.push([response.data[i].latitude,response.data[i].longitude])
    
        
      }
      const message = JSON.stringify({
        type: 'line',
        pnts: points
      })
      
      if (webviewRef.current) {
        webviewRef.current.postMessage(message);
      }
    }).catch(function(error) {
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

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        style={styles.webview}
        source={{ html: HTMLContent }}
      />
      <Button title="Marker hinzufügen" onPress={addMarker} />
    </View>
  );
};

export default function Index() {
  return (
    <ThemedView style={styles.main}>
      <ThemedView style={styles.titleContainer}>
        <ThemedView>
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
        <View style={styles.container}>
          <MapPageContent />
        </View>
      </ThemedView>
      <ThemedView style={styles.btn}>
        <Link to="/route">
          <Button
            size="lg"
            style={{ marginTop: 20 }}
            title="Nach Route suchen"
            containerStyle={{
              borderRadius: 1,
            }}
          />
        </Link>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    height: 550,
  },
  main: {
    height: '100%',
  },
  btn: {
    marginTop: 15,
    fontSize: 100,
  },
  titleContainer: {
    marginTop: 20,
    padding: 10,
  },
  webview: {
    flex: 1,
  },
});