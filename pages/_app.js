import "@/styles/globals.css";
import "@/styles/styles.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Layout from "@/components/Layout/Layout";
import Login from "@/components/Members/Login"; // Import your Login component

function App({ Component, pageProps }) {
  const router = useRouter();
  // const { user } = useAuth(); // Access authentication context

  // useEffect(() => {
  //   if (user === undefined) return; // Wait until user state is determined

  //   if (user && router.pathname === "/") {
  //     router.push("/home"); // Redirect to /home if user is logged in and on / route
  //   } else if (
  //     !user &&
  //     router.pathname !== "/login" &&
  //     router.pathname !== "/"
  //   ) {
  //     router.push("/login"); // Redirect to /login if user is not logged in and on a protected route
  //   }
  // }, [user, router.pathname]);

  // Determine if the layout should be rendered
  const noLayoutRoutes = ["/", "/login"];
  const shouldRenderLayout = !noLayoutRoutes.includes(router.pathname);

  return (
    <AuthProvider>
      {shouldRenderLayout ? (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      ) : (
        <Component {...pageProps} />
      )}
    </AuthProvider>
  );
}

export default App;
