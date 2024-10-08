import { useState } from "react";
import { auth, provider } from "../utils/firebase"; // Ensure provider is correctly imported from your Firebase setup
import { AuthProvider, useAuth } from "../context/AuthContext";
const Login = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { signInWithGoogle } = useAuth();

  // const signInWithGoogle = async () => {
  //   setLoading(true);
  //   setError(null); // Reset error before starting sign-in
  //   try {
  //     const result = await auth.signInWithPopup(provider);
  //     const user = result.user;
  //     console.log("User signed in:", user);
  //     // Handle post-sign-in logic (e.g., redirect to home or store user data)
  //     // You can use router.push('/home') here if using Next.js's useRouter
  //   } catch (error) {
  //     console.error("Error signing in with Google:", error.message);
  //     setError(error.message);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            // alt="Your Company"
            // src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            src="/ligaya.png"
            alt="Ligaya ng Panginoon"
            className="mx-auto h-30 w-auto"
          />
          {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your Google Account account
            </h2> */}
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          {/* <form action="#" method="POST" className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-indigo-600 hover:text-indigo-500"
                  >
                    Forgot password?
                  </a>
                </div>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form> */}

          <div className="flex items-center justify-center">
            {/* <button
              onClick={signInWithGoogle}
              disabled={loading}
              className="px-10 py-5 bg-blue-500 text-white rounded"
            >
              {loading ? "Signing in..." : "Sign in with Google"}
            </button> */}

            <img
              // src="https://developers.google.com/identity/images/g-logo.png" // Google logo image URL
              src="/google.png" // Google logo image URL
              alt="Sign in with Google"
              className={`cursor-pointer ${
                loading ? "opacity-50" : "opacity-100"
              }`}
              onClick={signInWithGoogle}
              style={{ width: "200px", height: "auto" }} // Adjust size as needed
            />
            {loading && (
              <p className="ml-4 text-sm text-gray-500">Signing in...</p> // Optional loading message
            )}
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            No Account yet?{" "}
            <a
              href="#"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Contact markdoma10@gmail.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
