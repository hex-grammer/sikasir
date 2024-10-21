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

interface HeroSectionProps {
  userData: iUserData | null;
  totalAmount: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userData, totalAmount }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleOpenPOS = async () => {
    setLoading(true);

    try {
      if (!userData?.email) {
        throw new Error("User data not available");
      }

      const openingEntry = await getOpeningEntry(userData.email);
      if (openingEntry.message && openingEntry.message.length === 0) {
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
        console.log("Opening voucher created successfully!");
      } else {
        navigation.navigate("point-of-sale");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to process the request.";
      Alert.alert("Error", errorMessage);
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
            Rp {totalAmount.toLocaleString()}
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
