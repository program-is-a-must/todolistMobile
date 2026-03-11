import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useAuth } from '@/context/AuthContext';
import { Colors } from '@/constants/theme';

export default function SignupScreen() {
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onSubmit = async () => {
    setLoading(true);
    setError(null);
    try {
      await register(name, email, password);
      router.replace('/');
    } catch (e: any) {
      setError(e?.message ?? 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Create account</ThemedText>
      {error ? <ThemedText style={styles.error}>{error}</ThemedText> : null}
      <View style={styles.form}>
        <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={styles.input}
        />
        <TouchableOpacity disabled={loading} onPress={onSubmit} style={styles.button}>
          <ThemedText type="defaultSemiBold">{loading ? 'Creating…' : 'Sign up'}</ThemedText>
        </TouchableOpacity>
      </View>
      <Link href="/login" style={styles.link}>
        <ThemedText type="link">Have an account? Sign in</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 },
  form: { alignSelf: 'stretch', gap: 12, marginTop: 8 },
  input: {
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: Colors.light.tint,
  },
  link: { marginTop: 16 },
  error: { color: '#d00' },
});
