import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 06 README */
export default function ChatScreen() {
  return <View style={styles.container} testID="chat-screen"><Text style={styles.text}>Chat</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
