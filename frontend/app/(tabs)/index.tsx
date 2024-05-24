import { Image, StyleSheet, Platform } from 'react-native';
import { Button, SearchBar, Card } from '@rneui/themed';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ThemedCard from '@rneui/themed/dist/Card';




export default function HomeScreen() {
  return (
    <ThemedView style={styles.main}>
      <ThemedView style={styles.titleContainer}>


        <ThemedView style={styles.stepContainer}>
          <Image style={{
            resizeMode: 'contain',
            height: 100,
            width: 200,
          }}
          source={require('../../media/logo.jpeg')}/>
          <Button
            color= "grey"
            title={"Nach Route suchen"}
            containerStyle={{
              borderRadius: 1
            }}
          />
        </ThemedView>
        <ThemedView
          style={styles.map}
        >
          <ThemedText>HI</ThemedText>
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  main: {
    height: '100vh',
    width: '100vw',
  },
  titleContainer: {
    marginTop: 20,
    padding: 10 
  },
  stepContainer: {
    gap: 0,
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
    minHeight: 600,
    backgroundColor: "black",
    flex: 1,

  },
});
