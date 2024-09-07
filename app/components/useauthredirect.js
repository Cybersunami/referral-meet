import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '../lib/firebase'; 

export const useAuthRedirect = () => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setIsAuthenticated(true); // User is logged in
      } else {
        router.push('/'); // Redirect to home page
      }
      setLoading(false); // Stop loading
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [router]);

  return { isAuthenticated, loading };
};
