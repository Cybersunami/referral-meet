import { doc, getDoc, getDocs, updateDoc } from "firebase/firestore";
import { auth, db, stor, storage } from "../lib/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";


export const getUserProfile = async (uid) => {
    try {
      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);
  
      if (docSnap.exists()) {
        return docSnap.data(); // Return the profile data
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };
  
  export const updateUserProfile = async (uid, profileData) => {
    try {
      const docRef = doc(db, "users", uid);
      await updateDoc(docRef, profileData);
      console.log("User profile updated successfully");
    } catch (error) {
      console.error("Error updating user profile:", error);
    }
  };


export const uploadProfilePicture = async (file) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("User not authenticated");
  
      const storageRef = ref(storage, `profilePictures/${user.uid}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      // Update the user's profile with the new profile picture URL
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, { profilePictureUrl: downloadURL });
  
      return downloadURL;
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      throw error;
    }
  };


  
  export function useUsers(searchTerm = "") {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [userLoading, setUserLoading] = useState(false);
  
    useEffect(() => {
      async function fetchUsers() {
        try {
          setUserLoading(true);
          const docRef = collection(db, "users");
          const snapShot = await getDocs(docRef);
          const fetchedUsers = snapShot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(fetchedUsers);
        } catch (error) {
          console.error(error);
          setUserLoading(false);
        } finally {
          setUserLoading(false);
        }
      }
      fetchUsers();
    }, []);
  
    useEffect(() => {
      // Filter users based on the search term
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(lowercasedSearchTerm) ||
        user.email.toLowerCase().includes(lowercasedSearchTerm) ||
        user.school?.toLowerCase().includes(lowercasedSearchTerm)
      );
      setFilteredUsers(filtered);
    }, [searchTerm, users]);
  
    return { users: filteredUsers, userLoading };
  }
  
  export function useUser(uid) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      async function fetchUser() {
        try {
          setLoading(true);
          const docRef = doc(db, "users", uid);
          const snapShot = await getDoc(docRef);
  
          if (snapShot.exists()) {
            setUser({ id: snapShot.id, ...snapShot.data() });
          } else {
            setUser(null);
            setError("User not found");
          }
        } catch (error) {
          console.error("Error fetching user:", error);
          setError(error.message);
        } finally {
          setLoading(false);
        }
      }
  
      if (uid) {
        fetchUser();
      }
    }, [uid]);
  
    return { user, loading, error };
  }
  