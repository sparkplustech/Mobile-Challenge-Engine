import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Stub — implement per challenge 08 README */
export default function MovieDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <View style={styles.container} testID="movie-detail"><Text style={styles.text}>Movie {id}</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
