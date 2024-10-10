import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet } from 'react-native';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CustomButton from '@/components/CustomButton';
import axios from 'axios';
import { useNavigation } from 'expo-router';
import { HomeScreenNavigationProp } from '../_layout';

export default function TabTwoScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const handleLogout = async() => {
    // await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/method/logout`)
    await axios.get(`http://157.245.58.91:8080/api/method/logout`)
      .then(_ => {
        navigation.navigate('login');
      })
      .catch((error) => {
        alert(error);
      });
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Settings</ThemedText>
      </ThemedView>
      <ThemedText>This app includes example code to help you get started.</ThemedText>
      {/* logout button */}
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
