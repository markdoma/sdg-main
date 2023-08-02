import { Fragment, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  CalendarIcon,
  ChartPieIcon,
  Cog6ToothIcon,
  DocumentDuplicateIcon,
  FolderIcon,
  HomeIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/20/solid";

import Link from "next/link";

import Members from "../components/Members";

import Attendance from "@/components/Attendance";

// const navigation = [
//   { name: "Dashboard", href: "#", icon: HomeIcon, current: true },
//   { name: "Team", href: "#", icon: UsersIcon, current: false },
//   { name: "Projects", href: "#", icon: FolderIcon, current: false },
//   { name: "Calendar", href: "#", icon: CalendarIcon, current: false },
//   { name: "Documents", href: "#", icon: DocumentDuplicateIcon, current: false },
//   { name: "Reports", href: "#", icon: ChartPieIcon, current: false },
// ];

// const navigation = [
//   { name: "Members", href: "members", icon: HomeIcon },
//   { name: "Team", href: "#team", icon: UsersIcon },
//   { name: "Projects", href: "#projects", icon: FolderIcon },
//   { name: "Calendar", href: "#calendar", icon: CalendarIcon },
//   { name: "Documents", href: "#documents", icon: DocumentDuplicateIcon },
//   { name: "Reports", href: "#reports", icon: ChartPieIcon },
// ];

const navigation = [
  {
    name: "Home",
    href: "/",
    icon: UsersIcon,
    component: "Home",
  },
  { name: "Members", href: "/members", icon: HomeIcon, component: "Members" },
  { name: "Scan QR", href: "/scan", icon: HomeIcon, component: "Scan" },
  {
    name: "Attendance",
    href: "/attendance",
    icon: UsersIcon,
    component: "Attendance",
  },

  {
    name: "Calendar",
    href: "/calendar",
    icon: UsersIcon,
    component: "Calendar",
  },
  //   { name: "Projects", href: "#", icon: FolderIcon, component: Projects },
  //   { name: "Calendar", href: "#", icon: CalendarIcon, component: Calendar },
  //   {
  //     name: "Documents",
  //     href: "#",
  //     icon: DocumentDuplicateIcon,
  //     component: Documents,
  //   },
  //   { name: "Reports", href: "#", icon: ChartPieIcon, component: Reports },
];

const teams = [
  { id: 1, name: "Heroicons", href: "#", initial: "H", current: false },
  { id: 2, name: "Tailwind Labs", href: "#", initial: "T", current: false },
  { id: 3, name: "Workcation", href: "#", initial: "W", current: false },
];
const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Sidebar({ setActiveComponent }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleItemClick = (index, href) => {
    setActiveIndex(index);
    setActiveComponent(index);
    window.location.hash = href;
  };
  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6 pb-4">
      <div className="flex h-16 shrink-0 items-center">
        <img
          className="h-14 w-auto"
          src="/ligaya.png"
          alt="Ligaya ng Panginoon"
          // width="400"
          // height="300"
        />
      </div>
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={classNames(
                      item.current
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                    )}
                  >
                    <item.icon
                      className={classNames(
                        item.current
                          ? "text-indigo-600"
                          : "text-gray-400 group-hover:text-indigo-600",
                        "h-6 w-6 shrink-0"
                      )}
                      aria-hidden="true"
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>
          <li>
            <div className="text-xs font-semibold leading-6 text-gray-400">
              Your teams
            </div>
            <ul role="list" className="-mx-2 space-y-1">
              {navigation.map((item, index) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold ${
                      activeIndex === index
                        ? "bg-gray-50 text-indigo-600"
                        : "text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                    }`}
                    onClick={() => handleItemClick(index, item.href)}
                  >
                    {/* ... */}
                  </a>
                </li>
              ))}
            </ul>
          </li>
          <li className="mt-auto">
            <a
              href="#"
              className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
            >
              <Cog6ToothIcon
                className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-indigo-600"
                aria-hidden="true"
              />
              Settings
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
