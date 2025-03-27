import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  enableIndexedDbPersistence,
  collection,
  doc,
  setDoc,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs
} from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpArPZJu9RPK4iYATESJjEm7edZPG4gTY",
    authDomain: "edugenius-acfa6.firebaseapp.com",
    projectId: "edugenius-acfa6",
    storageBucket: "edugenius-acfa6.firebasestorage.app",
    messagingSenderId: "32746920637",
    appId: "1:32746920637:web:949c482137e4f9e2b435d4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Enable offline persistence
enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // Multiple tabs open, persistence can only be enabled in one tab at a time
      console.warn('Multiple tabs open, persistence can only be enabled in one tab at a time.');
    } else if (err.code === 'unimplemented') {
      // The current browser doesn't support persistence
      console.warn('The current browser doesn\'t support persistence.');
    }
  });

// CRUD Operations
export const firebaseOperations = {
  // User operations
  async createUser(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await setDoc(userRef, {
        ...userData,
        lastSync: new Date().toISOString()
      });
      return userId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  async getUser(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userRef);
      return userDoc.exists() ? userDoc.data() : null;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async updateUser(userId, userData) {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        ...userData,
        lastSync: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // Quiz operations
  async createQuiz(quizId, quizData) {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      await setDoc(quizRef, {
        ...quizData,
        lastSync: new Date().toISOString()
      });
      return quizId;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw error;
    }
  },

  async getQuiz(quizId) {
    try {
      const quizRef = doc(db, 'quizzes', quizId);
      const quizDoc = await getDoc(quizRef);
      return quizDoc.exists() ? quizDoc.data() : null;
    } catch (error) {
      console.error('Error getting quiz:', error);
      throw error;
    }
  },

  // Score operations
  async saveScore(scoreId, scoreData) {
    try {
      const scoreRef = doc(db, 'scores', scoreId);
      await setDoc(scoreRef, {
        ...scoreData,
        lastSync: new Date().toISOString()
      });
      return scoreId;
    } catch (error) {
      console.error('Error saving score:', error);
      throw error;
    }
  },

  // Sync operations
  async syncWithFirebase(dexieOperations) {
    try {
      const syncQueue = await dexieOperations.getSyncQueue();
      
      for (const item of syncQueue) {
        switch (item.operation) {
          case 'create':
            await this[`create${item.table.charAt(0).toUpperCase() + item.table.slice(1)}`](
              item.data.id,
              item.data
            );
            break;
          case 'update':
            await this[`update${item.table.charAt(0).toUpperCase() + item.table.slice(1)}`](
              item.data.id,
              item.data
            );
            break;
          case 'delete':
            await this[`delete${item.table.charAt(0).toUpperCase() + item.table.slice(1)}`](
              item.data.id
            );
            break;
        }
        await dexieOperations.removeFromSyncQueue(item.id);
      }
    } catch (error) {
      console.error('Error syncing with Firebase:', error);
      throw error;
    }
  }
}; 