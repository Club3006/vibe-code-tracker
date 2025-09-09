// Script to reset all Firebase data for a fresh start
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, deleteDoc, writeBatch } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBQqJqJqJqJqJqJqJqJqJqJqJqJqJqJqJq",
  authDomain: "perfect-day-1eb92.firebaseapp.com",
  projectId: "perfect-day-1eb92",
  storageBucket: "perfect-day-1eb92.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function resetAllData() {
  try {
    console.log('🔄 Starting data reset...');
    
    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`Found ${usersSnapshot.size} user(s)`);
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      console.log(`\n🗑️ Resetting data for user: ${userId}`);
      
      // Delete daily records
      const dailySnapshot = await getDocs(collection(db, 'users', userId, 'dailyRecords'));
      console.log(`Found ${dailySnapshot.size} daily records`);
      
      const batch = writeBatch(db);
      
      for (const dailyDoc of dailySnapshot.docs) {
        batch.delete(dailyDoc.ref);
        console.log(`  - Deleting daily record: ${dailyDoc.id}`);
      }
      
      // Delete streak data
      const streakRef = doc(db, 'users', userId, 'meta', 'streak');
      batch.delete(streakRef);
      console.log(`  - Deleting streak data`);
      
      // Delete all session data
      const sessionsSnapshot = await getDocs(collection(db, 'users', userId, 'sessions'));
      console.log(`Found ${sessionsSnapshot.size} session date(s)`);
      
      for (const sessionDateDoc of sessionsSnapshot.docs) {
        const dateId = sessionDateDoc.id;
        console.log(`  - Deleting sessions for date: ${dateId}`);
        
        const blocksSnapshot = await getDocs(collection(db, 'users', userId, 'sessions', dateId, 'blocks'));
        for (const blockDoc of blocksSnapshot.docs) {
          batch.delete(blockDoc.ref);
          console.log(`    - Deleting session block: ${blockDoc.id}`);
        }
        
        // Delete the date collection itself
        batch.delete(sessionDateDoc.ref);
      }
      
      // Commit all deletions
      await batch.commit();
      console.log(`✅ All data deleted for user: ${userId}`);
    }
    
    console.log('\n🎉 Data reset complete! All Firebase data has been cleared.');
    console.log('You can now start fresh with your focus sessions and daily check-ins.');
    
  } catch (error) {
    console.error('❌ Error during data reset:', error);
  }
}

resetAllData();
