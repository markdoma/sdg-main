import "@/styles/globals.css";
import "@/styles/styles.css";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Layout from "@/components/Layout/Layout";
import Login from "@/components/Members/Login"; // Import your Login component

function App({ Component, pageProps }) {
  const router = useRouter();

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
