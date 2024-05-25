import { Image, StyleSheet, Platform } from 'react-native';
import { Button, SearchBar, Card } from '@rneui/themed';

import { ThemedText } from '../../components/ThemedText';
import { ThemedView } from '../../components/ThemedView';
import { ScreenHeight, Text } from '@rneui/base';
import { Link } from 'react-router-native';
import MapView from 'react-native-maps';
import { View } from 'react-native';

export default function index() {
  return (
    <ThemedView style={styles.main}>
    <ThemedView style={styles.titleContainer}>
      <ThemedView>
        <Image style={{
          resizeMode: 'contain',
          height: 100,
          width: 200,
          marginLeft: "auto",
          marginRight: "auto",

        }}
          source={require('../../media/logo.jpeg')} />

      </ThemedView>
      <ThemedView
        style={styles.map}
      >

    <View>
    {/*Render our MapView*/}
      <MapView
        style={styles.map}
        //specify our coordinates.
        initialRegion={{
          latitude: 37.78825,
          longitude: -122.4324,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}  
      />
    </View>
      </ThemedView>
      <ThemedView style={styles.btn}>
        <Link to="/route">
        <Button
          size="lg"
          style={{ marginTop: 20 }}
          title={"Nach Route suchen"}
          containerStyle={{
            borderRadius: 1
          }}
        />
        </Link>
      </ThemedView>

    </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  main:{
    height: "100%"
  },
  btn: {
    marginTop: 15,
    fontSize: 100
  },
  titleContainer: {
    marginTop: 20,
    padding: 10
  },
  searchBar: {

  },
  map: {
    minHeight: 590,
    flex: 1,
    marginTop: -10
  },
});
