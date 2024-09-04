// Login.js

import React, { useState } from "react";
import { auth, provider } from "../../utils/firebase";
import { AuthProvider, useAuth } from "../../context/AuthContext";

const Login = () => {
  const { signInWithGoogle } = useAuth();
  const [error, setError] = useState(null);
  // const signInWithGoogle = async () => {
  //   try {
  //     const result = await auth.signInWithPopup(provider);
  //     const user = result.user;
  //     console.log("User signed in:", user);
  //     // Handle post-sign-in logic (e.g., redirect or store user data)
  //   } catch (error) {
  //     console.error("Error signing in with Google:", error.message);
  //     setError(error.message);
  //   }
  // };

  return (
    <div>
      <h1>Login</h1>
      {error && <p>Error: {error}</p>}
      <button onClick={signInWithGoogle}>Sign In with Google</button>
    </div>
  );
};

export default Login;
