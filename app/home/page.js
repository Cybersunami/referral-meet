"use client";
import React, { useRef, useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import SearchBar from "../components/searchbar";
import DiscussionCard from "../components/discusstioncard";
import {
  Stack,
  Typography,
  Avatar,
  TextField,
  Box,
  Button,
} from "@mui/material";
import Navbarloggedin from "../components/navbarloggedin";
import DiscussionPost from "../components/DiscussionPost";
import {
  getUserProfile,
  updateUserProfile,
  uploadProfilePicture,
} from "../firebasefunctions/userdata";
import { useGetDiscussionPosts } from "../firebasefunctions/poststorage";
import { useAuthRedirect } from "../firebasefunctions/auth";

export default function Home() {
  useAuthRedirect();
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
  const [open, setOpen] = useState(false);
  const [localDiscussions, setLocalDiscussions] = useState([]);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const fileInputRef = useRef(null);

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

  useEffect(() => {
    if (searchTerm) {
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.school?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers([]); // Clear the filtered users when there's no search term
    }
  }, [users, searchTerm]);

  useEffect(() => {
    const filteredDiscussions = discussions.filter((discussion) =>
      discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      discussion.school?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setLocalDiscussions(filteredDiscussions);
  }, [discussions, searchTerm]);

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

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

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

  if (loading || discussionsLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) {
    return <div>No user profile found.</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <Navbarloggedin />
      <SearchBar onSearch={setSearchTerm} />
      <Stack direction={"row"} justifyContent={"space-between"} padding={10}>
        <Stack spacing={5} marginLeft={25} alignItems={"center"}>
          <Stack spacing={2} marginTop={4}>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <Box key={user.id} border={"1px solid gray"} padding={2}>
                  <Avatar
                    sx={{ width: 40, height: 40, cursor: "pointer" }}
                    src={
                      user?.profilePictureUrl ||
                      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                    }
                    onClick={() => handleAvatarClick(user.id)}
                  />
                  <Typography variant="h6">{user.name}</Typography>
                  <Typography variant="body1">{user.email}</Typography>
                  <Typography variant="body2">{user.school}</Typography>
                </Box>
              ))
            ) : searchTerm ? (
              <Typography>No users found</Typography>
            ) : null}
          </Stack>
          <Box height={20}>
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
        </Stack>

        <Stack
          marginRight={20}
          alignItems={"center"}
          padding={10}
          border={"0.2px solid #DCD7DA"}
          height={400}
          width={135}
          spacing={5}
        >
          {/* Profile box */}
          <Button
            variant="outlined"
            onClick={isEditing ? handleSaveProfile : handleEditToggle}
          >
            {isEditing ? "Save" : "Edit"}
          </Button>

          <Typography fontSize={20}>
            {isEditing ? (
              <TextField
                name="name"
                value={editProfile.name}
                onChange={handleProfileChange}
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
            onClick={handleAvatarClick}
          />
          <input
            accept="image/*"
            style={{ display: "none" }}
            id="upload-profile-picture"
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
          />

          <Stack mr={35}>
            <Stack direction={"row"} spacing={0.5}>
              <Typography>Email:</Typography>
              {isEditing ? (
                <TextField
                  name="email"
                  value={editProfile.email}
                  onChange={handleProfileChange}
                  fullWidth
                />
              ) : (
                <Typography>{profile.email}</Typography>
              )}
            </Stack>

            <Stack direction={"row"} spacing={0.5}>
              <Typography>School:</Typography>
              {isEditing ? (
                <TextField
                  name="school"
                  value={editProfile.school}
                  onChange={handleProfileChange}
                  fullWidth
                />
              ) : (
                <Typography>{profile.school}</Typography>
              )}
            </Stack>

            <Stack direction={"row"} spacing={0.5}>
              <Typography>Age:</Typography>
              {isEditing ? (
                <TextField
                  name="age"
                  value={editProfile.age}
                  onChange={handleProfileChange}
                  fullWidth
                />
              ) : (
                <Typography>{profile.age}</Typography>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </div>
  );
}
