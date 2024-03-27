import { auth } from './firebaseConfig'; // Update this path according to your project structure
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Initialize Firestore
const db = getFirestore();

// Sign up function
export const signUp = async (email, password, username) => {
  try {
    // Create user with email and password
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    // Store user profile data in Firestore
    await storeUserProfile(credential.user.uid, { email, username });

    // Return user information
    return credential.user;
  } catch (error) {
    console.error("Error signing up:", error.message);
    throw error;
  }
};

// Sign in function
export const signIn = async (email, password) => {
  try {
    // Sign in with email and password
    const credential = await signInWithEmailAndPassword(auth, email, password);

    // Return user information
    return credential.user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};

// Sign out function
export const signOutUser = async () => {
  try {
    // Sign out the user
    await signOut(auth);
  } catch (error) {
    console.error("Error signing out:", error.message);
    throw error;
  }
};

// Google sign-in function
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // You can add additional actions here based on the user sign-in
    console.log(user);

    // Store user profile data in Firestore
    await storeUserProfile(user.uid, { email: user.email, username: user.displayName });

    return { user, token };
  } catch (error) {
    console.error("Error signing in with Google:", error.message);
    throw error;
  }
};

// Password reset function
export const resetPassword = async (email) => {
  try {
    // Send password reset email
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw error;
  }
};

// Auth state change observer
export const onAuthStateChange = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Function to store user profile data in Firestore
const storeUserProfile = async (userId, userData) => {
  try {
    const userRef = doc(db, "users", userId);
    await setDoc(userRef, userData);
  } catch (error) {
    console.error("Error storing user profile:", error.message);
    throw error;
  }
};
