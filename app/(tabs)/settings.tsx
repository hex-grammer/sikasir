import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Alert } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomButton from '@/components/CustomButton';
import { useNavigation } from 'expo-router';
import { HomeScreenNavigationProp } from '../_layout';
import { logout } from '@/services/authService';

export default function Settings() {
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const handleLogout = async () => {
    await logout().then(() => navigation.navigate('login'));
  };

  const connectAndPrint = async () => {
    try {
      // connect to bluetooth printer

      Alert.alert('Success', 'Printed successfully!');
    } catch (error: any) {
      console.error('Error printing:', error);
      Alert.alert('Print Error', error.message);
    }
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <CustomButton title="Connect and Print" onPress={connectAndPrint} />
      <CustomButton title="Logout" onPress={handleLogout} />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});
