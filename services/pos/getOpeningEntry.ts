export const getOpeningEntry = async (email?: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/erpnext.selling.page.point_of_sale.point_of_sale.check_opening_entry`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: email }),
      }
    );
    if (!response.ok) {
      throw new Error("Failed to check opening entry.");
    }
    return response.json();
  } catch (error) {
    throw new Error("Error checking opening entry");
  }
};
