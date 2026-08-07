import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 12 README */
export default function ShopScreen() {
  return <View style={styles.container} testID="shop-screen"><Text style={styles.text}>Shop</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
