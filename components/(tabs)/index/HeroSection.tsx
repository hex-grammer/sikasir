import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import { UserData } from "@/services/user/getUserData";
import { openPOS } from "@/services/pos/openPOS";
import { HomeScreenNavigationProp } from "@/app/_layout";
import { useNavigation } from "expo-router";

interface HeroSectionProps {
  userData: UserData | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userData }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleOpenPOS = async () => {
    setLoading(true);

    try {
      await openPOS(userData, navigation);
    } catch (error) {
      Alert.alert("Error", "Failed to process the request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.heroContainer}>
      {userData ? (
        <>
          <ThemedText type="title">{userData.full_name},</ThemedText>
          <ThemedText type="subtitle">Cluster {userData.cluster}</ThemedText>
          <ThemedText style={styles.heroLargeNumber} type="title">
            Rp 230.000
          </ThemedText>
        </>
      ) : (
        <ThemedText>Loading user data...</ThemedText>
      )}
      <ThemedView style={styles.heroButtons}>
        <CustomButton title="Buka POS" onPress={handleOpenPOS} isLoading={loading} />
        <CustomButton title="Rekap POS" type="outline" onPress={() => {}} />
      </ThemedView>
    </ThemedView>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  heroContainer: {
    display: "flex",
    justifyContent: "flex-end",
    height: "45%",
    width: "100%",
    marginBottom: 12,
  },
  heroLargeNumber: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
    color: "#353636",
    marginTop: 12,
    marginBottom: 12,
  },
  heroButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
