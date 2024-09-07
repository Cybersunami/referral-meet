"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Box, Button, Typography, Avatar } from "@mui/material";
import { formatDistanceToNow, format } from "date-fns";
import { deleteDiscussionPost } from "../firebasefunctions/poststorage";
import { auth } from "../lib/firebase";
import { useUser } from "../firebasefunctions/userdata";

const DiscussionCard = ({ discussion, onDelete }) => {
  const [loading, setLoading] = useState(false);
  const [otherUser, setOtherUser] = useState(null);
  const currentUser = auth.currentUser;
  const { user, loading: userLoading } = useUser(discussion.userId);
  const router = useRouter();

  function formatTimestamp(timestamp) {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const isLessThanDayOld = now - date < 24 * 60 * 60 * 1000;
    if (isLessThanDayOld) {
      return formatDistanceToNow(date, { addSuffix: true });
    } else {
      return format(date, "MMM d, yyyy, h:mm a");
    }
  }

  const handleDelete = async () => {
    try {
      await deleteDiscussionPost(discussion.id);
      if (onDelete) onDelete(discussion.id);
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleAvatarClick = () => {
    router.push(`/user/${user.id}`);
  };

  return (
    <Box border={"0.2px solid #DCD7DA"} p={5} width={300} minHeight={100}>
      <Typography>{discussion?.content}</Typography>

      <Box display="flex" alignItems="center" mt={2}>
        {!userLoading ? (
          <Avatar
            sx={{ width: 40, height: 40, cursor: "pointer" }}
            src={
              user?.profilePictureUrl ||
              "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
            }
            onClick={handleAvatarClick}
          />
        ) : (
          <Typography>Loading</Typography>
        )}
        <Typography ml={2}>{discussion?.name}</Typography>
      </Box>

      <Typography>{formatTimestamp(discussion?.createdAt)}</Typography>
      <Typography>{discussion?.school}</Typography>
      {currentUser?.uid === discussion?.userId && (
        <Button
          onClick={handleDelete}
          variant="contained"
          color="secondary"
          size="small"
          sx={{ mt: 2 }}
        >
          Delete
        </Button>
      )}
    </Box>
  );
};

export default DiscussionCard;
