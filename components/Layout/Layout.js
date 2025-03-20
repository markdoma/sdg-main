"use client";

// import FormWithQRCode from "@/components/FormWithQRCode";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  TransitionChild,
} from "@headlessui/react";
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
import ExtractMembers from "../Members/ExtractMembers";
const secondaryNavigation = [
  { name: "Settings", href: "#", icon: CogIcon },
  { name: "Help", href: "#", icon: QuestionMarkCircleIcon },
  { name: "Privacy", href: "#", icon: ShieldCheckIcon },
];
const cards = [
  { name: "Account balance", href: "#", icon: ScaleIcon, amount: "$30,659.45" },
  // More items...
];

// Function to determine the appropriate greeting based on the current time
const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Blessed morning";
  } else if (currentHour < 18) {
    return "Blessed afternoon";
  } else {
    return "Blessed evening";
  }
};

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Layout({ children }) {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const {
    user,
    navigation,
    logout,
    initialMembers,
    userDetails,
    setSearchQuery,
  } = useAuth(); // Add setSearchQuery from context

  console.log(navigation);

  const gotToDashboard = () => {
    router.push("/dashboard");
  };

  const [activePath, setActivePath] = useState(router.pathname);

  useEffect(() => {
    const handleRouteChange = (url) => {
      setActivePath(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);

    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const handleNavClick = (href) => {
    setActivePath(href);
  };

  console.log(user);
  return (
    <>
      <div className="min-h-full">
        <Dialog
          open={sidebarOpen}
          onClose={setSidebarOpen}
          className="relative z-40 lg:hidden"
        >
          <DialogBackdrop
            transition
            className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300 ease-linear data-[closed]:opacity-0"
          />

          <div className="fixed inset-0 z-40 flex">
            <DialogPanel
              transition
              className="relative flex w-full max-w-xs flex-1 transform flex-col bg-cyan-700 pb-4 pt-5 transition duration-300 ease-in-out data-[closed]:-translate-x-full"
            >
              <TransitionChild>
                <div className="absolute right-0 top-0 -mr-12 pt-2 duration-300 ease-in-out data-[closed]:opacity-0">
                  <button
                    type="button"
                    onClick={() => setSidebarOpen(false)}
                    className="relative ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                  >
                    <span className="absolute -inset-0.5" />
                    <span className="sr-only">Close sidebar</span>
                    <XMarkIcon
                      aria-hidden="true"
                      className="h-6 w-6 text-white"
                    />
                  </button>
                </div>
              </TransitionChild>
              <div className="flex flex-shrink-0 items-center px-4">
                <img
                  // alt="Easywire logo"
                  // src="https://tailwindui.com/img/logos/mark.svg?color=cyan&shade=300"

                  src="/ligaya.png"
                  alt="Ligaya ng Panginoon"
                  className="h-20 w-auto"
                />
              </div>
              <nav
                aria-label="Sidebar"
                className="mt-5 h-full flex-shrink-0 divide-y divide-cyan-800 overflow-y-auto"
              >
                <div className="space-y-1 px-2">
                  {navigation.map((item) => {
                    const isActive = activePath === item.href; // Declare isActive here

                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => handleNavClick(item.href)}
                        aria-current={isActive ? "page" : undefined}
                        className={classNames(
                          isActive
                            ? "bg-cyan-800 text-white"
                            : "text-cyan-100 hover:bg-cyan-600 hover:text-white",
                          "group flex items-center rounded-md px-2 py-2 text-base font-medium text-left" // Added text-left class
                        )}
                      >
                        <item.icon
                          aria-hidden="true"
                          className="mr-4 h-6 w-6 flex-shrink-0 text-cyan-200"
                        />
                        {item.name}
                      </a>
                    );
                  })}
                </div>
                <div className="mt-6 pt-6">
                  <div className="space-y-1 px-2">
                    {secondaryNavigation.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-cyan-100 hover:bg-cyan-600 hover:text-white text-left" // Added text-left class
                      >
                        <item.icon
                          aria-hidden="true"
                          className="mr-4 h-6 w-6 text-cyan-200"
                        />
                        {item.name}
                      </a>
                    ))}
                  </div>
                </div>
              </nav>
            </DialogPanel>
            <div aria-hidden="true" className="w-14 flex-shrink-0">
              {/* Dummy element to force sidebar to shrink to fit close icon */}
            </div>
          </div>
        </Dialog>

        {/* Static sidebar for desktop */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
          {/* Sidebar component, swap this element with another sidebar if you like */}
          <div className="flex flex-grow flex-col overflow-y-auto bg-cyan-700 pb-4 pt-5">
            <div className="flex flex-shrink-0 items-center px-4">
              <img
                // alt="Easywire logo"
                // src="https://tailwindui.com/img/logos/mark.svg?color=cyan&shade=300"
                src="/ligaya.png"
                alt="Ligaya ng Panginoon"
                className="h-20 w-auto"
              />
            </div>
            <nav
              aria-label="Sidebar"
              className="mt-5 flex flex-1 flex-col divide-y divide-cyan-800 overflow-y-auto"
            >
              <div className="space-y-1 px-2">
                {navigation.map((item) => {
                  const isActive = activePath === item.href; // Declare isActive here

                  return (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={() => handleNavClick(item.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={classNames(
                        isActive
                          ? "bg-cyan-800 text-white"
                          : "text-cyan-100 hover:bg-cyan-600 hover:text-white",
                        "group flex items-center rounded-md px-2 py-2 text-base font-medium text-left" // Added text-left class
                      )}
                    >
                      <item.icon
                        aria-hidden="true"
                        className="mr-4 h-6 w-6 flex-shrink-0 text-cyan-200"
                      />
                      {item.name}
                    </a>
                  );
                })}
              </div>
              <div className="mt-6 pt-6">
                <div className="space-y-1 px-2">
                  {secondaryNavigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className="group flex items-center rounded-md px-2 py-2 text-base font-medium text-cyan-100 hover:bg-cyan-600 hover:text-white text-left" // Added text-left class
                    >
                      <item.icon
                        aria-hidden="true"
                        className="mr-4 h-6 w-6 text-cyan-200"
                      />
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        </div>

        <div className="flex flex-1 flex-col lg:pl-64">
          <div className="flex h-16 flex-shrink-0 border-b border-gray-200 bg-white lg:border-none">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="border-r border-gray-200 px-4 text-gray-400 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-cyan-500 lg:hidden"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3CenterLeftIcon aria-hidden="true" className="h-6 w-6" />
            </button>
            <div className="flex flex-1 justify-between px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
              <div className="flex flex-1">
                <form action="#" method="GET" className="flex w-full md:ml-0">
                  <label htmlFor="search-field" className="sr-only">
                    Search
                  </label>
                  <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-0 left-0 flex items-center"
                    >
                      <MagnifyingGlassIcon
                        aria-hidden="true"
                        className="h-5 w-5"
                      />
                    </div>
                    <input
                      id="search-field"
                      name="search-field"
                      type="search"
                      placeholder="Search members"
                      className="block h-full w-full border-transparent py-2 pl-8 pr-3 text-gray-900 focus:border-transparent focus:outline-none focus:ring-0 sm:text-sm"
                      onChange={(e) => setSearchQuery(e.target.value)} // Update search query on input change
                    />
                  </div>
                </form>
              </div>

              <div className="ml-4 flex items-center md:ml-6">
                <button
                  type="button"
                  className="relative rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                  <BellIcon aria-hidden="true" className="h-6 w-6" />
                </button>

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <MenuButton className="relative flex max-w-xs items-center rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 lg:rounded-md lg:p-2 lg:hover:bg-gray-50">
                      <span className="absolute -inset-1.5 lg:hidden" />
                      <img
                        alt={user?.displayName || "User Photo"}
                        src={
                          user?.photoURL || "https://via.placeholder.com/150"
                        }
                        // src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                        className="h-8 w-8 rounded-full"
                      />
                      <span className="ml-3 hidden text-sm font-medium text-gray-700 lg:block">
                        <span className="sr-only">Open user menu for </span>
                        {user?.displayName || "User Name"}
                      </span>
                      <ChevronDownIcon
                        aria-hidden="true"
                        className="ml-1 hidden h-5 w-5 flex-shrink-0 text-gray-400 lg:block"
                      />
                    </MenuButton>
                  </div>
                  <MenuItems
                    transition
                    className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
                  >
                    <MenuItem>
                      <Link
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        href="/profile"
                      >
                        Your Profile
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <a
                        href="#"
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                      >
                        Settings
                      </a>
                    </MenuItem>
                    <MenuItem>
                      <button
                        onClick={logout}
                        className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                      >
                        Logout
                      </button>
                    </MenuItem>
                  </MenuItems>
                </Menu>
              </div>
            </div>
          </div>
          <main className="flex-1 pb-8">
            {/* Page header */}
            <div className="bg-white shadow">
              <div className="px-4 sm:px-6 lg:mx-auto lg:max-w-6xl lg:px-8">
                <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-200">
                  <div className="min-w-0 flex-1">
                    {/* Profile */}
                    <div className="flex items-center">
                      <img
                        alt={user?.displayName || "User Photo"}
                        src={
                          user?.photoURL || "https://via.placeholder.com/150"
                        }
                        // src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                        className="hidden h-16 w-16 rounded-full sm:block"
                      />
                      <div>
                        <div className="flex items-center">
                          <img
                            alt={user?.displayName || "User Photo"}
                            src={
                              user?.photoURL ||
                              "https://via.placeholder.com/150"
                            }
                            // src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.6&w=256&h=256&q=80"
                            className="h-16 w-16 rounded-full sm:hidden"
                          />
                          <h1 className="ml-3 text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:leading-9">
                            {getGreeting()},{" "}
                            {user?.displayName
                              ? `${user.displayName.split(" ")[0]}!`
                              : "User Name"}
                          </h1>
                        </div>
                        <dl className="mt-6 flex flex-col sm:ml-3 sm:mt-1 sm:flex-row sm:flex-wrap">
                          <dt className="sr-only">Company</dt>
                          <dd className="flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6">
                            <BuildingOfficeIcon
                              aria-hidden="true"
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                            />
                            Ligaya SDG
                          </dd>
                          <dt className="sr-only">Account status</dt>
                          <dd className="mt-3 flex items-center text-sm font-medium capitalize text-gray-500 sm:mr-6 sm:mt-0">
                            <CheckCircleIcon
                              aria-hidden="true"
                              className="mr-1.5 h-5 w-5 flex-shrink-0 text-green-400"
                            />
                            {userDetails?.service_role}
                          </dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 flex space-x-3 md:ml-4 md:mt-0">
                    {/* <button
                      type="button"
                      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                    >
                      Extract Data
                    </button> */}
                    <ExtractMembers initialMembers={initialMembers} />
                    <button
                      onClick={gotToDashboard}
                      type="button"
                      className="inline-flex items-center rounded-md bg-cyan-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600"
                    >
                      Dashboard
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">{children}</div>
          </main>
        </div>
      </div>
    </>
  );
}
