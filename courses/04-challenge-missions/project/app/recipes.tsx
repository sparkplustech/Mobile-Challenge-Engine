import { View, Text, StyleSheet } from 'react-native';

/** Stub — implement per challenge 09 README */
export default function RecipesScreen() {
  return <View style={styles.container} testID="recipes-screen"><Text style={styles.text}>Recipes</Text></View>;
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', alignItems: 'center' }, text: { color: '#94a3b8' } });
