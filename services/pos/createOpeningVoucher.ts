export const createOpeningVoucher = async (posProfile: any) => {
  if (!posProfile?.payments?.length) {
    throw new Error("No payment details available in POS profile.");
  }

  try {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/method/erpnext.selling.page.point_of_sale.point_of_sale.create_opening_voucher`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      }
    );

    if (!response.ok) {
      throw new Error("Failed to create opening voucher.");
    }

    return response.json();
  } catch (error) {
    throw new Error("Error creating opening voucher.");
  }
};
