import { Image, StyleSheet, Platform } from 'react-native';
import { Button, SearchBar, Card } from '@rneui/themed';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';



export default function HomeScreen() {
  return (
  
      <ThemedView style={styles.titleContainer}>
        
        
      <ThemedView style={styles.stepContainer}>

      <ThemedText type="title">Cool Path</ThemedText>
        <SearchBar 
          style={styles.searchBar}
          placeholder="Startpunkt1234"
        /*onChangeText={setSearchQuery}
        value={searchQuery}*/
        />
        <SearchBar placeholder="Zielpunkt" />
        <Button
          title={"Hallo, wie gehts?"}
          containerStyle={{
            borderRadius: 3
          }}
        />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    marginTop: 50,
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
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
});
