import { useCallback, useState } from "react";
import { getUserData, iUserData } from "@/services/user/getUserData";
import { getPOSInvoiceList, iPOSInvoice } from "@/services/pos/getPOSInvoiceList";
import { getPOSProfiles } from "@/services/pos/getPOSProfiles";
import { useFocusEffect } from "expo-router";

const useHomeData = () => {
  const [userData, setUserData] = useState<iUserData | null>(null);
  const [historyItems, setHistoryItems] = useState<iPOSInvoice[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchUserData = async () => {
    try {
      const user = await getUserData();
      setUserData(user);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  const fetchHistoryItems = async () => {
    try {
      const profileResult = await getPOSProfiles("Makassar Mega Putra Prima");
      if (profileResult) {
        const invoices = await getPOSInvoiceList(profileResult.message[0].value, 'Paid');
        setHistoryItems(invoices);
        const total = invoices.reduce((sum, item) => sum + Number(item.grand_total), 0);
        setTotalAmount(total);
      }
    } catch (error) {
      console.error("Failed to fetch history items:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      fetchHistoryItems();
    }, [])
  );

  return { userData, historyItems, totalAmount };
};

export default useHomeData;
