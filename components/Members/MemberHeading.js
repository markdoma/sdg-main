import { EnvelopeIcon, PhoneIcon } from "@heroicons/react/20/solid";

// const profile = {
//   // name: "sdsd",
//   email: "ricardo.cooper@example.com",
//   avatar:
//     "https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80",
//   backgroundImage:
//     "https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80",
//   fields: [
//     ["Phone", "(555) 123-4567"],
//     ["Email", "ricardocooper@example.com"],
//     ["Title", "Senior Front-End Developer"],
//     ["Team", "Product Development"],
//     ["Location", "San Francisco"],
//     ["Sits", "Oasis, 4th floor"],
//     ["Salary", "$145,000"],
//     ["Birthday", "June 8, 1990"],
//   ],
// };

export default function MemberHeading({ member }) {
  console.log("hello biboy!!!");
  console.log({ member });
  return (
    <div>
      <div>
        <img
          alt=""
          // src={profile.backgroundImage}
          src="https://images.unsplash.com/photo-1444628838545-ac4016a5418a?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80"
          className="h-32 w-full object-cover lg:h-48"
        />
      </div>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="-mt-12 sm:-mt-16 sm:flex sm:items-end sm:space-x-5">
          <div className="flex">
            <img
              alt=""
              // src={profile.avatar}
              // src="https://images.unsplash.com/photo-1463453091185-61582044d556?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=1024&h=1024&q=80"

              // src={
              //   member.gender === "Female"
              //     ? "https://avatar.iran.liara.run/public/girl"
              //     : "https://avatar.iran.liara.run/public/boy"
              // }
              src={`https://ui-avatars.com/api/?background=0D8ABC&color=fff&name=${member.firstname} ${member.lastname}`}
              className="h-24 w-24 rounded-full ring-4 ring-white sm:h-32 sm:w-32"
            />
          </div>
          <div className="mt-6 sm:flex sm:min-w-0 sm:flex-1 sm:items-center sm:justify-end sm:space-x-6 sm:pb-1">
            <div className="mt-6 min-w-0 flex-1 sm:hidden md:block">
              <h1 className="truncate text-2xl font-bold text-gray-900">
                {member.firstname} {member.lastname}
              </h1>
            </div>
            <div className="mt-6 flex flex-col justify-stretch space-y-3 sm:flex-row sm:space-x-4 sm:space-y-0">
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <EnvelopeIcon
                  aria-hidden="true"
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                />
                <span>Message</span>
              </button>
              <button
                type="button"
                className="inline-flex justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
              >
                <PhoneIcon
                  aria-hidden="true"
                  className="-ml-0.5 mr-1.5 h-5 w-5 text-gray-400"
                />
                <span>Call</span>
              </button>
            </div>
          </div>
        </div>
        <div className="mt-6 hidden min-w-0 flex-1 sm:block md:hidden">
          <h1 className="truncate text-2xl font-bold text-gray-900">
            {member.firstname} {member.lastname}
          </h1>
        </div>
      </div>
    </div>
  );
}
