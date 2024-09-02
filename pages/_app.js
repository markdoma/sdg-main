import "@/styles/globals.css";
import "@/styles/styles.css";
import { AuthProvider } from "../context/auth";
import Layout from "@/components/Layout/Layout";

export default function App({ Component, pageProps }) {
  return (
    <Layout>
      <AuthProvider>
        <Component {...pageProps} />
      </AuthProvider>
    </Layout>
  );
}
