import { StyleSheet, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';

export default function TabTwoScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState<api.StatsResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .getStats()
      .then((s) => setStats(s))
      .catch((e: any) => setError(e?.message ?? 'Failed to load stats'));
  }, []);

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Profile & Stats</ThemedText>
      <View style={{ height: 8 }} />
      {user ? (
        <>
          <ThemedText>
            Signed in as {user.name ?? user.email ?? 'User'}
          </ThemedText>
        </>
      ) : null}
      <View style={{ height: 16 }} />
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      <View style={styles.card}>
        <ThemedText type="subtitle">Todos Summary</ThemedText>
        <View style={{ height: 8 }} />
        <ThemedText>Total: {stats?.total ?? '–'}</ThemedText>
        <ThemedText>Completed: {stats?.completed ?? '–'}</ThemedText>
        <ThemedText>Pending: {stats?.pending ?? '–'}</ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, backgroundColor: '#fff' },
  error: { color: '#d00' },
});
