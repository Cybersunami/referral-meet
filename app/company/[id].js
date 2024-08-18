// pages/company/[id].js
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TextField, Button } from '@mui/material';
import DiscussionCard from '../../components/DiscussionCard';

export default function CompanyPage() {
  const router = useRouter();
  const { id } = router.query;  // id is the dynamic part of the URL
  const [discussions, setDiscussions] = useState([]);
  const [newDiscussion, setNewDiscussion] = useState('');

  useEffect(() => {
    if (!id) return;

    const fetchDiscussions = async () => {
      const q = query(collection(db, 'discussions'), where('companyId', '==', id));
      const querySnapshot = await getDocs(q);
      setDiscussions(
        querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );
    };

    fetchDiscussions();
  }, [id]);

  const handleAddDiscussion = async () => {
    await addDoc(collection(db, 'discussions'), {
      companyId: id,
      companyName: id,  // Assuming the ID is the company name
      content: newDiscussion,
      author: 'Anonymous',
      timestamp: new Date(),
    });
    setNewDiscussion('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Share your thoughts..."
        value={newDiscussion}
        onChange={(e) => setNewDiscussion(e.target.value)}
        sx={{ marginBottom: '20px' }}
      />
      <Button variant="contained" color="primary" onClick={handleAddDiscussion}>
        Add Discussion
      </Button>
      {discussions.map((discussion) => (
        <DiscussionCard key={discussion.id} discussion={discussion} />
      ))}
    </div>
  );
}
