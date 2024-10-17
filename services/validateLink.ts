export const validateLink = async (doctype: string, docname: string): Promise<boolean> => {
    try {
      const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/method/frappe.client.validate_link`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ doctype, docname, fields: [] }),
      });
  
      if (!response.ok) {
        console.error('Failed to validate link:', response.statusText);
        return false;
      }
  
      const data = await response.json();
      console.log('Validation response:', data);
      const isValid = data.message.name && data.message.name === docname;
      return isValid;
    } catch (error) {
      console.error('Error validating link:', error);
      return false;
    }
  };
  