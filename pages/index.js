import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import Team from "@/components/Members/Team";
import PageHeadingcopy from "@/components/PageHeadingcopy";

import MasterDownload from "../utils/MasterDownload";

import { Fragment, useState, useEffect } from "react";
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

import { db } from "../utils/firebase";
import Link from "next/link";

// export async function getServerSideProps() {
//   // const membersCollection = db.collection("master_data");

//   try {
//     const masterDataSnapshot = await db.collection("master_data").get();
//     const members = masterDataSnapshot.docs.map((doc) => {
//       const data = doc.data();

//       // Convert Firestore Timestamps to ISO strings
//       const serializedData = {
//         id: doc.id,
//         ...data,
//         insert_date: data.insert_date
//           ? data.insert_date.toDate().toISOString()
//           : null,
//         birthdate: data.birthdate
//           ? data.birthdate.toDate().toISOString()
//           : null,
//         weddingdate: data.weddingdate
//           ? data.weddingdate.toDate().toISOString()
//           : null,
//         // Add other fields as necessary
//       };

//       return serializedData;
//     });
//     return {
//       props: {
//         members,
//       },
//     };
//   } catch (error) {
//     console.error("Error fetching documents:", error);
//     return {
//       props: {
//         members: [],
//       },
//     };
//   }
// }

export async function getServerSideProps() {
  try {
    const masterDataSnapshot = await db.collection("master_data").get();
    const members = masterDataSnapshot.docs.map((doc) => {
      const data = doc.data();

      return {
        id: doc.id,
        ...data,
        insert_date: data.insert_date
          ? data.insert_date.toDate().toISOString()
          : null,
        birthdate: data.birthdate
          ? data.birthdate.toDate().toISOString()
          : null,
        weddingdate: data.weddingdate
          ? data.weddingdate.toDate().toISOString()
          : null,
      };
    });

    return {
      props: { members },
    };
  } catch (error) {
    console.error("Error fetching documents:", error);
    return {
      props: {
        members: [],
      },
    };
  }
}

export default function LigayaSdg({ members }) {
  const [cachedMembers, setCachedMembers] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const cachedData = localStorage.getItem("members");
      if (cachedData) {
        // Use cached data if available
        setCachedMembers(JSON.parse(cachedData));
      } else {
        // Cache the data if not present
        localStorage.setItem("members", JSON.stringify(members));
        setCachedMembers(members);
      }
    }
  }, [members]);
  return (
    <>
      <div className="bg-white py-8">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Doma MWG
            </h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              We’re a dynamic group of individuals who are passionate about what
              we do.
            </p>
          </div>
          <ul
            role="list"
            className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
          >
            {cachedMembers.map((member) => (
              <li key={member.id}>
                <Link href={`/members/${member.id}`}>
                  <img
                    alt=""
                    src="https://i.pravatar.cc/300"
                    // src={member.imageUrl}
                    className="mx-auto h-56 w-56 rounded-full"
                  />
                  <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                    {member.firstname} {member.lastname}
                  </h3>
                  <p className="text-sm leading-6 text-gray-600">
                    {member.ligaya_class}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
