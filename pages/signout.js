import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "../utils/firebase"; // Import Firebase auth

const SignOut = () => {
  const router = useRouter();

  useEffect(() => {
    const signOutUser = async () => {
      try {
        await auth.signOut(); // Sign out the user
        // Use the `replace` method to prevent the user from navigating back to the sign-out page
        router.replace("/"); // Redirect to home page or any other page after sign out
      } catch (error) {
        console.error("Error signing out:", error);
        // Optionally handle the error, e.g., display an error message
      }
    };

    signOutUser(); // Call the sign-out function when the component mounts
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded">
        <h1 className="text-2xl font-bold mb-4">Signing Out...</h1>
        <p>
          If you are not redirected automatically, <a href="/">click here</a>.
        </p>
      </div>
    </div>
  );
};

export default SignOut;
