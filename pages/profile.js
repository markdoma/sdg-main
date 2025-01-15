import { useContext, useState, useRef, useEffect } from "react";
import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useAuth } from "@/context/AuthContext";
import { Timestamp } from "firebase/firestore"; // Import Timestamp from Firestore

export default function Profile() {
  const { userDetails, setUserDetails, updateUserDetails } = useAuth();
  const [editableField, setEditableField] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (editableField && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editableField]);

  const handleUpdate = (field) => {
    setEditableField(field);
  };

  const handleSave = async (field) => {
    const updatedDetails = { ...userDetails, [field]: userDetails[field] };
    setUserDetails(updatedDetails);
    await updateUserDetails(updatedDetails);
    setEditableField(null);
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [field]: field.includes("date")
        ? Timestamp.fromDate(new Date(value))
        : value,
    }));
  };

  const handleKeyDown = (e, field) => {
    if (e.key === "Enter") {
      handleSave(field);
    }
  };

  const formatDate = (date) => {
    if (!date || !date.seconds) return "";
    const d = new Date(date.seconds * 1000);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const fields = [
    {
      label: "Birthdate",
      value: "birthdate",
    },
    { label: "Blood Type", value: "bloodtype" },
    { label: "Barangay", value: "brgy" },
    { label: "Church", value: "chrurch" },
    { label: "City", value: "city" },
    { label: "Civil Status", value: "civilstatus" },
    { label: "Company/School", value: "company_school" },
    { label: "Contact", value: "contact" },
    { label: "CWR Year", value: "cwryear" },
    { label: "Email Address", value: "emailadd" },
    { label: "Entry", value: "entry" },
    { label: "Fathers Name", value: "fathersname" },
    { label: "First Name", value: "firstname" },
    { label: "Gender", value: "gender" },
    { label: "Inserted By", value: "insert_by" },
    {
      label: "Insert Date",
      value: "insert_date",
    },
    { label: "Last Name", value: "lastname" },
    { label: "Middle Name", value: "middlename" },
    { label: "Mothers Name", value: "mothersname" },
    { label: "Nickname", value: "nickname" },
    { label: "Profession or Course", value: "profession_course" },
    { label: "Province", value: "province" },
    { label: "Region", value: "region" },
    { label: "SDG Class", value: "sdg_class" },
    { label: "Status", value: "status" },
    { label: "Street", value: "street" },
    { label: "Suffix", value: "suffix" },
    {
      label: "Update Date",
      value: "update_date",
    },
    {
      label: "Wedding Date",
      value: "weddingdate",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div className="px-4 sm:px-0">
        <h3 className="text-base/7 font-semibold text-gray-900">Profile</h3>
        {/* <p className="mt-1 max-w-2xl text-sm/6 text-gray-500">
          Personal details and application.
        </p> */}
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {fields.map((field, index) => (
            <div
              key={index}
              className="px-4 py-6 grid grid-cols-1 sm:grid-cols-2 sm:gap-4 sm:px-0"
            >
              <dt className="text-sm/6 font-medium text-gray-900">
                {field.label}
              </dt>
              <dd className="mt-1 flex text-sm/6 text-gray-700 sm:col-span-1 sm:mt-0">
                {editableField === field.value ? (
                  field.value === "birthdate" ||
                  field.value === "insert_date" ||
                  field.value === "update_date" ||
                  field.value === "weddingdate" ? (
                    <input
                      type="date"
                      ref={inputRef}
                      value={formatDate(userDetails[field.value])}
                      onChange={(e) => handleChange(e, field.value)}
                      onKeyDown={(e) => handleKeyDown(e, field.value)}
                      className="rounded-md border-gray-300 p-2 text-gray-900 grow"
                    />
                  ) : (
                    <input
                      type="text"
                      ref={inputRef}
                      value={userDetails[field.value] || ""}
                      onChange={(e) => handleChange(e, field.value)}
                      onKeyDown={(e) => handleKeyDown(e, field.value)}
                      className="rounded-md border-gray-300 p-2 text-gray-900 grow"
                    />
                  )
                ) : (
                  <span className="grow">
                    {field.value === "birthdate" ||
                    field.value === "insert_date" ||
                    field.value === "update_date" ||
                    field.value === "weddingdate"
                      ? userDetails[field.value]
                        ? new Date(
                            userDetails[field.value].seconds * 1000
                          ).toDateString()
                        : ""
                      : userDetails[field.value]}
                  </span>
                )}
                <span className="ml-4 shrink-0">
                  <button
                    type="button"
                    className="rounded-md bg-white font-medium text-indigo-600 hover:text-indigo-500"
                    onClick={() =>
                      editableField === field.value
                        ? handleSave(field.value)
                        : handleUpdate(field.value)
                    }
                  >
                    {editableField === field.value ? "Save" : "Update"}
                  </button>
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
