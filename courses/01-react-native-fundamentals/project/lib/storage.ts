/** Stub — AsyncStorage helpers; implement per challenge 06 README */

export type StoredNote = { id: string; text: string; createdAt: string };
export type StoredUser = { email: string; username: string };
export type ThemeMode = 'light' | 'dark';

export async function getNotes(): Promise<StoredNote[]> {
  return [];
}

export async function saveNotes(_notes: StoredNote[]): Promise<void> {}

export async function getUser(): Promise<StoredUser | null> {
  return null;
}

export async function saveUser(_user: StoredUser | null): Promise<void> {}

export async function getTheme(): Promise<ThemeMode> {
  return 'dark';
}

export async function saveTheme(_theme: ThemeMode): Promise<void> {}
