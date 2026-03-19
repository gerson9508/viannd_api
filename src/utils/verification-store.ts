
interface CodeEntry {
   code: string;
   expiresAt: number;
   generatedAt: number; 
}

const store = new Map<string, CodeEntry>();
const COOLDOWN_MS = 15 * 60 * 1000; 
const CODE_EXPIRY_MS = 10 * 60 * 1000; 

export const saveCode = (email: string, code: string) => {
   store.set(email, {
      code,
      expiresAt: Date.now() + CODE_EXPIRY_MS,
      generatedAt: Date.now(),
   });
};

export const canRequestCode = (email: string): { allowed: boolean; waitMinutes?: number } => {
   const entry = store.get(email);
   if (!entry) return { allowed: true };

   const elapsed = Date.now() - entry.generatedAt;
   if (elapsed < COOLDOWN_MS) {
      const waitMinutes = Math.ceil((COOLDOWN_MS - elapsed) / 60000);
      return { allowed: false, waitMinutes };
   }
   return { allowed: true };
};

export const verifyCode = (email: string, code: string): boolean => {
   const entry = store.get(email);
   if (!entry) return false;
   if (Date.now() > entry.expiresAt) {

      return false;
   }
   if (entry.code !== code) return false;
   store.delete(email); 
   return true;
};