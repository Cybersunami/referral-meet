"use client";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../lib/firebase";
import { getUserProfile } from "./userdata";
import { useEffect, useState } from "react";
import { School } from "@mui/icons-material";

export const createDiscussionPost = async (content) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      throw new Error("User not authenticated");
    }

    const userData = await getUserProfile(user.uid); // Ensure you await the profile fetch

    if (!userData?.email) {
      throw new Error("User data is incomplete");
    }

    const docRef = await addDoc(collection(db, "discussions"), {
      content,
      createdAt: serverTimestamp(),
      userId: user.uid,
      email: userData.email,
      name: userData.name,
      school: userData.school,
    });

    await updateDoc(doc(db, "discussions", docRef.id), {
      id: docRef.id,
    });

    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding document: ", error);
    return { success: false, error };
  }
};

export function useGetDiscussionPosts() {
    const [discussions, setDiscussions] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() => {
      setLoading(true);
  
      const q = collection(db, "discussions");
  
      // Listen to real-time updates in the discussions collection
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedDiscussions = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setDiscussions(fetchedDiscussions);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching discussions: ", error);
        setLoading(false);
      });
  
      // Cleanup subscription on unmount
      return () => unsubscribe();
    }, []);
  
    return { discussions, loading };
  }

export const deleteDiscussionPost = async (postId) => {
  try {
    const postRef = doc(db, "discussions", postId);
    await deleteDoc(postRef);
    console.log("Post deleted successfully");
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};
