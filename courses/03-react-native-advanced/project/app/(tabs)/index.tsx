import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container} testID="home-screen">
      <Text style={styles.title}>Advanced React Native</Text>
      <Text style={styles.subtitle}>Open Challenges tab to pick a challenge README.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24, backgroundColor: '#0f172a' },
  title: { fontSize: 22, fontWeight: '700', marginBottom: 8, color: '#f8fafc' },
  subtitle: { fontSize: 15, color: '#94a3b8', textAlign: 'center' },
});
