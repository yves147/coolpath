import { SearchBar as RNESearchBar } from '@rneui/base'


interface SearchBarProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm,}) => {
  return (
    <RNESearchBar
      placeholder="Startpunkt"
      onChangeText={setSearchTerm}
      value={searchTerm}
      containerStyle={{ backgroundColor: 'transparent', borderBottomColor: 'transparent', borderTopColor: 'transparent' }}
      inputContainerStyle={{ backgroundColor: '#e6e6e6' }}
    />
  );
};

export default SearchBar;
