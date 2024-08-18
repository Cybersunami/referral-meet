import * as React from 'react';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import { Stack, TextareaAutosize, Snackbar, Alert  } from '@mui/material';
import { createDiscussionPost } from '../firebasefunctions/poststorage';


export default function DiscussionPost({ open, handleClose }) {
    const [content, setContent] = React.useState('');
    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' });


    const handlePost = async () => {
        if (!content.trim()) {
            setSnackbar({ open: true, message: "Post content can't be empty!", severity: 'error' });
            return;
        }

        const result = await createDiscussionPost(content);
        
        if (result.success) {
            setSnackbar({ open: true, message: "Post created successfully!", severity: 'success' });
            setContent(''); // Clear the textarea
            handleClose(); // Close the modal
        } else {
            setSnackbar({ open: true, message: "Failed to create post. Please try again.", severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <div>
          <Snackbar
              open={snackbar.open}
              autoHideDuration={6000}
              onClose={handleCloseSnackbar}
          >
              <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                  {snackbar.message}
              </Alert>
          </Snackbar>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Stack spacing={2} alignItems={'center'} sx={{ width: 400, bgcolor: 'background.paper', border: '2px solid gray', boxShadow: 24, p: 3, position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
              <h2 id="parent-modal-title">Post your discussion here</h2>
              <TextareaAutosize
                style={{border:'1px solid gray', width: 300, height:150}}
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <Button onClick={handlePost}>Post</Button>
            </Stack>
          </Modal>
        </div>
      );
}
