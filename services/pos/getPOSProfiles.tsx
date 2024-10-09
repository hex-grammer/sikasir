export const getPOSProfiles = async (company: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/frappe.desk.search.search_link`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txt: "",
          doctype: "POS Profile",
          reference_doctype: "",
          page_length: 10,
          query: "erpnext.accounts.doctype.pos_profile.pos_profile.pos_profile_query",
          filters: { company },
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch POS profiles.");
    }

    return response.json();
  } catch (error) {
    throw new Error("Error fetching POS profiles.");
  }
};
