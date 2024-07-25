import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth';
import {doc, setDoc, getDoc, DocumentData, DocumentReference} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';
import { User } from '@/slices/authSlice';
import { v4 as uuidv4 } from 'uuid';
import {createAsyncThunk} from "@reduxjs/toolkit";


export const register = createAsyncThunk<User, { email: string; password: string; name: string }>(
    'auth/register',
    async ({ email, password, name }, { rejectWithValue }) => {
        const auth = getAuth();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userData: User = {
                id: user.uid,
                email: user.email!,
                name,
            };

            const userDocRef: DocumentReference<any> = doc(db, 'users', user.uid);
            await setDoc(userDocRef, userData);

            return userData;
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const login = createAsyncThunk<User, { email: string; password: string }>(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        const auth = getAuth();
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            const userDoc = await getDoc(doc(db, 'users', user.uid));

            if (userDoc.exists()) {
                return userDoc.data() as User;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const getUser = createAsyncThunk<User, void>(
    'auth/getUser',
    async (_, { rejectWithValue }) => {
        const auth = getAuth();
        try {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'users', user.uid));
                return userDoc.data() as User;
            } else {
                throw new Error('User not found');
            }
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

export const logout = createAsyncThunk<void, void>(
    'auth/signOut',
    async (_, { rejectWithValue }) => {
        const auth = getAuth();
        try {
            await signOut(auth);
        } catch (error) {
            return rejectWithValue((error as Error).message);
        }
    }
);

// export const logout = async () => {
//     await signOut(auth);
// };
