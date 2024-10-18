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
}

const HeroSection: React.FC<HeroSectionProps> = ({ userData }) => {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [loading, setLoading] = useState(false);

  const handleOpenPOS = async () => {
    setLoading(true);

    try {
      // await openPOS(userData, navigation);
      if (!userData?.email) {
        throw new Error("User data not available");
      }
  
      // Step 1: Check if there's an opening entry
      const openingEntry = await getOpeningEntry(userData.email);
      if (!openingEntry.message || openingEntry.message.length !== 0) {
        navigation.navigate("point-of-sale");
        return;
      }
  
      // Step 2: Fetch POS profiles for the company
      const profileResult = await getPOSProfiles("Makassar Mega Putra Prima");
      if (!profileResult.message?.length) {
        throw new Error("No POS Profiles found for the company.");
      }
  
      // Step 3: Fetch POS profile details
      const posProfileName = profileResult.message[0].value;
      const profileDetail = await getPOSProfileDetails(posProfileName);
      if (!profileDetail) {
        throw new Error("Failed to retrieve POS Profile details.");
      }
  
      // Step 4: Create the opening voucher
      const voucherResult = await createOpeningVoucher(profileDetail);
      if (!voucherResult?.message) {
        throw new Error("Failed to create opening voucher.");
      }
  
      // Step 5: If everything succeeds
      Alert.alert("Success", "Opening voucher created successfully!");
      // navigation.navigate("point-of-sale");
      console.log("Opening voucher created successfully!");
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
        {/* <CustomButton title="Rekap POS" type="outline" onPress={() => router.push('/invoice/ACC-PSINV-2024-00026')} /> */}
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
