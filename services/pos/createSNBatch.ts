// services/pos/createSNBatch.ts
import { iPOSInvoice } from "@/interfaces/posInvoice/iPOSInvoice";
import { Alert } from "react-native";
import { iPOSInvoiceItem } from "./createPOSInvoice";

interface iSNBatchEntry {
  serial_no: string;
  warehouse: string | undefined;
  idx: number;
  qty: number;
}

interface iSNBatchPayload {
  item_code: string;
  warehouse: string | undefined;
  type_of_transaction: string;
  total_qty: number;
  voucher_type: string;
  voucher_no: string | undefined;
  entries: iSNBatchEntry[];
}

export async function createSNBatch(
  serialNumbers: { value: string }[],
  selectedItem: { item_code: string },
  posInvoice: {name:string, items:iPOSInvoiceItem[]} | null
) {
  try {
    if (!posInvoice) throw new Error("POS Invoice is missing!");

    const entries: iSNBatchEntry[] = serialNumbers.map((sn, i) => ({
      serial_no: sn.value,
      warehouse: posInvoice.items[0].warehouse,
      idx: i + 1,
      qty: -1,
    }));

    const payload: iSNBatchPayload = {
      item_code: selectedItem.item_code,
      warehouse: posInvoice.items[0].warehouse,
      type_of_transaction: "Outward",
      total_qty: -entries.length,
      voucher_type: "POS Invoice",
      voucher_no: posInvoice.name,
      entries,
    };

    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/resource/Serial%20and%20Batch%20Bundle`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const res = await response.json();
    if (!response.ok) {
      let errorMessage = "Failed to save Serial and Batch Bundle.";
      try {
        const serverMessages = JSON.parse(res._server_messages).map((msg: string) => JSON.parse(msg).message).join(" | ");
        errorMessage = serverMessages || errorMessage;
      } catch (parseError) {
        console.error("Error parsing server messages:", parseError);
      }
      throw new Error(errorMessage);
    }

    return res.data.name;
  } catch (error: any) {
    console.error("Error creating Serial and Batch Bundle:", error);
    Alert.alert("Error", error.message || "An unexpected error occurred.");
    return null;
  }
}

