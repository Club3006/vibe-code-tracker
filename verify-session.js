// Simple script to verify session data
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

// Use the same config as the app
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

async function verifySessionData() {
  try {
    console.log('🔍 Checking for session data...');
    
    // Get all users
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`Found ${usersSnapshot.size} user(s)`);
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      console.log(`\n👤 User: ${userId}`);
      
      // Check today's date (2025-09-09)
      const today = '2025-09-09';
      
      // Check daily records
      const dailyRef = doc(db, 'users', userId, 'dailyRecords', today);
      const dailySnap = await getDoc(dailyRef);
      
      if (dailySnap.exists()) {
        const dailyData = dailySnap.data();
        console.log('📊 Daily data:', {
          pushups_done: dailyData.pushups_done,
          squats_done: dailyData.squats_done,
          inbound_done: dailyData.inbound_done,
          outbound_done: dailyData.outbound_done,
          updated_at: dailyData.updated_at ? new Date(dailyData.updated_at).toLocaleString() : 'N/A'
        });
      } else {
        console.log('❌ No daily data found');
      }
      
      // Check session blocks
      const sessionsRef = collection(db, 'users', userId, 'sessions', today, 'blocks');
      const sessionsSnapshot = await getDocs(sessionsRef);
      
      if (!sessionsSnapshot.empty) {
        console.log(`🎯 Found ${sessionsSnapshot.size} session(s):`);
        sessionsSnapshot.forEach((sessionDoc, index) => {
          const sessionData = sessionDoc.data();
          console.log(`  Session ${index + 1}:`, {
            id: sessionDoc.id,
            expected_minutes: sessionData.expected_minutes,
            actual_minutes: sessionData.actual_minutes,
            pushups_done: sessionData.pushups_done,
            squats_done: sessionData.squats_done,
            chosen_tasks: sessionData.chosen,
            completed_tasks: sessionData.completed,
            counts: sessionData.counts,
            started_at: sessionData.started_at ? new Date(sessionData.started_at.toMillis()).toLocaleString() : 'N/A',
            finished_at: sessionData.finished_at ? new Date(sessionData.finished_at.toMillis()).toLocaleString() : 'N/A'
          });
        });
      } else {
        console.log('❌ No sessions found');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

verifySessionData();
