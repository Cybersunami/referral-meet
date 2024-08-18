"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { Avatar, Box, Button, Typography, Stack } from "@mui/material";
import { useGetDiscussionPosts } from "../firebasefunctions/poststorage";
import DiscussionCard from "../components/discusstioncard";
import { useUser } from "../firebasefunctions/userdata";

export default function UserProfile({ uid }) {
  const { user, loading, error } = useUser(uid);
  const { discussions } = useGetDiscussionPosts();
  const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>User not found</div>;
  }

  const userDiscussions = discussions.filter(
    (discussion) => discussion.userId === uid
  );

  return (
    <Box sx={{ padding: "20px" }}>
      <Stack
        direction="row"
        spacing={2}
        alignItems="center"
        sx={{ marginBottom: "20px" }}
      >
        <Avatar
          sx={{ width: 100, height: 100 }}
          src={
            user.profilePictureUrl ||
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          }
        />
        <Typography variant="h4">{user.name}</Typography>
      </Stack>
      <Typography variant="body1">Email: {user.email}</Typography>
      <Typography variant="body1">School: {user.school}</Typography>
      <Typography variant="body1">Age: {user.age}</Typography>

      <Typography variant="h5" sx={{ marginTop: "20px" }}>
        {user.name}'s Discussions
      </Typography>
      <Box>
        {userDiscussions.length > 0 ? (
          userDiscussions.map((discussion) => (
            <DiscussionCard
              key={discussion.id}
              discussion={discussion}
              onDelete={(id) => router.reload()} // Reload the page after a post is deleted
            />
          ))
        ) : (
          <Typography>No discussions found</Typography>
        )}
      </Box>
    </Box>
  );
}
