import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { getUserData, iUserData } from "@/services/user/getUserData";
import { RootStackParamList } from "../_layout";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import HeroSection from "@/components/(tabs)/index/HeroSection";
import HistoryList from "@/components/(tabs)/index/HistoryList";

type HomeScreenNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const [userData, setUserData] = useState<iUserData | null>(null);
  const navigation = useNavigation<HomeScreenNavigationProp>();

  const fetchUserData = async () => {
    try {
      const user = await getUserData();
      setUserData(user);
    } catch (error: any) {
      if (error.message === "No session ID found" || error.message === "Forbidden access") {
        Alert.alert("Session expired", "Redirecting to login...");
        navigation.navigate("login");
      } else {
        Alert.alert("Error", "Failed to fetch user data");
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, [navigation]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ padding: 16, height: "100%" }}>
        <HeroSection userData={userData} />
        <HistoryList />
      </ThemedView>
    </SafeAreaView>
  );
}
