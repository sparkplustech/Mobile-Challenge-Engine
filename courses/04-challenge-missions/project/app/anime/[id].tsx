import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Stub — implement per challenge 14 README */
export default function AnimeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View style={styles.container} testID="anime-detail"><Text style={styles.text}>Anime {id}</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
