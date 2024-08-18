"use client"
import React, {useEffect, useState} from "react";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore"; // Import Firestore methods
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";

import { auth, db } from "../lib/firebase";

export const handleRegister = async (data) => {
  const { email, password } = data;
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    await setDoc(doc(db, 'users', res.user.uid), {
      id: res.user.uid, // Adding uid as a field in the document
      email: email,
      createdAt: serverTimestamp(), // Adding timestamp field
    });
  } catch (error) {
    console.error("Error during registration:", error);
  }
};

// Email and PW signin
export const handleLogin = async (data) => {
  const { email, password } = data;
  try {
    await setPersistence(auth, browserLocalPersistence);
    const res = await signInWithEmailAndPassword(auth, email, password);
    console.log("Login successful:", res);
    return res;
  } catch (error) {
    console.error("Login failed: ", error); // Log the full error
    throw error; // Rethrow the error to see if it's caught elsewhere
  }
};

export const useAuthRedirect = () => {
  const router = useRouter();
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user && !authLoading) {
        // If there's no user and it's not during the initial loading phase
        await signOut(auth);
        router.push("/signin"); // Redirect to the sign-in page
      } else if (user) {
        setAuthLoading(false); // User is logged in, stop loading
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [router, authLoading]);

  return authLoading; // Return the loading state
};