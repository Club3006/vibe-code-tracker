import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, signInAnonymously, type User } from "firebase/auth";
import {
  getFirestore,
  doc, getDoc, setDoc
} from "firebase/firestore";
import type { DailyRecord, StreakMeta } from "../types";

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
};

console.log("Firebase cfg", {
  projectId: cfg.projectId, authDomain: cfg.authDomain, appId: cfg.appId, hasKey: !!cfg.apiKey
});

export const app = initializeApp(cfg);

// Standard Firestore initialization with explicit database name
export const db = getFirestore(app, "(default)");

export const auth = getAuth(app);
export const ensureAnonAuth = (): Promise<User> =>
  new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      if (user) { 
        console.log("✅ User authenticated:", user.uid);
        unsub(); 
        resolve(user); 
      } else { 
        try { 
          console.log("🔄 Attempting anonymous sign-in...");
          const result = await signInAnonymously(auth);
          console.log("✅ Anonymous sign-in successful:", result.user.uid);
        } catch (e) { 
          console.error("❌ Anonymous auth failed:", e);
          unsub();
          reject(e);
        } 
      }
    });
  });

// Helper functions
export const todayKey = () => new Date().toISOString().slice(0, 10);

export const dailyRef = (uid: string, date: string) =>
  doc(db, "users", uid, "dailyRecords", date);

export const streakRef = (uid: string) =>
  doc(db, "users", uid, "meta", "streak");

// Load + upsert Daily
export async function loadDaily(uid: string, date: string): Promise<DailyRecord | null> {
  try {
    console.log("🔄 Loading daily record for:", uid, date);
    const snap = await getDoc(dailyRef(uid, date));
    console.log("📄 Daily record exists:", snap.exists());
    return snap.exists() ? (snap.data() as DailyRecord) : null;
  } catch (error) {
    console.error("❌ Error loading daily record:", error);
    throw error;
  }
}

export async function saveDaily(uid: string, date: string, data: Partial<DailyRecord>) {
  try {
    console.log("💾 Saving daily record for:", uid, date, data);
    await setDoc(dailyRef(uid, date), { ...data, date, updated_at: Date.now() }, { merge: true });
    console.log("✅ Daily record saved successfully");
  } catch (error) {
    console.error("❌ Error saving daily record:", error);
    throw error;
  }
}

// Load + upsert Streak
export async function loadStreak(uid: string): Promise<StreakMeta> {
  try {
    console.log("🔄 Loading streak for:", uid);
    const snap = await getDoc(streakRef(uid));
    console.log("📄 Streak exists:", snap.exists());
    return snap.exists()
      ? (snap.data() as StreakMeta)
      : ({ current_streak: 0, best_streak: 0, last_ritual_date: null } as StreakMeta);
  } catch (error) {
    console.error("❌ Error loading streak:", error);
    throw error;
  }
}

export async function saveStreak(uid: string, meta: StreakMeta) {
  try {
    console.log("💾 Saving streak for:", uid, meta);
    await setDoc(streakRef(uid), meta, { merge: true });
    console.log("✅ Streak saved successfully");
  } catch (error) {
    console.error("❌ Error saving streak:", error);
    throw error;
  }
}