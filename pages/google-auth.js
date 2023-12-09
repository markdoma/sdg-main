// pages/google-auth.js
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/auth';

const GoogleAuth = () => {
  const router = useRouter();
  const { user, signInWithGoogle, signOut } = useAuth(); // Assuming you have a custom hook for authentication

  useEffect(() => {
    // If the user is already signed in, redirect to the home page
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleSignInWithGoogle = async () => {
    try {
      await signInWithGoogle();
      router.push('/'); // Redirect to home page after successful sign-in
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/'); // Redirect to home page after sign-out
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  return (
    <div>
      {user ? (
        <>
          <p>Welcome, {user.displayName}!</p>
          <button onClick={handleSignOut}>Sign Out</button>
        </>
      ) : (
        <div>
          <button onClick={handleSignInWithGoogle}>Sign In with Google</button>
        </div>
      )}
    </div>
  );
};

export default GoogleAuth;
