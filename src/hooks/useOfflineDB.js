import { useState, useEffect } from 'react';
import { dbOperations } from '../services/dexieDB';
import { firebaseOperations } from '../services/firebaseDB';

export const useOfflineDB = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync with Firebase when online
  useEffect(() => {
    const syncData = async () => {
      if (isOnline && !isSyncing) {
        setIsSyncing(true);
        try {
          await firebaseOperations.syncWithFirebase(dbOperations);
        } catch (error) {
          console.error('Sync failed:', error);
        } finally {
          setIsSyncing(false);
        }
      }
    };

    syncData();
  }, [isOnline]);

  // CRUD Operations
  const operations = {
    // User operations
    async createUser(userData) {
      try {
        const userId = await dbOperations.createUser(userData);
        return userId;
      } catch (error) {
        console.error('Error in createUser:', error);
        throw error;
      }
    },

    async getUser(userId) {
      try {
        return await dbOperations.getUser(userId);
      } catch (error) {
        console.error('Error in getUser:', error);
        throw error;
      }
    },

    async updateUser(userId, userData) {
      try {
        await dbOperations.updateUser(userId, userData);
      } catch (error) {
        console.error('Error in updateUser:', error);
        throw error;
      }
    },

    // Quiz operations
    async createQuiz(quizData) {
      try {
        const quizId = await dbOperations.createQuiz(quizData);
        return quizId;
      } catch (error) {
        console.error('Error in createQuiz:', error);
        throw error;
      }
    },

    async getQuiz(quizId) {
      try {
        return await dbOperations.getQuiz(quizId);
      } catch (error) {
        console.error('Error in getQuiz:', error);
        throw error;
      }
    },

    // Score operations
    async saveScore(scoreData) {
      try {
        const scoreId = await dbOperations.saveScore(scoreData);
        return scoreId;
      } catch (error) {
        console.error('Error in saveScore:', error);
        throw error;
      }
    },

    // Status
    isOnline,
    isSyncing
  };

  return operations;
}; 