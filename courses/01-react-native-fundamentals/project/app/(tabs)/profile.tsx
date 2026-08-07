import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 07 README */
export default function ProfileScreen() {
  return (
    <View style={styles.container} testID="profile-screen">
      <Text style={styles.text}>Profile — implement in challenge 07</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
