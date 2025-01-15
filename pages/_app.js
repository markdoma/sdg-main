import "@/styles/globals.css";
import "@/styles/styles.css";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Layout from "@/components/Layout/Layout"; // Layout component
import Loading from "@/components/Misc/Loading"; // Loading component

import { useEffect } from "react";
function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <AppContent Component={Component} pageProps={pageProps} />
    </AuthProvider>
  );
}

function AppContent({ Component, pageProps }) {
  const { user, error, signInWithGoogle, loading } = useAuth(); // Access user and loading state

  // Show Loading component while data is being fetched
  if (loading) {
    return <Loading />;
  }

  // If the user is authenticated and registered, show the layout
  return user ? (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  ) : (
    // Show login prompt if not authenticated
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Ligaya SDG</span>
              <img
                src="/ligaya.png"
                alt="Ligaya ng Panginoon"
                className="h-20 w-auto"
              />
            </a>
          </div>
        </nav>
      </header>
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Ligaya South District G
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Ligaya SDG is a vibrant and charismatic community that is part of
              Ligaya ng Panginoon. Based in Cavite, its members are united by a
              shared covenant and commitment to living out their faith with
              passion and devotion.
            </p>

            {error && (
              <p className="mt-5 text-lg italic bold text-red-500 ">{error}</p>
            )}
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <img
                src="/google.png"
                alt="Sign in with Google"
                className="cursor-pointer"
                onClick={signInWithGoogle}
                style={{ width: "200px", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
