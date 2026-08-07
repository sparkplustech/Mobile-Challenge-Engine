import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

/** Stub — implement per challenge 02 README */
export default function DetailsScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();
  return (
    <View style={styles.container} testID="details-screen">
      <Text style={styles.title}>Details: @{username ?? 'user'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 20, fontWeight: '700', color: '#f8fafc' },
});
