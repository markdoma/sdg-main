import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import FormCodeChoices from "@/components/FormCodeChoices";
import PageHeadingcopy from "@/components/PageHeadingcopy";

import MasterDownload from "../utils/MasterDownload";

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

export default function Choices() {
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
    <main>
      <FormCodeChoices />
    </main>
  );
}
