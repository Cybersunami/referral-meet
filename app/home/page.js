"use client";
import React, { useRef, useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import SearchBar from "../components/searchbar";
import DiscussionCard from "../components/discusstioncard";
import {
  Grid,
  Typography,
  Avatar,
  TextField,
  Box,
  Button,
  Switch,
  Stack
} from "@mui/material";
import Navbarloggedin from "../components/navbarloggedin";
import DiscussionPost from "../components/DiscussionPost";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from "../firebasefunctions/userdata";
import { useGetDiscussionPosts } from "../firebasefunctions/poststorage";
import { useAuthRedirect } from "../components/useauthredirect";
export default function Home() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { discussions, loading: discussionsLoading } = useGetDiscussionPosts();
  const [profile, setProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState("");
  const [editProfile, setEditProfile] = useState({
    name: "",
    email: "",
    school: "",
    age: "",
  });
  const { isAuthenticated, loading:authloading } = useAuthRedirect();
  const [open, setOpen] = useState(false);
  const [localDiscussions, setLocalDiscussions] = useState([]);
  const [users, setUsers] = useState([]);
  const [darkMode, setDarkMode] = useState(false); 
  const fileInputRef = useRef(null);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "users"));
        const fetchedUsers = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);


  // Filter discussions based on search term
  useEffect(() => {
    setLocalDiscussions(discussions);
  }, [discussions]);

  // Fetch user profile from Firebase Auth
  useEffect(() => {
    const fetchUserProfile = async () => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        if (user) {
          setLoading(true);
          const profileData = await getUserProfile(user.uid);
          setProfile(profileData);
          setEditProfile(profileData);
          setProfilePicture(profileData.profilePictureUrl || "");
          setLoading(false);
        } else {
          setLoading(false);
        }
      });
      return () => unsubscribe();
    };

    fetchUserProfile();
  }, []);

  const handleSaveProfile = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        await updateUserProfile(user.uid, {
          ...editProfile,
          profilePictureUrl: profilePicture,
        });
        setProfile({ ...editProfile, profilePictureUrl: profilePicture });
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const downloadURL = await uploadProfilePicture(file);
        setProfilePicture(downloadURL);
        console.log("Profile picture updated successfully");
      } catch (error) {
        console.error("Failed to upload profile picture:", error);
      }
    }
  };

  const handleAvatarClick = (userId) => {
    router.push(`/user/${userId}`);
  };

  const handleDeletePost = (postId) => {
    setLocalDiscussions((prevDiscussions) =>
      prevDiscussions.filter((discussion) => discussion.id !== postId)
    );
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const toggleDarkMode = () => setDarkMode(!darkMode);

  if (loading || discussionsLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No user profile found.</div>;
  }




  // Filter users based on search term
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.school?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isAuthenticated) {
    return null; // This is a safeguard; user will be redirected if not authenticated
  }

  return (
    <Box
      sx={{
        padding: 2,
        backgroundColor: darkMode ? "#121212" : "#fff",
        color: darkMode ? "#fff" : "#000",
      }}
    >
      <Navbarloggedin />
      <Box display="flex" justifyContent="flex-end" padding={2}>
        <Typography>Dark Mode</Typography>
        <Switch checked={darkMode} onChange={toggleDarkMode} />
      </Box>
      <SearchBar onSearch={setSearchTerm} />

      <Grid container spacing={2} padding={2}>
        {/* Left side: Discussions and Users */}
        <Grid item xs={12} md={8}>
          <Box sx={{ padding: { xs: 2, sm: 5 }, marginBottom: 4 }}>
            {searchTerm && filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Box
                  key={user.id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    border: "1px solid gray",
                    padding: 2,
                    backgroundColor: darkMode ? "#333" : "#f9f9f9",
                  }}
                >
                  <Avatar
                    sx={{ width: 40, height: 40, cursor: "pointer", marginRight: 2 }}
                    src={
                      user?.profilePictureUrl ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    onClick={() => router.push(`/user/${user.id}`)}
                  />
                  <Box>
                    <Typography variant="h6">{user.name}</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                    <Typography variant="body2">{user.school}</Typography>
                  </Box>
                </Box>
              ))
            ) : searchTerm ? (
              <Typography>No users found</Typography>
            ) : null}
          </Box>

          <Box sx={{ marginBottom: 4 }}>
            <Button onClick={handleOpen} size="medium">
              Post Discussion
            </Button>
            <DiscussionPost open={open} handleClose={handleClose} />
          </Box>

          {localDiscussions.length > 0 ? (
            localDiscussions.map((discussion) => (
              <DiscussionCard
                key={discussion.id}
                discussion={discussion}
                onDelete={handleDeletePost}
              />
            ))
          ) : (
            <Typography>No posts found</Typography>
          )}
        </Grid>

        {/* Right side: Profile */}
        <Grid item xs={12} md={4}>
          <Box
            sx={{
              padding: 2,
              border: "0.2px solid #DCD7DA",
              backgroundColor: darkMode ? "#333" : "#f9f9f9",
              borderRadius: 2,
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Save" : "Edit"}
            </Button>

            <Typography fontSize={20} sx={{ marginTop: 2 }}>
              {isEditing ? (
                <TextField
                  name="name"
                  value={editProfile.name}
                  onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                  fullWidth
                />
              ) : (
                profile.name
              )}
            </Typography>

            <Avatar
            sx={{
              width: 100,
              height: 100,
              cursor: isEditing ? "pointer" : "default",
            }}
            src={
              profilePicture ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            onClick={() => {
              if (isEditing) {
                fileInputRef.current.click();
              }
            }}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-profile-picture"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />
            <Stack spacing={2} sx={{ marginTop: 3 }}>
              <Box>
                <Typography>Email:</Typography>
                {isEditing ? (
                  <TextField
                    name="email"
                    value={editProfile.email}
                    onChange={(e) => setEditProfile({ ...editProfile, email: e.target.value })}
                    fullWidth
                  />
                ) : (
                  <Typography>{profile.email}</Typography>
                )}
              </Box>

              <Box>
                <Typography>School:</Typography>
                {isEditing ? (
                  <TextField
                    name="school"
                    value={editProfile.school}
                    onChange={(e) => setEditProfile({ ...editProfile, school: e.target.value })}
                    fullWidth
                  />
                ) : (
                  <Typography>{profile.school}</Typography>
                )}
              </Box>

              <Box>
                <Typography>Age:</Typography>
                {isEditing ? (
                  <TextField
                    name="age"
                    value={editProfile.age}
                    onChange={(e) => setEditProfile({ ...editProfile, age: e.target.value })}
                    fullWidth
                  />
                ) : (
                  <Typography>{profile.age}</Typography>
                )}
              </Box>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
