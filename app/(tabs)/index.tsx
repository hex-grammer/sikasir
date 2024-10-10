import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { Alert } from "react-native";
import { getUserData, iUserData } from "@/services/user/getUserData";
import { RootStackParamList } from "../_layout";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HeroSection from "@/components/(tabs)/index/HeroSection";
import HistoryList from "@/components/(tabs)/index/HistoryList";
import { useFocusEffect } from "expo-router";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [userData, setUserData] = useState<iUserData | null>(null);

  const fetchUserData = async () => {
    try {
      const user = await getUserData();
      console.log("User Data:", user);
      setUserData(user);
    } catch (error: any) {
      navigation.navigate("login");
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
    }, [])
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ padding: 16, height: "100%" }}>
        <HeroSection userData={userData} />
        <HistoryList />
      </ThemedView>
    </SafeAreaView>
  );
}
