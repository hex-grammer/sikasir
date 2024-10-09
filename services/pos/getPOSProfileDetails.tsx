export const getPOSProfileDetails = async (posProfileName: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/frappe.client.get?doctype=POS%20Profile&name=${encodeURIComponent(posProfileName)}`
    );

    if (!response.ok) {
      throw new Error("Failed to retrieve POS profile details.");
    }

    return response.json();
  } catch (error) {
    throw new Error("Error retrieving POS profile details.");
  }
};
