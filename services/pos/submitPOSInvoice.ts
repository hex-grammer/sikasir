const API_URL = `${process.env.EXPO_PUBLIC_API_URL}/api/resource/POS%20Invoice`;

const submitPOSInvoice = async (invoiceName: string) => {
  try {
    const response = await fetch(`${API_URL}/${invoiceName}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({docstatus:1}),
    });

    const res = await response.json();
    if (response.ok) {
      // console.log('POS Invoice updated successfully:', res.data);
      return res.data;
    } else {
      let errorMessage = "Failed to submit POS Invoice.";

      // Try to parse server messages if available
      try {
        const serverMessages = JSON.parse(res._server_messages);
        const parsedMessage = serverMessages.map((msg: string) => {
          const messageObj = JSON.parse(msg);
          return messageObj.message;
        }).join(" | ");

        errorMessage = parsedMessage || errorMessage;
      } catch (parseError) {
        console.error("Error parsing server messages:", parseError);
      }

      console.error('Failed to submit POS Invoice:', res);
      throw new Error(errorMessage);
    }
  } catch (error: any) {
    console.error('Error sibmiting POS Invoice:', error);
    throw new Error(error.message || "An unexpected error occurred while sibmiting the POS Invoice.");
  }
};
  
export default submitPOSInvoice;