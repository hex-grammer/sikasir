// app/(tabs)/index.tsx
import { StyleSheet } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SafeAreaView } from 'react-native-safe-area-context';
import Button from '@/components/Button';

import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { logout } from '../../services/authService';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../_layout';
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
            } catch (error:any) {
                if (error.message === 'No session ID found' || error.message === 'Forbidden access') {
                    Alert.alert('Session expired', 'Redirecting to login...');
                    navigation.navigate('login'); // Redirect to the login screen
                } else {
                    Alert.alert('Error', 'Failed to fetch user data');
                }
            }
        };

        fetchUserData();
    }, [navigation]);

    const handleLogout = async () => {
        await logout();
        navigation.navigate('login'); // Navigate back to the login screen
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={styles.screenContainer}>
                <ThemedView style={styles.heroContainer}>
                    {userData ? (
                        <>
                            <ThemedText style={styles.heroTitle}>{userData.full_name},</ThemedText>
                            <ThemedText style={styles.heroSubtitle}>Cluster {userData.cluster}</ThemedText>
                            <ThemedText style={styles.heroLargeNumber} type='title'>Rp 230.000</ThemedText>
                        </>
                    ) : (
                        <ThemedText>Loading user data...</ThemedText>
                    )}
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
