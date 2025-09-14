// src/firebase/auth.js
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { auth } from './config';
import { createUserDocument } from './firestore';

// Register new user
export const registerUser = async (userData) => {
    try {
        const { email, password, name, phone } = userData;

        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile
        await updateProfile(user, {
            displayName: name
        });

        // Create user document in Firestore
        const docResult = await createUserDocument(user.uid, {
            uid: user.uid,
            name: name,
            email: email,
            phone: phone || ''
        });

        if (!docResult.success) {
            throw new Error(docResult.error);
        }

        return { success: true, user };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Login user
export const loginUser = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        let errorMessage = 'Login failed. Please try again.';

        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage = 'No account found with this email address.';
                break;
            case 'auth/wrong-password':
                errorMessage = 'Incorrect password. Please try again.';
                break;
            case 'auth/invalid-email':
                errorMessage = 'Please enter a valid email address.';
                break;
            case 'auth/too-many-requests':
                errorMessage = 'Too many failed attempts. Please try again later.';
                break;
            default:
                errorMessage = error.message;
        }

        return { success: false, error: errorMessage };
    }
};

// Logout user
export const logoutUser = async () => {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};