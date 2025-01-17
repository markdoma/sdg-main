import { PaperClipIcon } from "@heroicons/react/20/solid";
import { useRouter } from "next/router";
import { useState, useRef, useEffect } from "react";
import { db } from "@/utils/firebase";
import { doc, updateDoc, Timestamp } from "firebase/firestore";

export default function Details({ member }) {
  const router = useRouter();
  const [editableField, setEditableField] = useState(null);
  const [updatedMember, setUpdatedMember] = useState(member);
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
    const memberRef = doc(db, "master_data", member.id);
    await updateDoc(memberRef, { [field]: updatedMember[field] });
    setEditableField(null);
  };

  const handleChange = (e, field) => {
    const value = e.target.value;
    setUpdatedMember((prevDetails) => ({
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
    if (!date) return "";
    const d = new Date(date.seconds ? date.seconds * 1000 : date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const fields = [
    // Personal
    { label: "First Name", value: "firstname" },
    { label: "Last Name", value: "lastname" },
    { label: "Middle Name", value: "middlename" },
    { label: "Suffix", value: "suffix" },
    { label: "Nickname", value: "nickname" },
    { label: "Birthdate", value: "birthdate" },
    { label: "Wedding Date", value: "weddingdate" },
    { label: "Gender", value: "gender" },
    { label: "Civil Status", value: "civilstatus" },
    { label: "Blood Type", value: "bloodtype" },
    { label: "Fathers Name", value: "fathersname" },
    { label: "Mothers Name", value: "mothersname" },
    // Contact
    { label: "Contact Number", value: "contact" },
    { label: "Email Address", value: "emailadd" },
    // Address
    { label: "Address Line 1", value: "street" },
    { label: "Barangay", value: "brgy" },
    { label: "City", value: "city" },
    { label: "Province", value: "province" },
    { label: "Region", value: "region" },
    // ligaya
    { label: "Service Role", value: "service_role" },
    { label: "CWR Year", value: "cwryear" },
    { label: "Entry", value: "entry" },
    { label: "Ligaya Class", value: "ligaya_class" },
    { label: "Pastoral Leader", value: "pl" },
    { label: "SDG Class", value: "sdg_class" },
    { label: "Service Role", value: "service_role" },
    { label: "Status", value: "status" },
    { label: "Company/School", value: "company_school" },
    { label: "Profession or Course", value: "profession_course" },
    { label: "Church", value: "chrurch" },

    // { label: "Insert Date", value: "insert_date" },
    // { label: "Update Date", value: "update_date" },

    // { label: "Inserted By", value: "insert_by" },
    // Add more fields as needed
  ];

  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-6 sm:px-6">
        <h3 className="text-base font-semibold leading-7 text-gray-900">
          Member Information
        </h3>
        <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">
          Personal details
        </p>
      </div>

      <div className="border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          {fields.map((field, index) => (
            <div
              key={index}
              className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6"
            >
              <dt className="text-sm font-medium text-gray-900">
                {field.label}
              </dt>
              <dd className="mt-1 flex text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {editableField === field.value ? (
                  field.value.includes("date") ? (
                    <input
                      type="date"
                      ref={inputRef}
                      value={formatDate(updatedMember[field.value])}
                      onChange={(e) => handleChange(e, field.value)}
                      onKeyDown={(e) => handleKeyDown(e, field.value)}
                      className="rounded-md border-gray-300 p-2 text-gray-900 grow"
                    />
                  ) : (
                    <input
                      type="text"
                      ref={inputRef}
                      value={updatedMember[field.value] || ""}
                      onChange={(e) => handleChange(e, field.value)}
                      onKeyDown={(e) => handleKeyDown(e, field.value)}
                      className="rounded-md border-gray-300 p-2 text-gray-900 grow"
                    />
                  )
                ) : (
                  <span className="grow">
                    {field.value.includes("date")
                      ? updatedMember[field.value] &&
                        !isNaN(
                          new Date(
                            updatedMember[field.value].seconds
                              ? updatedMember[field.value].seconds * 1000
                              : updatedMember[field.value]
                          ).getTime()
                        )
                        ? new Date(
                            updatedMember[field.value].seconds
                              ? updatedMember[field.value].seconds * 1000
                              : updatedMember[field.value]
                          ).toDateString()
                        : ""
                      : updatedMember[field.value]}
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
