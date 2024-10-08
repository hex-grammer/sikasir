import { Alert } from "react-native";

const API_URL = "http://157.245.58.91:8080/api/method";

const checkOpeningEntry = async (email: string) => {
  const response = await fetch(`${API_URL}/erpnext.selling.page.point_of_sale.point_of_sale.check_opening_entry`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: email }),
  });
  return response.json();
};

const getPOSProfiles = async (company: string) => {
  const response = await fetch(`${API_URL}/frappe.desk.search.search_link`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      txt: "",
      doctype: "POS Profile",
      reference_doctype: "",
      page_length: 10,
      query: "erpnext.accounts.doctype.pos_profile.pos_profile.pos_profile_query",
      filters: { company },
    }),
  });
  return response.json();
};

const getPOSProfileDetails = async (posProfileName: string) => {
  const response = await fetch(`${API_URL}/frappe.client.get?doctype=POS%20Profile&name=${encodeURIComponent(posProfileName)}`);
  return response.json();
};

const createOpeningVoucher = async (posProfile: any) => {
  const response = await fetch(`${API_URL}/erpnext.selling.page.point_of_sale.point_of_sale.create_opening_voucher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pos_profile: posProfile.name,
      company: posProfile.company,
      balance_details: JSON.stringify([
        {
          mode_of_payment: posProfile.payments[0].mode_of_payment,
          opening_amount: "0",
          idx: 1,
          name: "row 1",
        },
      ]),
    }),
  });
  return response.json();
};

export const openPOS = async (userData: any, navigation: any) => {
  try {
    if (!userData) {
      Alert.alert("Error", "User data not available");
      return;
    }

    const result = await checkOpeningEntry(userData.email);

    if (result.message && result.message.length === 0) {
      const profileResult = await getPOSProfiles("Makassar Mega Putra Prima");

      if (profileResult.message && profileResult.message.length > 0) {
        const posProfileName = profileResult.message[0].value;
        const profileDetail = await getPOSProfileDetails(posProfileName);

        if (profileDetail && profileDetail.message) {
          const voucherResult = await createOpeningVoucher(profileDetail.message);

          if (voucherResult && voucherResult.message) {
            Alert.alert("Success", "Opening voucher created successfully!");
            navigation.navigate("point-of-sale");
          } else {
            Alert.alert("Error", "Failed to create opening voucher.");
          }
        } else {
          Alert.alert("Error", "Failed to retrieve POS Profile details.");
        }
      } else {
        Alert.alert("Error", "No POS Profiles found for the company.");
      }
    } else {
      navigation.navigate("point-of-sale");
    }
  } catch (error) {
    Alert.alert("Error", "Failed to process the request. Please try again.");
    console.error("Error:", error);
  }
};
