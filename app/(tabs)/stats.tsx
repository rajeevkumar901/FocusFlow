// app/(tabs)/stats.tsx (Themed)
import React from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import TopAppsList from "../../components/stats/TopAppsList";
import { mockTopApps, mockScreenUnlocks } from "../../data/mockUsageData";
import { useThemeColor } from "../../hooks/useThemeColor";
// Note: We are removing the chart for now as it has a complex, hardcoded theme.
// A fully themed chart would require rewriting its internal `chartConfig`.

export default function StatsScreen() {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");
  const cardColor = useThemeColor({}, "card");
  const accentColor = useThemeColor({}, "tint");
  const secondaryTextColor = useThemeColor({}, "secondaryText");

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <View style={[styles.headerContainer, { backgroundColor: accentColor }]}>
        <Text style={styles.title}>Your Digital Habits</Text>
      </View>

      <View style={[styles.unlocksContainer, { backgroundColor: cardColor }]}>
        <Text style={[styles.unlocksText, { color: textColor }]}>
          Screen Unlocks Today
        </Text>
        <Text style={[styles.unlocksCount, { color: accentColor }]}>
          {mockScreenUnlocks}
        </Text>
      </View>

      <TopAppsList
        apps={mockTopApps}
        textColor={textColor}
        cardColor={cardColor}
        secondaryTextColor={secondaryTextColor}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  headerContainer: {
    padding: 24,
    paddingTop: 50,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 16,
  },
  title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
  unlocksContainer: {
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    alignItems: "center",
    elevation: 3,
  },
  unlocksText: { fontSize: 18 },
  unlocksCount: { fontSize: 32, fontWeight: "bold", marginTop: 8 },
});
