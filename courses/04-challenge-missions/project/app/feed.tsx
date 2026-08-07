import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 11 README */
export default function FeedScreen() {
  return <View style={styles.container} testID="feed-screen"><Text style={styles.text}>Feed</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
