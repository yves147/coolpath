import React, { useRef } from 'react';
import { StyleSheet, Image, View, Platform } from 'react-native';
import { Button, SearchBar, Card } from '@rneui/themed';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { ScreenHeight, Text } from '@rneui/base';
import { Link } from 'react-router-native';
import { WebView } from 'react-native-webview';
import { HTMLContent } from '../../components/Webmap.js';

const MapPageContent = () => {
  const webviewRef = useRef(null);

  const addMarker = () => {
    const message = JSON.stringify({
      type: 'addMarker',
      lat: 51.01519,
      lng: 13.73832,
      popupText: 'Neuer Marker!'
    }); 

    if (webviewRef.current) {
      webviewRef.current.postMessage(message);
    }
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