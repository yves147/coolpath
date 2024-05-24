import React, { useState } from 'react';
import SearchBar from '@/components/SearchBar';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface Item {
  id: string;
  title: string;
}

const DATA: Item[] = [
  { id: '1', title: 'Bahnhof' },
  { id: '2', title: 'Fischmarkt' },
  { id: '3', title: 'HTW Dresden' },
  { id: '4', title: 'TU Dresden' },
  { id: '5', title: 'Hochschulstraße 46' },
];



type SearchBarComponentProps = {};

const SwitchComponent: React.FC = () => {
const [search, setSearch] = useState("");
const[filteredData, setFilteredData] = useState<Item[]>(DATA);

const updateSearch = (search: string) => {
  setSearch(search);
};

const handleSearch = (term: string) => {
  setSearch(term);
  if (term) {
    const newData = DATA.filter(item => item.title.toLowerCase().includes(term.toLowerCase()));
    setFilteredData(newData);
  } else {
    setFilteredData(DATA);
  }
};

return (
  <View style={styles.view}>
    <SearchBar
      search={search}
      setSearch={handleSearch}
      placeholder="Startpunkt"
    />
    <FlatList
    data={filteredData}
    keyExtractor={item => item.id}
    renderItem={({ item }) => <Text style={styles.view}>{item.title}</Text>}
    />
  </View>
  );
};

const styles = StyleSheet.create({
view: {
  margin: 10,
},
});

export default SwitchComponent;