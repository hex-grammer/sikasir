import { FlatList, Pressable, StyleSheet } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import React from "react";
import { iPOSInvoice } from "@/services/pos/getPOSInvoiceList";
import { router } from "expo-router";

interface HistoryListProps {
  historyItems: iPOSInvoice[];
}

const HistoryList: React.FC<HistoryListProps> = ({ historyItems }) => {
  const renderHistoryItem = ({ item }: { item: iPOSInvoice }) => (
    <Pressable onPress={() => router.push(`/invoice/${item.name}`)}>
      <ThemedView style={styles.historyItem}>
        <ThemedView style={styles.historyItemLeft}>
          <ThemedText style={styles.invoiceNumber}>{item.customer_name}</ThemedText>
          <ThemedText>{item.custom_pos_invoice_number}</ThemedText>
        </ThemedView>
        <ThemedText style={styles.historyItemRight}>Rp {item.grand_total.toLocaleString()}</ThemedText>
      </ThemedView>
    </Pressable>
  );

  return (
    <ThemedView style={styles.historyContainer}>
      <ThemedView style={styles.historyHeader}>
        <ThemedText style={styles.historyText}>History</ThemedText>
        <Pressable onPress={() => {}}>
          <ThemedText style={{ color: "gray" }}>Lihat selengkapnya</ThemedText>
        </Pressable>
      </ThemedView>
      {historyItems && historyItems.length > 0 ? (
        <ThemedView style={styles.scrollableContainer}>
          <FlatList
            data={historyItems}
            keyExtractor={(item) => item.name}
            renderItem={renderHistoryItem}
          />
        </ThemedView>
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
  historyContainer: {
    flex:1,
  },
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
    alignItems: "flex-end",
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  historyItemLeft: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },
  invoiceNumber:{
    fontWeight: "bold",
  },
  historyItemRight: {
    textAlign: "right",
  },
  scrollableContainer: {
    flex: 1,
  },
});
