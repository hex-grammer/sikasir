export const searchCustomer = async (searchText: string) => {
    try {
      const response = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/method/frappe.desk.search.search_link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            txt: searchText,  
            doctype: "Customer",
            reference_doctype: "",
            page_length: 10,
            filters: {},     
          }),
        }
      );
  
      const result = await response.json();
  
      if (!result.message && !(result.message.length > 0)) {
        return [];
      }  
  
      return result.message;
    } catch (error) {
      console.error("Error fetching customers:", error);
      throw error; // Propagate the error to the caller
    }
  };
  