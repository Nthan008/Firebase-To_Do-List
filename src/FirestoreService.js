// FirestoreService.js
import { db } from './firebaseConfig';
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  setDoc
} from 'firebase/firestore';

// Function to add a new task to Firestore
export const addTask = async (userId, task) => {
  await addDoc(collection(db, 'tasks'), {
    userId,
    ...task,
    createdAt: new Date()
  });
};

// Function to get a user's tasks
export const getTasks = async (userId) => {
  const q = query(collection(db, 'tasks'), where('userId', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Function to update a task
export const updateTask = async (taskId, newFields) => {
  const taskRef = doc(db, 'tasks', taskId);
  await updateDoc(taskRef, newFields);
};

// Function to delete a task
export const deleteTask = async (taskId) => {
  await deleteDoc(doc(db, 'tasks', taskId));
};

export const createUserProfile = async (userId, userData) => {
    try {
      const userRef = doc(db, 'users', userId);
      // Check if username is defined before setting the document
      if (userData.username) {
        await setDoc(userRef, userData);
      } else {
        console.error('Username is undefined');
      }
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw error;
    }
  };