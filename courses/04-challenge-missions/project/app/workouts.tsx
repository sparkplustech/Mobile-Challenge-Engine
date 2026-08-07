import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 13 README */
export default function WorkoutsScreen() {
  return <View style={styles.container} testID="workouts-screen"><Text style={styles.text}>Workouts</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
