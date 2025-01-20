import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ExtractMembers = ({ initialMembers }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

  const formatDate = (date) => {
    if (!date) return "";
    const d = new Date(date.seconds ? date.seconds * 1000 : date);
    return isNaN(d.getTime()) ? "" : d.toISOString().split("T")[0];
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return "";
    const birthDate = new Date(
      birthdate.seconds ? birthdate.seconds * 1000 : birthdate
    );
    const ageDifMs = Date.now() - birthDate.getTime();
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  };

  const calculateYearsMarried = (weddingdate) => {
    if (!weddingdate) return "";
    const weddingDate = new Date(
      weddingdate.seconds ? weddingdate.seconds * 1000 : weddingdate
    );
    const yearsMarried = new Date().getFullYear() - weddingDate.getFullYear();
    return yearsMarried;
  };

  const handleExport = () => {
    const fields = [
      "firstname",
      "lastname",
      "middlename",
      "suffix",
      "nickname",
      "birthdate",
      "weddingdate",
      "gender",
      "civilstatus",
      "bloodtype",
      "fathersname",
      "mothersname",
      "contact",
      "emailadd",
      "street",
      "brgy",
      "city",
      "province",
      "region",
      "service_role",
      "cwryear",
      "entry",
      "ligaya_class",
      "pl",
      "sdg_class",
      "status",
      "company_school",
      "profession_course",
      "chrurch",
      "age", // Add age field
      "years_married", // Add years married field
    ];

    const data = members.map((member) =>
      fields.reduce((acc, field) => {
        if (field === "age") {
          acc[field] = calculateAge(member.birthdate);
        } else if (field === "years_married") {
          acc[field] = calculateYearsMarried(member.weddingdate);
        } else {
          acc[field] = field.includes("date")
            ? formatDate(member[field])
            : member[field] || "";
        }
        return acc;
      }, {})
    );

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Members");

    const date = new Date();
    const dateString = date.toISOString().split("T")[0];
    const timeString = date.toTimeString().split(" ")[0].replace(/:/g, "-");
    XLSX.writeFile(workbook, `MWG_Extract_${dateString}_${timeString}.xlsx`);
  };

  return (
    <button
      onClick={handleExport}
      className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
    >
      Extract Data
    </button>
  );
};

export default ExtractMembers;
