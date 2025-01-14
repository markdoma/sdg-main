import React, { useState, useEffect } from "react";
import Loading from "@/components/Misc/Loading";
import MembersNotYetRegistered from "@/components/Members/MembersNotYetRegistered";
import { db } from "@/utils/firebase";
import { useAuth } from "@/context/AuthContext";

export default function Home({ initialMembers, userEmail, userRole, plName }) {
  const { notRegistered } = useAuth();
  console.log(notRegistered);
  const [members, setMembers] = useState(initialMembers);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loading />;
  }

  // Handle non-registered users
  if (notRegistered) {
    return <MembersNotYetRegistered userEmail={userEmail} />;
  }

  return (
    <div className="bg-white py-8">
      <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            MWG Members
          </h2>
        </div>
        <ul
          role="list"
          className="mx-auto mt-20 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3"
        >
          {members
            .sort((a, b) => a.lastname.localeCompare(b.lastname))
            .map((member) => (
              <li key={member.id}>
                <div className="text-center">
                  <img
                    alt={member.firstname}
                    src={
                      member.gender === "Female"
                        ? "https://avatar.iran.liara.run/public/girl"
                        : "https://avatar.iran.liara.run/public/boy"
                    }
                    className="mx-auto h-56 w-56 rounded-full"
                  />
                  <h3 className="mt-6 text-base font-semibold leading-7 tracking-tight text-gray-900">
                    {member.firstname} {member.lastname}
                  </h3>
                  <p className="text-sm leading-6 text-gray-600">
                    {member.ligaya_class}
                  </p>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
