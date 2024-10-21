import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedView } from "@/components/ThemedView";
import HeroSection from "@/components/(tabs)/index/HeroSection";
import HistoryList from "@/components/(tabs)/index/HistoryList";
import useHomeData from "@/hooks/useHomeData";

export default function HomeScreen() {
  const { userData, historyItems, totalAmount } = useHomeData();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ padding: 16, paddingBottom: 0, height: "100%" }}>
        <HeroSection userData={userData} totalAmount={totalAmount} />
        <HistoryList historyItems={historyItems} />
      </ThemedView>
    </SafeAreaView>
  );
}
