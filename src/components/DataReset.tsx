import { useState } from "react";
import { ensureAnonAuth } from "../lib/firebase";
import { collection, getDocs, doc, writeBatch } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function DataReset() {
  const [resetting, setResetting] = useState(false);
  const [result, setResult] = useState<string>("");

  const resetAllData = async () => {
    if (!confirm("⚠️ WARNING: This will permanently delete ALL your data including daily check-ins, focus sessions, and streaks. This cannot be undone. Are you sure?")) {
      return;
    }

    setResetting(true);
    setResult("🔄 Starting data reset...\n");

    try {
      const user = await ensureAnonAuth();
      const userId = user.uid;
      
      setResult(prev => prev + `🗑️ Resetting data for user: ${userId}\n`);

      // Delete daily records
      const dailySnapshot = await getDocs(collection(db, 'users', userId, 'dailyRecords'));
      setResult(prev => prev + `Found ${dailySnapshot.size} daily records\n`);

      const batch = writeBatch(db);

      for (const dailyDoc of dailySnapshot.docs) {
        batch.delete(dailyDoc.ref);
        setResult(prev => prev + `  - Deleting daily record: ${dailyDoc.id}\n`);
      }

      // Delete streak data
      const streakRef = doc(db, 'users', userId, 'meta', 'streak');
      batch.delete(streakRef);
      setResult(prev => prev + `  - Deleting streak data\n`);

      // Delete all session data
      const sessionsSnapshot = await getDocs(collection(db, 'users', userId, 'sessions'));
      setResult(prev => prev + `Found ${sessionsSnapshot.size} session date(s)\n`);

      for (const sessionDateDoc of sessionsSnapshot.docs) {
        const dateId = sessionDateDoc.id;
        setResult(prev => prev + `  - Deleting sessions for date: ${dateId}\n`);

        const blocksSnapshot = await getDocs(collection(db, 'users', userId, 'sessions', dateId, 'blocks'));
        for (const blockDoc of blocksSnapshot.docs) {
          batch.delete(blockDoc.ref);
          setResult(prev => prev + `    - Deleting session block: ${blockDoc.id}\n`);
        }

        // Delete the date collection itself
        batch.delete(sessionDateDoc.ref);
      }

      // Commit all deletions
      await batch.commit();
      setResult(prev => prev + `✅ All data deleted successfully!\n`);
      setResult(prev => prev + `🎉 Data reset complete! You can now start fresh.\n`);

    } catch (error) {
      console.error('Error during data reset:', error);
      setResult(prev => prev + `❌ Error during data reset: ${error instanceof Error ? error.message : String(error)}\n`);
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="vc-card max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold text-white mb-4">🗑️ Reset All Data</h2>
      
      <div className="bg-red-500/20 border border-red-400/30 rounded-lg p-4 mb-4">
        <h3 className="text-red-300 font-semibold mb-2">⚠️ WARNING</h3>
        <p className="text-red-200 text-sm">
          This will permanently delete ALL your data including:
        </p>
        <ul className="text-red-200 text-sm list-disc list-inside mt-2">
          <li>All daily check-in records</li>
          <li>All focus session data</li>
          <li>All streak information</li>
          <li>All progress tracking</li>
        </ul>
        <p className="text-red-300 font-semibold mt-2">This action cannot be undone!</p>
      </div>

      <button
        onClick={resetAllData}
        disabled={resetting}
        className="bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
      >
        {resetting ? "🔄 Resetting..." : "🗑️ RESET ALL DATA"}
      </button>

      {result && (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
          <h3 className="text-white font-semibold mb-2">Reset Progress:</h3>
          <pre className="text-green-400 text-sm whitespace-pre-wrap">{result}</pre>
        </div>
      )}
    </div>
  );
}
