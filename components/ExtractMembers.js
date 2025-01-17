import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

const ExtractMembers = ({ initialMembers }) => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    setMembers(initialMembers);
  }, [initialMembers]);

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
    ];

    const data = members.map((member) =>
      fields.reduce((acc, field) => {
        acc[field] = member[field] || "";
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
