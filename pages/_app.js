import "@/styles/globals.css";
import "@/styles/styles.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Layout from "@/components/Layout/Layout";
import Login from "@/components/Members/Login"; // Import your Login component

import {
  Bars3CenterLeftIcon,
  BellIcon,
  ClockIcon,
  CogIcon,
  CreditCardIcon,
  DocumentChartBarIcon,
  HomeIcon,
  QuestionMarkCircleIcon,
  ScaleIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  BanknotesIcon,
  BuildingOfficeIcon,
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

function App({ Component, pageProps }) {
  const router = useRouter();

  // Determine if the layout should be rendered
  const noLayoutRoutes = ["/", "/login"];
  const shouldRenderLayout = !noLayoutRoutes.includes(router.pathname);

  // Determine navigation based on user registration state

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
