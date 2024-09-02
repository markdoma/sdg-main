import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FormWithQRCode from "@/components/FormWithQRCode";
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

export default function Attendance() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // const handleScan = (data) => {
  //   console.log("Scanned QR Code:", data);
  //   // Add your logic to handle the scanned QR code data here
  // };

  const [scanResult, setScanResult] = useState("");

  const handleScan = (data) => {
    setScanResult(data);
    // console.log("Scanned QR Code:", data);
  };

  const resetScanResult = () => {
    setScanResult("");
  };

  return (
    <>
      <FormWithQRCode />
    </>
  );
}
