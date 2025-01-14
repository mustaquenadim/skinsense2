import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
	apiKey: 'AIzaSyA-E9f75avGdNsSHQ6eaXqJtJ--GT_Qths',
	authDomain: 'skinsense-new.firebaseapp.com',
	projectId: 'skinsense-new',
	storageBucket: 'skinsense-new.firebasestorage.app',
	messagingSenderId: '1040743545527',
	appId: '1:1040743545527:web:8d1c24bf89838ff3bceb32',
};

export const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
	persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const storage = getStorage(app);
