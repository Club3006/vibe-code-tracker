import { doc, addDoc, collection, Timestamp, setDoc } from "firebase/firestore";
import { db, dailyRef } from "./firebase";

export type TaskKey = "loans"|"quotes"|"emails"|"inbounds"|"outbounds";

export const PRESET_TASKS: { key: TaskKey; label: string; type: "yn"|"count" }[] = [
  { key: "loans",    label: "Check All Loans",            type: "yn" },
  { key: "quotes",   label: "F/U Quotes, Forms, Apps",    type: "yn" },
  { key: "emails",   label: "F/U Emails, Calls, Texts",   type: "yn" },
  { key: "inbounds", label: "Inbound Calls",              type: "count" },
  { key: "outbounds",label: "Outbound Calls",             type: "count" },
];

export type Session = {
  id?: string;
  uid: string;
  date: string;               // YYYY-MM-DD
  started_at: number;         // epoch ms
  expected_minutes: number;
  chosen: TaskKey[];          // which tasks user committed this block
  // results (filled at end)
  completed?: Partial<Record<TaskKey, boolean>>;
  counts?:     Partial<Record<"inbounds"|"outbounds", number>>;
  actual_minutes?: number;
  pushups_done?: number;
  squats_done?: number;
};

export async function createSession(uid: string, date: string, s: Omit<Session,"id">) {
  const ref = collection(db, "users", uid, "sessions", date, "blocks");
  const docRef = await addDoc(ref, {
    ...s,
    started_at: Timestamp.fromMillis(s.started_at),
    created_at: Timestamp.now(),
  });
  return docRef.id;
}

export async function finalizeSession(uid: string, date: string, id: string, result: Partial<Session>) {
  console.log('🎯 finalizeSession called with:', { uid, date, id, result });
  
  try {
    const ref = doc(db, "users", uid, "sessions", date, "blocks", id);
    console.log('💾 Saving session data to:', ref.path);
    
    await setDoc(ref, {
      ...result,
      finished_at: Timestamp.now(),
    }, { merge: true });
    
    console.log('✅ Session data saved successfully');

    // Aggregate into today's doc
    const agg: any = {};
    if (result.completed?.loans)  agg.done_loans = true;
    if (result.completed?.quotes) agg.done_quotes_forms_apps = true;
    if (result.completed?.emails) agg.done_emails_calls_texts = true;

    if (result.counts?.inbounds)  agg.inbound_done  = (result.counts.inbounds);
    if (result.counts?.outbounds) agg.outbound_done = (result.counts.outbounds);
    if (result.pushups_done)      agg.pushups_done  = (result.pushups_done);
    if (result.squats_done)       agg.squats_done   = (result.squats_done);

    console.log('📊 Aggregating daily data:', agg);
    console.log('📊 Full result object:', result);
    
    // increment-style: read-modify-merge would be ideal; for MVP, set latest totals
    await setDoc(dailyRef(uid, date), agg, { merge: true });
    console.log('✅ Daily data aggregated successfully');
    
  } catch (error) {
    console.error('❌ Error in finalizeSession:', error);
    throw error;
  }
}
