import { useEffect, useMemo, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import * as api from '@/lib/api';
import { Colors } from '@/constants/theme';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [todos, setTodos] = useState<api.Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const sortedTodos = useMemo(
    () =>
      [...todos].sort((a, b) => {
        const ac = a.completed ?? a.is_completed ? 1 : 0;
        const bc = b.completed ?? b.is_completed ? 1 : 0;
        if (ac !== bc) return ac - bc;
        return (a.title ?? a.name ?? '').localeCompare(b.title ?? b.name ?? '');
      }),
    [todos]
  );

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.listTodos();
      setTodos(data);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to load todos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onCreate = async () => {
    const title = input.trim();
    if (!title) return;
    setCreating(true);
    try {
      const todo = await api.createTodo({ title });
      setTodos((t) => [todo, ...t]);
      setInput('');
    } catch (e: any) {
      setError(e?.message ?? 'Failed to create');
    } finally {
      setCreating(false);
    }
  };

  const onToggle = async (id: number) => {
    try {
      const updated = await api.toggleTodo(id);
      setTodos((t) => t.map((x) => (x.id === id ? updated : x)));
    } catch (e: any) {
      setError(e?.message ?? 'Failed to toggle');
    }
  };

  const onDelete = async (id: number) => {
    const current = todos;
    setTodos((t) => t.filter((x) => x.id !== id));
    try {
      await api.deleteTodo(id);
    } catch (e: any) {
      setError(e?.message ?? 'Failed to delete');
      setTodos(current);
    }
  };

  const renderItem = ({ item }: { item: api.Todo }) => {
    const done = item.completed ?? item.is_completed ?? false;
    const title = item.title ?? item.name ?? `#${item.id}`;
    return (
      <View style={styles.todoRow}>
        <TouchableOpacity onPress={() => onToggle(item.id)} style={[styles.checkbox, done && styles.checkboxDone]} />
        <ThemedText style={[styles.todoText, done && styles.todoTextDone]}>{title}</ThemedText>
        <TouchableOpacity onPress={() => onDelete(item.id)} style={styles.deleteBtn}>
          <ThemedText style={styles.deleteText}>×</ThemedText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Todos</ThemedText>
        <View style={{ flex: 1 }} />
        <ThemedText>{user?.name ?? user?.email ?? 'Account'}</ThemedText>
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <ThemedText type="link">Logout</ThemedText>
        </TouchableOpacity>
      </View>

      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}

      <View style={styles.createRow}>
        <TextInput
          placeholder="New todo…"
          value={input}
          onChangeText={setInput}
          style={styles.input}
          onSubmitEditing={onCreate}
          returnKeyType="done"
        />
        <TouchableOpacity onPress={onCreate} disabled={creating} style={styles.addBtn}>
          <ThemedText type="defaultSemiBold">{creating ? 'Adding…' : 'Add'}</ThemedText>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sortedTodos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        refreshing={loading}
        onRefresh={load}
        contentContainerStyle={{ paddingVertical: 8 }}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  error: { color: '#d00', marginBottom: 8 },
  createRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.light.border,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  addBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
  },
  logoutBtn: { marginLeft: 8 },
  todoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.light.border,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.light.border,
    marginRight: 12,
  },
  checkboxDone: {
    backgroundColor: Colors.light.success,
  },
  todoText: { flex: 1, fontSize: 16 },
  todoTextDone: { textDecorationLine: 'line-through', opacity: 0.6 },
});
