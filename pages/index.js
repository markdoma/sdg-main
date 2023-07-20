import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Members from "@/components/Members";
import Attendance from "@/components/Attendance";

import Link from "next/link";

// const Attendance = React.lazy(() => import("@/components/Attendance"));

import React, { Fragment, useState, Suspense } from "react";
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

export default function Home() {
  //   else if (activeComponent === Calendar) {
  //     renderedComponent = <Calendar />;
  //   } else if (activeComponent === Reports) {
  //     renderedComponent = <Reports />;
  //   }

  return (
    <>
      <div>
        {/* Main content */}
        <div className="lg:pl-72">
          {/* Header */}
          <Header />

          {/* Main section */}
          <main className="py-10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              Hello! Main
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
