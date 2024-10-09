import { Alert } from "react-native";

export const getPOSItems = async (posProfile: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/erpnext.selling.page.point_of_sale.point_of_sale.get_items`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: 0,
          page_length: 40,
          price_list: "Harga Jual RS Palangkaraya",
          search_term: "",
          pos_profile: posProfile,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch POS items.");
    }

    const data = await response.json();
    const result = data.message;
    // console.log("POS Items:", result);
    
    if (!result.items?.length) {
      throw new Error("No items found");
    }

    return result.items;
  } catch (error: any) {
    Alert.alert("Error", error.message || "Failed to fetch POS items. Please try again.");
    throw error;
  }
};
