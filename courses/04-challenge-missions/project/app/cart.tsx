import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 10 README */
export default function CartScreen() {
  return <View style={styles.container} testID="cart-screen"><Text style={styles.text}>Cart</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
