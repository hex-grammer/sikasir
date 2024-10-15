import { iPOSProfile } from "@/interfaces/posProfile/iPOSProfile";

export const getPOSProfileDetails = async (posProfileName: string): Promise<iPOSProfile> => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/frappe.client.get?doctype=POS%20Profile&name=${encodeURIComponent(posProfileName)}`
    ).then((res) => {
      if (!res.ok) {
        throw new Error("Network response was not ok");
      }
      return res.json();
    })
    return response.message;
  } catch (error) {
    console.log('error langsung');
    console.log(error);
    
    throw new Error("Error retrieving POS profile details.");
  }
};
