import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_BASE_URL } from "../constants/apis";
import { theme } from "../constants/themes";

type Wall = {
  id: string;
  name: string;
  location: string | null;
  image_url: string | null;
};

export default function Climbs() {
  const [walls, setWalls] = useState<Wall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadWalls() {
      try {
        const res = await fetch(`${API_BASE_URL}/walls`);
        if (!res.ok) {
          throw new Error(`Server responded ${res.status}`);
        }
        const data: Wall[] = await res.json();
        setWalls(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    loadWalls();
  }, []);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>WALLS</Text>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.muted}>Loading…</Text>
          <Text style={styles.mutedSmall}>
            First load can take ~30s while the server wakes up.
          </Text>
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Text style={styles.error}>Couldn&apos;t load walls</Text>
          <Text style={styles.mutedSmall}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={walls}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.muted}>No walls yet.</Text>}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              {item.location ? (
                <Text style={styles.cardSubtitle}>{item.location}</Text>
              ) : null}
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.colors.background,
    paddingTop: 60,
    paddingHorizontal: theme.spacing.lg,
  },
  title: {
    color: theme.colors.foreground,
    fontSize: theme.typography.fontSize["2xl"],
    fontWeight: theme.typography.fontWeight.extrabold,
    marginBottom: theme.spacing.lg,
    letterSpacing: 1,
  },
  list: {
    gap: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTitle: {
    color: theme.colors.cardForeground,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
  cardSubtitle: {
    color: theme.colors.mutedForeground,
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing.xs,
  },
  center: {
    alignItems: "center",
    justifyContent: "center",
    gap: theme.spacing.sm,
    marginTop: theme.spacing.xxl,
  },
  muted: {
    color: theme.colors.mutedForeground,
    fontSize: theme.typography.fontSize.base,
  },
  mutedSmall: {
    color: theme.colors.mutedForeground,
    fontSize: theme.typography.fontSize.sm,
    textAlign: "center",
  },
  error: {
    color: theme.colors.destructive,
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.semibold,
  },
});