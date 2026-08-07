import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 03 README */
export default function SearchScreen() {
  return (
    <View style={styles.container} testID="search-screen">
      <Text style={styles.text}>Search — implement in challenge 03</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
