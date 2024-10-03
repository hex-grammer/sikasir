import { ThemedView } from "@/components/ThemedView";
import { ThemedText } from "@/components/ThemedText";
import Button from "@/components/Button";
import { StyleSheet } from "react-native";
import React from "react";
import { UserData } from "@/services/user/getUserData";
import { HomeScreenNavigationProp } from "@/app/_layout";
import { useNavigation } from "expo-router";

interface HeroSectionProps {
  userData: UserData | null;
}

const HeroSection: React.FC<HeroSectionProps> = ({ userData }) => {
    const navigation = useNavigation<HomeScreenNavigationProp>();
    return (
        <ThemedView style={styles.heroContainer}>
        {userData ? (
            <>
            <ThemedText style={styles.heroTitle}>{userData.full_name},</ThemedText>
            <ThemedText style={styles.heroSubtitle}>Cluster {userData.cluster}</ThemedText>
            <ThemedText style={styles.heroLargeNumber} type="title">
                Rp 230.000
            </ThemedText>
            </>
        ) : (
            <ThemedText>Loading user data...</ThemedText>
        )}
        <ThemedView style={styles.heroButtons}>
            <Button title="Buka POS" onPress={() => {
                navigation.navigate("point-of-sale");
            }} />
            <Button title="Rekap POS" type="outline" onPress={() => {}} />
        </ThemedView>
        </ThemedView>
    );
};

export default HeroSection;

const styles = StyleSheet.create({
  heroContainer: {
    display: "flex",
    justifyContent: "flex-end",
    height: "45%",
    width: "100%",
    marginBottom: 12,
  },
  heroTitle: {
    fontSize: 24,
    lineHeight: 26,
    fontWeight: "bold",
    color: "#353636",
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: 22,
    color: "#353636",
  },
  heroLargeNumber: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 40,
    color: "#353636",
    marginTop: 12,
    marginBottom: 12,
  },
  heroButtons: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
});
