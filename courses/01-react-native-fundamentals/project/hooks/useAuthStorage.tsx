import { useState } from 'react';

export type StoredUser = { email: string; username: string };

/** Stub — implement per challenge 06 README */
export function useAuthStorage() {
  const [user] = useState<StoredUser | null>(null);
  const [loading] = useState(false);
  const [isLoggedIn] = useState(false);

  return {
    user,
    loading,
    isLoggedIn,
    login: async (_email: string, _password: string) => false,
    logout: async () => {},
    signup: async (_email: string, _password: string, _username: string) => false,
  };
}
