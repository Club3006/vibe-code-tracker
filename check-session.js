import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, doc, getDoc } from 'firebase/firestore';

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

async function checkSessionData() {
  try {
    const today = '2025-09-09';
    console.log(`Checking session data for ${today}...`);
    
    // Get all users (this is a simplified check)
    const usersSnapshot = await getDocs(collection(db, 'users'));
    
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      console.log(`\nChecking user: ${userId}`);
      
      // Check daily data
      const dailyRef = doc(db, 'users', userId, 'daily', today);
      const dailySnap = await getDoc(dailyRef);
      
      if (dailySnap.exists()) {
        console.log('Daily data found:', dailySnap.data());
      } else {
        console.log('No daily data found for today');
      }
      
      // Check session data
      const sessionsRef = collection(db, 'users', userId, 'sessions', today, 'blocks');
      const sessionsSnapshot = await getDocs(sessionsRef);
      
      if (!sessionsSnapshot.empty) {
        console.log(`Found ${sessionsSnapshot.size} session(s):`);
        sessionsSnapshot.forEach((sessionDoc) => {
          console.log('Session:', sessionDoc.id, sessionDoc.data());
        });
      } else {
        console.log('No sessions found for today');
      }
    }
    
  } catch (error) {
    console.error('Error checking session data:', error);
  }
}

checkSessionData();
