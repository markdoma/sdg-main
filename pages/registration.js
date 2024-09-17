import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FormWithQRCode from "@/components/FormWithQRCode";
import AttendancePage from "@/components/AttendancePage";
import QRCodeScanner from "@/components/QRCodeScanner";
import PageHeadingcopy from "@/components/PageHeadingcopy";

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

const initialNavigation = [
  { name: "Attendance", href: "#", current: true },
  { name: "Summary", href: "/summary", current: false },
  { name: "Scanner", href: "/scan", current: false },
  // { name: "Collaborators", href: "#", current: false },
  // { name: "Notifications", href: "#", current: false },
];

export default function Registration() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const handleScan = (data) => {
  //   console.log("Scanned QR Code:", data);
  //   // Add your logic to handle the scanned QR code data here
  // };

  const [scanResult, setScanResult] = useState("");
  const [activeTab, setActiveTab] = useState("Attendance"); // State for active tab

  const handleNavClick = (name) => {
    setActiveTab(name);
  };

  const handleScan = (data) => {
    setScanResult(data);
    // console.log("Scanned QR Code:", data);
  };

  const resetScanResult = () => {
    setScanResult("");
  };

  const updatedNavigation = initialNavigation.map((item) => ({
    ...item,
    current: item.name === activeTab,
  }));

  return (
    <>
      <nav className="flex overflow-x-auto border-b border-white/10 py-4">
        <ul
          role="list"
          className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-black-200 sm:px-6 lg:px-8"
        >
          {updatedNavigation.map((item) => (
            <li key={item.name}>
              <a
                href={item.href}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavClick(item.name);
                }}
                className={
                  item.current || activeTab === item.name ? "text-blue-400" : ""
                }
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {activeTab === "Attendance" && <FormWithQRCode />}
      {activeTab === "Summary" && <AttendancePage />}
    </>
  );
}
