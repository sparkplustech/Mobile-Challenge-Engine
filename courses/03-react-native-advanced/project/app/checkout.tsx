import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 05 README */
export default function CheckoutScreen() {
  return (
    <View style={styles.container} testID="checkout-screen">
      <Text style={styles.text}>Checkout — implement in challenge 05</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#0f172a' },
  text: { color: '#94a3b8' },
});
