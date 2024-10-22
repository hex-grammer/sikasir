import React, { useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import CustomButton from "@/components/CustomButton";
import { iUserData } from "@/services/user/getUserData";
import { HomeScreenNavigationProp } from "@/app/_layout";
import { router, useNavigation } from "expo-router";
import { getOpeningEntry } from "@/services/pos/getOpeningEntry";
import { getPOSProfiles } from "@/services/pos/getPOSProfiles";
import { getPOSProfileDetails } from "@/services/pos/getPOSProfileDetails";
import { createOpeningVoucher } from "@/services/pos/createOpeningVoucher";
import closePOS from "@/services/pos/closePOS"; // Import the closePOS function
import useHomeData from "@/hooks/useHomeData";

interface HeroSectionProps {
  userData: iUserData | null;
  totalAmount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userData, totalAmount }) => {
  const { refreshHistoryData, historyItems } = useHomeData();
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(false); 

  const handleOpenPOS = async () => {
    setLoading(true);

    try {
      if (!userData?.email) {
        throw new Error("User data not available");
      }

      const openingEntry = await getOpeningEntry(userData.email);
      if (openingEntry.length) {
        return navigation.navigate("point-of-sale");
      }
      
      const profileResult = await getPOSProfiles("Makassar Mega Putra Prima");
      if (!profileResult.message?.length) {
        throw new Error("No POS Profiles found for the company.");
      }

      const posProfileName = profileResult.message[0].value;
      const profileDetail = await getPOSProfileDetails(posProfileName);
      if (!profileDetail) {
        throw new Error("Failed to retrieve POS Profile details.");
      }

      const voucherResult = await createOpeningVoucher(profileDetail);
      if (!voucherResult?.message) {
        throw new Error("Failed to create opening voucher.");
      }

      Alert.alert("Success", "Opening voucher created successfully!");
      navigation.navigate("point-of-sale");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process the request.";
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleRekapPOS = async () => {
    try {
      const openingEntry = await getOpeningEntry(userData?.email); // Fetch the opening entry
      if (!openingEntry.length) {
        Alert.alert("Error", "No opening entry found.");
        return;
      }

      const confirmation = await new Promise<boolean>((resolve) => {
        Alert.alert(
          "Konfirmasi",
          `Anda yakin ingin menutup POS ${openingEntry[0].name}?`,
          [
            { text: "Batal", onPress: () => resolve(false), style: "cancel" },
            { text: "Ya", onPress: () => resolve(true) },
          ]
        );
      });

      if (confirmation) {
        await closePOS(openingEntry[0].name, historyItems);
        Alert.alert("Success", "POS closed successfully!");
        
        // Refresh history items and total amount
        await refreshHistoryData();
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process the request.";
      Alert.alert("Error", errorMessage);
    }
  };

  return (
    <ThemedView style={styles.heroContainer}>
      {userData ? (
        <>
          <ThemedText type="title">{userData.full_name},</ThemedText>
          <ThemedText type="subtitle">Cluster {userData.cluster}</ThemedText>
          <ThemedText style={styles.heroLargeNumber} type="title">
            Rp {totalAmount?.toLocaleString() || 0}
          </ThemedText>
        </>
      ) : (
        <ThemedText>Loading user data...</ThemedText>
      )}
      <ThemedView style={styles.heroButtons}>
        <CustomButton title="Buka POS" onPress={handleOpenPOS} isLoading={loading} />
        <CustomButton title="Rekap POS" type="outline" onPress={handleRekapPOS} />
      </ThemedView>
    </ThemedView>
  );
};

export default HeroSection;

const styles = StyleSheet.create({
  heroContainer: {
    display: "flex",
    justifyContent: "flex-end",
    height: "35%",
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
