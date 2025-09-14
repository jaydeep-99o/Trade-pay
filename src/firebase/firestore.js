// src/firebase/firestore.js
import {
    doc,
    getDoc,
    setDoc,
    updateDoc,
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    serverTimestamp,
    runTransaction
} from 'firebase/firestore';
import { db } from './config';

// Get user data
export const getUserData = async (uid) => {
    try {
        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            return null;
        }
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

// Create user document
export const createUserDocument = async (uid, userData) => {
    try {
        await setDoc(doc(db, 'users', uid), {
            ...userData,
            balance: 10000, // Default fake money
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Update user balance
export const updateUserBalance = async (uid, newBalance) => {
    try {
        const userRef = doc(db, 'users', uid);
        await updateDoc(userRef, {
            balance: newBalance,
            updatedAt: serverTimestamp()
        });
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Transfer money between users
export const transferMoney = async (fromUid, toUid, amount, description = '') => {
    try {
        const result = await runTransaction(db, async (transaction) => {
            const fromRef = doc(db, 'users', fromUid);
            const toRef = doc(db, 'users', toUid);

            const fromDoc = await transaction.get(fromRef);
            const toDoc = await transaction.get(toRef);

            if (!fromDoc.exists() || !toDoc.exists()) {
                throw new Error('User not found');
            }

            const fromBalance = fromDoc.data().balance;
            const toBalance = toDoc.data().balance;

            if (fromBalance < amount) {
                throw new Error('Insufficient balance');
            }

            // Update balances
            transaction.update(fromRef, {
                balance: fromBalance - amount,
                updatedAt: serverTimestamp()
            });

            transaction.update(toRef, {
                balance: toBalance + amount,
                updatedAt: serverTimestamp()
            });

            // Create transaction record
            const transactionData = {
                fromUid,
                toUid,
                fromName: fromDoc.data().name,
                toName: toDoc.data().name,
                amount,
                description,
                timestamp: serverTimestamp(),
                status: 'completed',
                transactionId: Date.now().toString()
            };

            transaction.set(doc(collection(db, 'transactions')), transactionData);

            return transactionData;
        });

        return { success: true, transaction: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Get user transactions
export const getUserTransactions = async (uid) => {
    try {
        const q = query(
            collection(db, 'transactions'),
            where('fromUid', '==', uid),
            orderBy('timestamp', 'desc')
        );

        const q2 = query(
            collection(db, 'transactions'),
            where('toUid', '==', uid),
            orderBy('timestamp', 'desc')
        );

        const [sentSnapshot, receivedSnapshot] = await Promise.all([
            getDocs(q),
            getDocs(q2)
        ]);

        const sentTransactions = sentSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: 'sent'
        }));

        const receivedTransactions = receivedSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            type: 'received'
        }));

        const allTransactions = [...sentTransactions, ...receivedTransactions]
            .sort((a, b) => b.timestamp - a.timestamp);

        return { success: true, transactions: allTransactions };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Search users by email or phone
export const searchUsers = async (searchTerm) => {
    try {
        const usersRef = collection(db, 'users');
        const emailQuery = query(usersRef, where('email', '==', searchTerm));
        const phoneQuery = query(usersRef, where('phone', '==', searchTerm));

        const [emailSnapshot, phoneSnapshot] = await Promise.all([
            getDocs(emailQuery),
            getDocs(phoneQuery)
        ]);

        const users = [];

        emailSnapshot.forEach(doc => {
            users.push({ id: doc.id, ...doc.data() });
        });

        phoneSnapshot.forEach(doc => {
            if (!users.find(user => user.id === doc.id)) {
                users.push({ id: doc.id, ...doc.data() });
            }
        });

        return { success: true, users };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Admin: Get all users
export const getAllUsers = async () => {
    try {
        const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);

        const users = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return { success: true, users };
    } catch (error) {
        return { success: false, error: error.message };
    }
};