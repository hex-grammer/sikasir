import React, { useEffect, useState } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../services/authService'; // Import the getUserData and logout functions
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../_layout'; // Import your navigation type
import { UserData, getUserData } from '@/services/user/getUserData';

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, '(tabs)'>;

export default function HomeScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = await getUserData();
        setUserData(user);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch user data');
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigation.navigate('login');
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {userData ? (
        <>
          <Text>Welcome, {userData.full_name}!</Text>
          <Button title="Logout" onPress={handleLogout} />
        </>
      ) : (
        <Text>Loading user data...</Text>
      )}
    </View>
  );
}