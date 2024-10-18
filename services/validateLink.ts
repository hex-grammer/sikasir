import { handleServiceError } from './errorHandler';

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
      throw response;
    }

    const data = await response.json();
    console.log('Validation response:', data);
    const isValid = data.message.name && data.message.name === docname;
    return isValid;
  } catch (error) {
    handleServiceError(error, {
      'Failed to validate link': 'Unable to validate the link. Please try again.',
    });
    return false;
  }
};
