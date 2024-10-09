import { Alert } from "react-native";
import { checkOpeningEntry } from "./checkOpeningEntry";
import { getPOSProfiles } from "./getPOSProfiles";
import { getPOSProfileDetails } from "./getPOSProfileDetails";
import { createOpeningVoucher } from "./createOpeningVoucher";

export const openPOS = async (userData: any, navigation: any) => {
  try {
    if (!userData?.email) {
      throw new Error("User data not available");
    }

    // Step 1: Check if there's an opening entry
    const openingEntry = await checkOpeningEntry(userData.email);
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
    if (!profileDetail?.message) {
      throw new Error("Failed to retrieve POS Profile details.");
    }

    // Step 4: Create the opening voucher
    const voucherResult = await createOpeningVoucher(profileDetail.message);
    if (!voucherResult?.message) {
      throw new Error("Failed to create opening voucher.");
    }

    // Step 5: If everything succeeds
    Alert.alert("Success", "Opening voucher created successfully!");
    navigation.navigate("point-of-sale");
  } catch (error: any) {
    Alert.alert("Error", error.message || "Failed to process the request. Please try again.");
  }
};
