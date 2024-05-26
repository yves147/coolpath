import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { SearchBar, Icon } from '@rneui/base';
import { Link } from 'react-router-native';

interface Item {
  id: string;
  title: string;
}

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
          searchIcon={<Icon name="menu" size={24} color="coral" />}
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
            searchIcon={<Icon name="menu" size={24} color="coral" />}
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
      <View style={styles.buttonContainer}>
        <Link to="/start"><Button title="Route finden" /></Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "90%",
    backgroundColor: '#add8e6',
    padding: 20,
    paddingTop: 100,
    justifyContent: 'space-between'
  },
  searchContainer: {
    flex: 2,
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
});

/*
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, Button, TouchableOpacity } from 'react-native';
import { SearchBar, Icon } from '@rneui/base';
import type {  PropsWithChildren } from 'react';
import type { ViewStyle } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Link } from 'react-router-native';

interface Item {
  id: string;
  title: string;
}

const DATA: Item[] = [
  { id: '1', title: 'Bahnhof' },
  { id: '2', title: 'Fischmarkt' },
  { id: '3', title: 'HTW Dresden' },
  { id: '4', title: 'TU Dresden' },
  { id: '5', title: 'Hochschulstrasse 46' },
];

export default function RouteUI () {
  const [searchStart, setSearchStart] = useState("");
  const [filteredDataStart, setFilteredDataStart] = useState<Item[]>(DATA);
  const [searchGoal, setSearchGoal] = useState("");
  const [filteredDataGoal, setFilteredDataGoal] = useState<Item[]>(DATA);
  const [isSearchStartFocused, setIsSearchStartFocused] = useState(false);
  const [isSearchGoalFocused, setIsSearchGoalFocused] = useState(false);
  const [selItemStart, setSelItemStart] = useState("");
  const [selItemGoal, setSelItemGoal] = useState("");
  const [focus, setFocus] = useState(true);

  const handleOnPressStart = (item: string) => {
    setSearchStart(item);
    setIsSearchStartFocused(false);
  }
  const handleOnPressGoal = (item: string) => {
    setSearchGoal(item);
    setIsSearchGoalFocused(false);
  }

  const handleBlurStart = () => {
    setFocus(true);
    setIsSearchStartFocused(false);
  }
  const handleBlurGoal = () => {
      setIsSearchGoalFocused(false);
  }
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
    setFocus(false);
  }

  return (
    <View style={styles.container}>
        <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Startpunkt"
            onChangeText={updateSearchStart}
            value={searchStart}
            onFocus={handleFocusStart}
            onBlur={handleBlurStart}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            leftIconContainerStyle={styles.iconContainer}
            rightIconContainerStyle={styles.iconContainer}
            searchIcon={<Icon name="menu" size={24} color="coral" />}
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
          {focus && (
          <View style={styles.searchContainer}>
          <SearchBar
            placeholder="Zielpunkt"
            onChangeText={updateSearchGoal}
            value={searchGoal}
            onFocus={() => setIsSearchGoalFocused(true)}
            onBlur={handleBlurGoal}
            containerStyle={styles.searchBarContainer}
            inputContainerStyle={styles.searchBarInputContainer}
            leftIconContainerStyle={styles.iconContainer}
            rightIconContainerStyle={styles.iconContainer}
            searchIcon={<Icon name="menu" size={24} color="coral" />}
          />
          {isSearchGoalFocused && (
            <FlatList
              data={filteredDataGoal}
              keyExtractor={item => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleOnPressGoal(item.title)}>
                  <Text style={styles.item}>{item.title}</Text>
                </TouchableOpacity>)}
              style={styles.list}
            />
          )}
        </View>
      )}
      <View style={styles.buttonContainer}>
        <Link to="/start"><Button title="Route finden"/></Link>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "90%",
    backgroundColor: '#add8e6',
    padding: 20,
    paddingTop: 100,
    justifyContent: 'space-between'
  },
  contentContainer: {
    flexGrow: 1,
  },
  searchContainer: {
    flex: 2,
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
});

*/