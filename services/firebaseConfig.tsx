import { initializeApp, getApps } from "firebase/app";
import { initializeAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

const { getReactNativePersistence } = require("firebase/auth");


const firebaseConfig = {
  apiKey: "AIzaSyDJlTln9jk4MO3d3Ym62leej3_-V07yQkY",
  authDomain: "cp04mobile-6cb52.firebaseapp.com",
  projectId: "cp04mobile-6cb52",
  storageBucket: "cp04mobile-6cb52.firebasestorage.app",
  messagingSenderId: "427222495665",
  appId: "1:427222495665:web:cb99494a54dbbe6fee4d90"
};

const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApps()[0];


export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});


export const db = getFirestore(app);