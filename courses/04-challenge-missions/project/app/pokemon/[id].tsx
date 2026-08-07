import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Stub — implement per challenge 02 README */
export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View style={styles.container} testID="pokemon-detail"><Text style={styles.text}>Pokemon {id}</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
