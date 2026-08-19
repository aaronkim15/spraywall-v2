import { Stack, useFocusEffect, Link } from "expo-router";
import { useEffect, useState, useCallback } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_BASE_URL } from "../constants/apis";
import { theme } from "../constants/themes";

type Climb = {
   id: string,
   name: string,
   grade: string,
   description: string | null;
};

export default function Climbs() {
  const [climbs, setClimbs] = useState<Climb[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useFocusEffect(
    useCallback(() => {
        async function loadClimbs() {
            try {
                const res = await fetch(`${API_BASE_URL}/climbs`);
                if (!res.ok) {
                    throw new Error(`Server responded ${res.status}`);
                }
                const data: Climb[] = await res.json();
                setClimbs(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : "Something went wrong");
            } finally {
                setLoading(false);
            }
        }
        loadClimbs();
    }, [])
);

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ headerShown: false }} />
      <Text style={styles.title}>CLIMBS</Text>

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
          <Text style={styles.error}>Couldn&apos;t load climbs</Text>
          <Text style={styles.mutedSmall}>{error}</Text>
        </View> 
      )}

      {!loading && !error && (
        <FlatList
          data={climbs}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.muted}>No climbs yet.</Text>}
          renderItem={({ item }) => (
            <Link href={`/climb/${item.id}`} asChild>
              <Pressable style={styles.card}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                {item.grade ? (
                  <Text style={styles.cardSubtitle}>{item.grade}</Text>
                ) : null}
              </Pressable>
            </Link>
            
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