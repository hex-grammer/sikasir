import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';

export default function HomeScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={styles.screenContainer}>
        <ThemedView style={styles.heroContainer}>
          <ThemedText style={styles.heroTitle}>Nama Sales,</ThemedText>
          <ThemedText style={styles.heroSubtitle}>Cluster Palangkaraya</ThemedText>
          <ThemedText style={styles.heroLargeNumber} type='title'>Rp 230.000</ThemedText>
          <ThemedView style={styles.heroButtons}>
            <Button title='Buka POS' onPress={() => {}}/>
            <Button title='Rekap POS' type='outline' onPress={() => {}}/>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    padding: 16,
    height: '100%',
    width: '100%',
  },
  heroContainer: {
    display: 'flex',
    justifyContent: 'flex-end',
    height: '30%',
    width: '100%',
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#353636',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 22,
    color: '#353636',
    // marginBottom: ,
  },
  heroLargeNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#353636',
    marginTop: 12,
    marginBottom: 12,
  },
  heroButtons:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  heroButton:{
    width: '48%',
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
