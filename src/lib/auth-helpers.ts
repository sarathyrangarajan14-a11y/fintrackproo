import { auth } from './firebase';

export interface PartnerAuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: string;
  arnNumber?: string;
  phone?: string;
}

export async function getAuthToken(): Promise<string> {
  if (auth.currentUser) {
    try {
      const token = await auth.currentUser.getIdToken();
      if (token) return token;
    } catch (e) {
      console.warn('Failed to retrieve Firebase ID token:', e);
    }
  }

  if (typeof window !== 'undefined') {
    const partnerToken = localStorage.getItem('partnerToken');
    if (partnerToken) return partnerToken;
    const partnerUser = localStorage.getItem('partnerUser');
    if (partnerUser) return 'partner-admin-token';
    const mockUser = localStorage.getItem('mockUser');
    if (mockUser === 'true') return 'mock-token';
  }

  return 'partner-admin-token';
}

export async function getAuthHeaders(): Promise<Record<string, string>> {
  const token = await getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
}

export function getStoredPartnerUser(): PartnerAuthUser | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('partnerUser');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
