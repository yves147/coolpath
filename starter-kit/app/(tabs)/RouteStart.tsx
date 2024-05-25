import React from 'react';
import { Image, StyleSheet, Platform, View, Text } from 'react-native';
import { Button, SearchBar, Card } from '@rneui/themed';

import ParallaxScrollView from '../../components/ParallaxScrollView';
import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import MapView, { UrlTile } from 'react-native-maps';

export default function RouteStart(){

  
  return (
    <ThemedView style={styles.titleContainer}>


      <ThemedView style={styles.stepContainer}>
        <Image style={{
          resizeMode: 'contain',
          height: 100,
          width: 200,
        }}
          source={require('../../media/logo.jpeg')} />

      </ThemedView>
      <ThemedView style={styles.headerroute}>
        <ThemedView style={styles.headdata}>
            <ThemedText style={styles.firstelement}>
                Start:
            </ThemedText>
            <ThemedText style={styles.secondel}>
                HSZ Dresden
            </ThemedText>
        </ThemedView>
        <ThemedView style={styles.headdata}>
            <ThemedText style={styles.firstelement}>
                Ziel:
            </ThemedText>
            <ThemedText style={styles.secondel}>
                APark digga
            </ThemedText>
        </ThemedView>
        <ThemedView style={styles.headdata}>
            <ThemedText style={styles.firstelement}>
                Durchschnittstemperatur:
            </ThemedText>
            <ThemedText style={styles.secondel}>
                105°C
            </ThemedText>
        </ThemedView>
      </ThemedView>
      <ThemedView
        style={styles.map}
      >
              <MapView
        style={{ width: "100%", height: 400
         }}
         provider={undefined}
      >
        <UrlTile 
          urlTemplate='https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=d08NvscUAMlB3kHbhReF'
          maximumZ={19}
        />
      </MapView>
      </ThemedView>
      <ThemedView style={styles.btn}>
        <Button

          style={{ marginTop: 20 }}
          title={"Nach Route suchen"}
          containerStyle={{
            borderRadius: 1
          }}
        />
      </ThemedView>

    </ThemedView>
  );
}

const styles = StyleSheet.create({
    secondel: {
        paddingLeft: 10
    },
    firstelement: {
        width: "auto"
    },
  btn: {
    marginTop: 15,
    height: 90,
    fontSize: 100
  },
  headdata: {
    paddingTop: 4,
    flex: 1,
    display: "flex",
    flexDirection: "row",
    maxWidth: "100%",
    borderStyle: "solid",
    borderWidth: 1
  },
  headerroute: {
    backgroundColor:"black",
    height: 120,
    display: "flex",
    flexDirection: "column"
  },
  titleContainer: {
    marginTop: 20,
    padding: 10
  },
  stepContainer: {
    gap: 1,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  searchBar: {

  },
  map: {
    minHeight: 400,
    backgroundColor: "black",
    flex: 1,

  },
});
