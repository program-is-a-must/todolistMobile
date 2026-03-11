import { API_BASE_URL } from '@/lib/config';
import { getStoredToken, setStoredToken } from '@/lib/storage';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

async function request<T>(path: string, options: { method?: HttpMethod; body?: any; token?: string } = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  };
  const authToken = options.token ?? getStoredToken();
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }
  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `HTTP ${res.status} ${url}`);
  }
  // Some endpoints may return 204 No Content
  if (res.status === 204) {
    // @ts-expect-error allow void
    return undefined;
  }
  return (await res.json()) as T;
}

// Auth
export interface AuthResponse {
  token: string;
  user?: any;
}

export async function login(payload: { email: string; password: string }): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/login', { method: 'POST', body: payload, token: undefined });
  if (data?.token) setStoredToken(data.token);
  return data;
}

export async function register(payload: { name: string; email: string; password: string; password_confirmation?: string }): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/register', { method: 'POST', body: payload, token: undefined });
  if (data?.token) setStoredToken(data.token);
  return data;
}

export async function logout(): Promise<void> {
  await request<void>('/logout', { method: 'POST' });
  setStoredToken(null);
}

export async function me(): Promise<any> {
  return request<any>('/user');
}

// Todos
export interface Todo {
  id: number;
  title?: string;
  name?: string;
  completed?: boolean;
  is_completed?: boolean;
  [key: string]: any;
}

export async function listTodos(): Promise<Todo[]> {
  return request<Todo[]>('/todos');
}

export async function createTodo(payload: { title?: string; name?: string }): Promise<Todo> {
  return request<Todo>('/todos', { method: 'POST', body: payload });
}

export async function updateTodo(id: number, payload: Partial<Todo>): Promise<Todo> {
  return request<Todo>(`/todos/${id}`, { method: 'PUT', body: payload });
}

export async function toggleTodo(id: number): Promise<Todo> {
  return request<Todo>(`/todos/${id}/toggle`, { method: 'PATCH' });
}

export async function deleteTodo(id: number): Promise<void> {
  await request<void>(`/todos/${id}`, { method: 'DELETE' });
}

export interface StatsResponse {
  total?: number;
  completed?: number;
  pending?: number;
  [key: string]: any;
}

export async function getStats(): Promise<StatsResponse> {
  return request<StatsResponse>('/todos/stats');
}
