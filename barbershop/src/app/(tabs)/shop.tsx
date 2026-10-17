
import { View, Text, StyleSheet } from 'react-native';

export default function ShopScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Shop Produk</Text>
      <Text style={styles.description}>
        Temukan produk perawatan rambut pilihan.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F4EF',
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#242321',
  },
  description: {
    marginTop: 10,
    fontSize: 14,
    color: '#77736E',
  },
});
