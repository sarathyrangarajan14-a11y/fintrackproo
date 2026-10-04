import { db } from './index.ts';
import { users } from './schema.ts';

export async function getOrCreateUser(uid: string, email: string, phoneNumber?: string | null) {
  const fallbackEmail = email && email.trim().length > 0 
    ? email.trim() 
    : (phoneNumber ? `${phoneNumber.replace(/[^0-9]/g, '')}@mobile.client` : `client_${uid.slice(0, 8)}@fintrackpro.client`);

  const updateFields: any = {
    lastLoginAt: new Date()
  };
  if (email && email.trim()) {
    updateFields.email = email.trim();
  }
  if (phoneNumber !== undefined) {
    updateFields.phoneNumber = phoneNumber || null;
  }

  const result = await db.insert(users)
    .values({
      uid,
      email: fallbackEmail,
      phoneNumber: phoneNumber || null,
      lastLoginAt: new Date()
    })
    .onConflictDoUpdate({
      target: users.uid,
      set: updateFields,
    })
    .returning();

  return result[0];
}
