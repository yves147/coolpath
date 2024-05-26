import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Button, CheckBox, SearchBar, Slider, Icon} from '@rneui/themed';
import { Link } from 'react-router-native';
import { WebView } from 'react-native-webview';
import { HTMLContent } from '../../components/Webmap.js';
import axios from 'axios'

interface Item {
  id: string;
  title: string;
}

const MapPageContent = () => {
  const webviewRef = useRef(null);

  const addMarker = () => {
  
      let points = [[13.732952417266883, 51.03403674195253], [13.751770840358994, 51.06299305729817]]
      console.log(points)
      const message = JSON.stringify({
        type: 'point',
        pnts: points
      })

      if (webviewRef.current) {
        webviewRef.current.postMessage(message);
      }
  };
  
 
  return (
    <View style={styles.mapcontainer}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        style={styles.webview}
        source={{ html: HTMLContent }}
      />
      <View style={styles.btncontainer}>
        <Button title="Route suchen" onPress={addMarker} style={{marginTop: 10 }} titleStyle={{fontSize: 30}} containerStyle={{borderRadius: 10,}} />
      </View>
    </View>
  );
};

const DATA: Item[] = [
  { id: '1', title: 'Bahnhof' },
  { id: '2', title: 'Fischmarkt' },
  { id: '3', title: 'HTW Dresden' },
  { id: '4', title: 'TU Dresden' },
  { id: '5', title: 'Hochschulstrasse 46' },
];

export default function RouteUI() {
  const [searchStart, setSearchStart] = useState("");
  const [filteredDataStart, setFilteredDataStart] = useState<Item[]>(DATA);
  const [searchGoal, setSearchGoal] = useState("");
  const [filteredDataGoal, setFilteredDataGoal] = useState<Item[]>(DATA);
  const [isSearchStartFocused, setIsSearchStartFocused] = useState(false);
  const [isSearchGoalFocused, setIsSearchGoalFocused] = useState(false);
  const searchicon ='\u2315';

  const handleOnPressStart = (item: string) => {
    setSearchStart(item);
    setIsSearchStartFocused(false);
  };

  const handleOnPressGoal = (item: string) => {
    setSearchGoal(item);
    setIsSearchGoalFocused(false);
  };

  const updateSearchStart = (search: string) => {
    setSearchStart(search);
    const newData = DATA.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    setFilteredDataStart(newData);
  };

  const updateSearchGoal = (search: string) => {
    setSearchGoal(search);
    const newData = DATA.filter(item => item.title.toLowerCase().includes(search.toLowerCase()));
    setFilteredDataGoal(newData);
  };

  const handleFocusStart = () => {
    setIsSearchStartFocused(true);
    setIsSearchGoalFocused(false);
  };

  const handleFocusGoal = () => {
    setIsSearchGoalFocused(true);
    setIsSearchStartFocused(false);
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
      <View style={styles.searchContainer}>
        <SearchBar
          placeholder="Startpunkt"
          onChangeText={updateSearchStart}
          value={searchStart}
          onFocus={handleFocusStart}
          onBlur={() => setIsSearchStartFocused(false)}
          containerStyle={styles.searchBarContainer}
          inputContainerStyle={styles.searchBarInputContainer}
          leftIconContainerStyle={styles.iconContainer}
            rightIconContainerStyle={styles.iconContainer}
            searchIcon={<Text style={styles.icon}> {searchicon}</Text>}

        />
        {isSearchStartFocused && (
          <FlatList
            data={filteredDataStart}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleOnPressStart(item.title)}>
                <Text style={styles.item}>{item.title}</Text>
              </TouchableOpacity>
            )}
            style={styles.list}
          />
        )}
      </View>
      {!isSearchStartFocused && (
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Zielpunkt"
            onChangeText={updateSearchGoal}
            value={searchGoal}
            onFocus={handleFocusGoal}
            onBlur={() => setIsSearchGoalFocused(false)}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            leftIconContainerStyle={styles.iconContainer}
            rightIconContainerStyle={styles.iconContainer}
            searchIcon={<Text style={styles.icon}> {searchicon} </Text>}
          />
          {isSearchGoalFocused && (
            <FlatList
              data={filteredDataGoal}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleOnPressGoal(item.title)}>
                  <Text style={styles.item}>{item.title}</Text>
                </TouchableOpacity>
              )}
              style={styles.list}
            />
          )}
        </View>
      )}
      <View style={styles.searchContainer}>
      
      <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={100}
          step={1}
          thumbStyle={{ height: 25, width: 15, backgroundColor: 'grey' }}
        />
       <View style={styles.textcontainer}>
        <Text style={{flex:1, maxWidth: 600, fontSize: 20, fontWeight: 'bold'}}>
          schnellste Route
        </Text>
        <Text style={{flex:1, maxWidth: '34%', fontSize: 20, textAlign: 'left', fontWeight: 'bold'}}>
          kühlste Route
        </Text>
        </View>
        
      </View>
      <CheckBox
      center
      title="Click Here"
      checked
    />
   
    </View>
    <View style={styles.map}>
    <MapPageContent />
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  check: {},
  textcontainer: {
    display: 'flex',
    flexDirection: 'row',

  },
  icon: {
    padding: -10,
    borderBottomColor: '#ccc',
    fontSize: 30,
  },
  mapcontainer: {
    height: '80%',
    width: '90%',
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 15
  },
  main: {
    height: 900,
    //backgroundColor: '#add8e6',
  },
  container: {
    height: "20%",
    //backgroundColor: '#add8e6',
    marginTop: 10,
    justifyContent: 'space-between',
    display: 'flex',
  },
  searchContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  searchBarContainer: {
    backgroundColor: 'transparent',
    borderTopWidth: 0,
    borderBottomWidth: 0,
  },
  searchBarInputContainer: {
    backgroundColor: '#e1e1e1',
    borderRadius: 5,
  },
  list: {
    maxHeight: 200,
  },
  item: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  iconContainer: {
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
    flex: 1,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  btncontainer: {
    marginTop: 10
  },
  btn: {
    marginTop: 15,
    fontSize: 100,
  },
  titleContainer: {
    marginTop: -10,
    padding: 10,
  },
  webview: {
    flex: 1,
  },
  map: {
    height: '80%',
    flex: 1,
  }
});