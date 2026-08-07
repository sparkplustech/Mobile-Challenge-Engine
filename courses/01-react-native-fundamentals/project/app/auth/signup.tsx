import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 04 README */
export default function SignupScreen() {
  return (
    <View style={styles.container} testID="signup-screen">
      <Text style={styles.text}>Sign up — implement in challenge 04</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
