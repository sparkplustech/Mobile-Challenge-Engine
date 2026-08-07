import { View } from 'react-native';

type SearchBarProps = {
  onSearch?: (query: string) => void;
  placeholder?: string;
};

/** Stub — implement per challenge 03 README */
export default function SearchBar(_props: SearchBarProps) {
  return <View testID="search-bar" />;
}
