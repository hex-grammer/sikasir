import { FlatList, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";

interface HistoryItem {
  nomor_invoice: string;
  nama_customer: string;
  amount: string;
}

const HISTORY_ITEMS: HistoryItem[] | null = [
  {
    nomor_invoice: "411007-2024-09-25-007",
    nama_customer: "Rizal Iswandy",
    amount: "Rp 130.000",
  },
  {
    nomor_invoice: "411007-2024-09-25-006",
    nama_customer: "Rudy",
    amount: "Rp 56.000",
  },
  {
    nomor_invoice: "411007-2024-09-25-005",
    nama_customer: "Samson",
    amount: "Rp 23.000",
  },
  {
    nomor_invoice: "411007-2024-09-25-004",
    nama_customer: "Rizal Iswandy",
    amount: "Rp 130.000",
  },
  {
    nomor_invoice: "411007-2024-09-25-003",
    nama_customer: "Rudy",
    amount: "Rp 56.000",
  },
  {
    nomor_invoice: "411007-2024-09-25-002",
    nama_customer: "Samson",
    amount: "Rp 23.000",
  },
];

const HistoryList: React.FC = () => {
  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <ThemedView style={styles.historyItem}>
      <ThemedView style={styles.historyItemLeft}>
        <ThemedText>{item.nama_customer}</ThemedText>
        <ThemedText>{item.nomor_invoice}</ThemedText>
      </ThemedView>
      <ThemedText style={styles.historyItemRight}>{item.amount}</ThemedText>
    </ThemedView>
  );

  return (
    <ThemedView style={styles.historyContainer}>
      <ThemedView style={styles.historyHeader}>
        <ThemedText style={styles.historyText}>History</ThemedText>
        <Pressable onPress={() => {}}>
          <ThemedText style={{ color: "gray" }}>Lihat selengkapnya</ThemedText>
        </Pressable>
      </ThemedView>
      {HISTORY_ITEMS && HISTORY_ITEMS.length > 0 ? (
        <FlatList
          data={HISTORY_ITEMS}
          keyExtractor={(item) => item.nomor_invoice}
          renderItem={renderHistoryItem}
        />
      ) : (
        <ThemedText style={{ color: "gray", textAlign: "center", marginTop: 12 }}>
          History tidak tersedia
        </ThemedText>
      )}
    </ThemedView>
  );
};

export default HistoryList;

const styles = StyleSheet.create({
  historyContainer: {},
  historyHeader: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  historyText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#353636",
  },
  historyItem: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  historyItemLeft: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  historyItemRight: {
    fontWeight: "bold",
    textAlign: "right",
  },
});
