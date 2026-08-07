import { View, Text, StyleSheet } from 'react-native';

export default function MissionsHomeScreen() {
  return (
    <View style={styles.container} testID="missions-home">
      <Text style={styles.title}>Challenge Missions</Text>
      <Text style={styles.subtitle}>Open Challenges tab to pick a mission README.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#38bdf8' },
  subtitle: { fontSize: 15, color: '#94a3b8', textAlign: 'center' },
});
